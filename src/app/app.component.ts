import { Component, OnInit, ViewChild} from '@angular/core';

import { GCrypto } from './modules/gcrypto';
import { WebService } from './services/web.service';
import { LoginService } from './services/login.service';

import { Router, NavigationEnd } from '@angular/router';
import { Refreshable } from './modules/refreshable/refreshable';
import * as PageCodes from './modules/refreshable/pagesCodes'
import * as ReturnCodes from './modules/refreshable/returnCodes';
import * as InputCodes from './modules/refreshable/inputCodes';

import { Category } from './modules/category';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent, LoginState } from './login/login.component';

import { ItemState, MenuItem } from "./modules/menu/menuItem";
import { DropDown } from "./modules/menu/dropDown";
import { Action } from "./modules/menu/action";
import { Divider } from "./modules/menu/divider";
import { RouterLink } from './modules/menu/routerLink';

enum AppState {
  notLogged,
  logged
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private routedComponent: Refreshable;
  @ViewChild(ComboBoxComponent) private comboInput: ComboBoxComponent;
  @ViewChild(LoginComponent) private loginComponent: LoginComponent;
  
  gCrypto: GCrypto;
  errorMessage: string = '';
  message: string = '';
  DebugTxt: string = "";
  interval;
  childInjected: string = "";
  pageCode: string = "";
  param = "";
  category: Category[];
  activeId = 0;
  collapsed = true;
  searchString: string = "";
  appState : AppState = AppState.notLogged;
  catDataAll: RouterLink = new RouterLink("/list/0", "All", 0, true);
  menu : Array<MenuItem> = [];
  webPassDropDown: DropDown;
  categoryDropDown: DropDown;
  userDropDown: DropDown;

  checkIfForcedToChangePass(): boolean { return true };
  forceToChangePass(): void {
    console.log("Moved to change pass component");
  }
  
  constructor(
    private configService: WebService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.gCrypto = new GCrypto(this.configService);
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd)
      {
        if (this.checkIfForcedToChangePass()) {
          this.forceToChangePass();
        }

        this.routedComponent.refresh(InputCodes.Refresh)
        .then ((returnData) => {
          this.childInjected = returnData.childInject;
          this.pageCode = returnData.pageCode;

          switch (returnData.pageCode) {
            case PageCodes.webPassPage:
              this.webPassDropDownUpdate()
                .then(() => {
                  for (let item of this.webPassDropDown.getItems()) {
                    if (item instanceof RouterLink) {
                      if ((item.link === val.url) || ((val.url === '/') && (item.label == "All"))) {
                        item.activated = true;
                      } else {
                        item.activated = false;
                      }
                    }
                  }
                });
              break;
            case PageCodes.categoryPage:
              this.categoryDropDownUpdate();
              break;
            case PageCodes.usersPage:
              break;
            case PageCodes.newUserPage:
              if (returnData.childInject == ReturnCodes.LoginValid) {
                this.userLogged();
                this.loginComponent.state = LoginState.logged;
                this.router.navigateByUrl('/list/0');
              }
              break;
          
            default:
              
              break;
          }
        })
        .catch((err) => {
          console.log("Promise error: " + err);
        });
      }
    });
    this.menuPopulate();
  }
  
  ngOnInit() {}

  webPassDropDownUpdate(): Promise<void> {
    return new Promise<void> ((resolve,reject) => {
      this.configService.getFromUser('category')
        .then((json: JSON) => {
          var data: Array<Category> = [];
          for (var i in json) {
            let elem: Category = Object.assign(new Category(), json[i]);
            data.push(elem);
          }
          this.category = data;
          this.webPassDropDown.clear();
          this.webPassDropDown.addItem(new Action({name: "New"       , onClick: this.onNew         , state: this.getNewActionState()}));
          this.webPassDropDown.addItem(new Action({name: "+1 Yr. all", onClick: this.plusOneYearAll, state: this.getPlustOneYearAllState()}));
          this.webPassDropDown.addItem(new Action({name: "Logout"    , onClick: this.logOut         }));
          this.webPassDropDown.addItem(new Divider());
          this.webPassDropDown.addItem(this.catDataAll);
          if (this.category) {
            this.category.forEach(cat => {
              let newCatList = new RouterLink('/list/' + cat.id, cat.name, 0, false);
              this.webPassDropDown.addItem(newCatList);
            });
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  categoryDropDownUpdate(): void {
    this.categoryDropDown.clear();;
    this.categoryDropDown.addItem(new Action({ name: "New", onClick: this.onNew, state: this.getNewActionState()}));
  }

  menuPopulate() {
    let dropDown: DropDown;

    dropDown = new DropDown("webPassDropdown", "WebPass");
    this.menu.push(dropDown);
    this.webPassDropDown = dropDown;

    dropDown = new DropDown("categoryDropdown", "Category");
    this.menu.push(dropDown);
    this.categoryDropDown = dropDown;

    dropDown = new DropDown("usersDropdown", "Users", 1);
    dropDown.addItem(new Action({name: "New", onClick: this.onNew }));
    this.menu.push(dropDown);
    this.userDropDown = dropDown;

    dropDown = new DropDown("adminDropdown", "Admin", 1);
    dropDown.addItem(new Action({name: "Remove master key", onClick: this.removeMasterKey}));
    dropDown.addItem(new Action({name: "Test crypt"       , onClick: this.testCrypt      }));
    this.menu.push(dropDown);

    let routerLink: RouterLink;

    routerLink = new RouterLink('/changePass', "Change password");
    this.menu.push(routerLink);

    routerLink = new RouterLink('/newPass', "New password");
    this.menu.push(routerLink);

    routerLink = new RouterLink('/dbCreateTable', "CreateBackupTable", 1);
    this.menu.push(routerLink);

    routerLink = new RouterLink('/dbBackup', "Backup", 1);
    this.menu.push(routerLink);
  }

  dropDownItemClick(item) {
    item.onClick.call(this); // .call is used to pass the context
  }

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
    componentRef.hasChanged.subscribe((event) => this.refreshableHasChanged(event));
  }

  refreshableHasChanged(event) {
    if (event === PageCodes.webPassPage) {
      this.webPassDropDownUpdate();
    }
  }

  tabChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === this.webPassDropDown.index) {
      if (!(this.pageCode == PageCodes.webPassPage)) {
        this.router.navigateByUrl('/list/0');
      }
    }
    if (changeEvent.nextId === this.categoryDropDown.index) {
      if (!(this.pageCode == PageCodes.categoryPage)) {
        this.router.navigateByUrl("/category");
      }
    }
    if (changeEvent.nextId === this.userDropDown.index) {
      if (!(this.pageCode == PageCodes.usersPage)) {
        this.router.navigateByUrl("/users");
      }
    }
  }

  printErrorMessage(txt : string) {
    this.errorMessage = txt;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.errorMessage = '';
      clearInterval(this.interval);
    }, 2000);
  }

  isLoggedState() {
    return this.appState == AppState.logged;
  }

  userLogged() {
    this.routedComponent.refresh(InputCodes.Refresh)
      .then((returnData) => {
        this.childInjected = returnData.childInject;
        this.pageCode = returnData.pageCode;
      })
      .catch((err) => {
        console.log("Promise error: " + err);
      });
    this.webPassDropDownUpdate();
    this.appState = AppState.logged;
  }

  logOut() {
    this.configService.logout()
    .then(
      (answer: JSON) => {
        if (answer["error"] === "Session destroyed") {
          this.loginService.clearSession();
          this.loginService.clearLocal();
          
          // If master key is not present state becomes insert master key
          if (this.loginService.isMasterKeyEmpty()) {
            this.loginComponent.state = LoginState.masterPasswordInsert;
          } else {
            this.loginComponent.state = LoginState.userNameInsert;
          }
          
          this.appState = AppState.notLogged;
          this.routedComponent.refresh(InputCodes.Refresh)
          .catch(err => console.log(err));
          this.childInjected = "";
          this.pageCode = "";
          // Logout
          this.category = [];
        } else {
          ((err) => console.log("Bad answer from server"));
        }
        
      })
    .catch((err) => console.log(err));
  }

  onNew(): void {
    this.routedComponent.refresh(InputCodes.NewBtnPress);
  }

  getNewActionState(): ItemState {
    try {
      return this.routedComponent.queryForAction(InputCodes.NewBtnPress)?ItemState.enabled:ItemState.disabled;
    } catch (error) {
      console.log(error);
    }
  } 

  onSearch() {
    this.searchString = this.comboInput.textToSort;
    this.router.navigateByUrl('/search/' + this.searchString);
  }

  getPlustOneYearAllState() {
    try {
      return this.routedComponent.queryForAction(InputCodes.PlusOneYearAll)?ItemState.enabled:ItemState.disabled;
    } catch (error) {
      console.log(error);
    }
  }
  
  plusOneYearAll() {
    // Propagate to child
    this.routedComponent.refresh(InputCodes.PlusOneYearAll);
  }

  removeMasterKey() {
    this.loginService.removeMasterKey();
    this.logOut();
  }

  checkRights(minLevel: number) {
    return this.loginService.level >= minLevel ? true : false;
  }

  testCrypt() {
    // console.log("Test crypt");
    // let key = "mia nonnina";
    // let cry = GCrypto.crypt("Testo da criptare",key);
    // console.log(cry);
    // let decry = GCrypto.decrypt(cry, key);
    // console.log(decry);
    let strList: string[] = [];
    strList.push("Testo da criptare");
    this.gCrypto.promise_cryptText(strList)
      .then( strListCryp => {
        console.log(strListCryp);
        this.gCrypto.promise_deCryptText(strListCryp)
          .then( strListDecript => {
            console.log(strListDecript);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

}
