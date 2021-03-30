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

import { DropDown } from "./modules/menu/dropDown";
import { Action } from "./modules/menu/action";
import { Divider } from "./modules/menu/divider";
import { RouterLink } from './modules/menu/routerLink';
import { isConstructSignatureDeclaration } from 'typescript';

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

  @ViewChild(ComboBoxComponent) private comboInput: ComboBoxComponent;
  @ViewChild(LoginComponent) private loginComponent: LoginComponent;

  g: GCrypto;

  errorMessage: string = '';
  message: string = '';
  DebugTxt: string = "";
  interval;
  private routedComponent: Refreshable;
  childInjected: string = "";
  pageCode: string = "";
  param = "";
  category: Category[];
  
  activeId = 0;
  collapsed = true;
  
  searchString: string = "";

  appState : AppState = AppState.notLogged;

  catDataAll: RouterLink = new RouterLink("/list/0", "All", true);
  
  // Index for router data starts from 10
  routerData = [
    { link: '/changePass'   , label: "Change password"          , index: 11, minLevel: 0 },
    { link: '/newPass'      , label: "New password"             , index: 10, minLevel: 0 },
    { link: '/dbCreateTable', label: "CreateBackupTable"        , index: 12, minLevel: 1 },
    { link: '/dbBackup'     , label: "Backup"                   , index: 13, minLevel: 1 }
  ];

  refreshableHasChanged(event) {
    console.log("Warning this have to be done only for category update");
    this.webPassDropDownUpdate();
  }

  webPassDropDownUpdate() {
    // Get Category list
    this.configService.getFromUser('category')
      .then((json: JSON) => {
        var data: Array<Category> = [];
        for (var i in json) {
          let elem: Category = Object.assign(new Category(), json[i]);
          data.push(elem);
        }
        this.category = data;
        this.webPassDropDown.items = [];
        this.webPassDropDown.addItem(new Action("New", this.onNewFunc));
        this.webPassDropDown.addItem(new Action("+1 Yr. all", this.plusOneYearAll));
        this.webPassDropDown.addItem(new Action("Logout", this.logOut));
        this.webPassDropDown.addItem(new Divider());
        this.webPassDropDown.addItem(this.catDataAll);
        if (this.category) {
          this.category.forEach(cat => {
            let newCatList = new RouterLink('/list/' + cat.id, cat.name, false);
            this.webPassDropDown.items.push(newCatList);
          });
        }
      })
      .catch(err => {
        this.printErrorMessage(JSON.stringify(err));
      });
  }

  menuPopulate() {
    let dropDown;

    dropDown = new DropDown("webPassDropdown", "WebPass", 0);
    this.menu.push(dropDown);
    this.webPassDropDown = dropDown;

    dropDown = new DropDown("categoryDropdown", "Category", 0);
    dropDown.addItem(new Action("New", this.onNewFunc));
    this.menu.push(dropDown);

    dropDown = new DropDown("usersDropdown", "Users", 1);
    dropDown.addItem(new Action("New", this.onNewFunc));
    this.menu.push(dropDown);

    dropDown = new DropDown("adminDropdown", "Admin", 1);
    dropDown.addItem(new Action("Remove master key", this.removeMasterKey));
    this.menu.push(dropDown);

  }

  menu : Array<DropDown> = [];
  webPassDropDown: DropDown;

  dropDownItemClick(item) {
    item.onClick.call(this); // .call is used to pass the context
  }

  constructor(
    private configService: WebService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.g = new GCrypto(this.configService);
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd)
      {
        this.routedComponent.refresh(InputCodes.Refresh)
        .then ((returnData) => {
          this.childInjected = returnData.childInject;
          this.pageCode = returnData.pageCode;

          switch (returnData.pageCode) {
            case PageCodes.webPassPage:
              for (let item of this.webPassDropDown.items) {
                if (item instanceof RouterLink) {
                  if ((item.link === val.url) || ((val.url === '/') && (item.label == "All"))) {
                    item.activated = true;
                  } else {
                    item.activated = false;
                  }
                }
              }
              this.activeId = 0;
              break;
            case PageCodes.categoryPage:
              this.activeId = 1;
              break;
            case PageCodes.usersPage:
              this.activeId = 2;
              break;
            case PageCodes.newUserPage:
              if (returnData.childInject == ReturnCodes.LoginValid) {
                this.router.navigateByUrl("/");
              }
              break;
          
            default:
              this.routerData.forEach((link) => {
                if (link.link === val.url) {
                  this.activeId = link.index;
                }
              });
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

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
    componentRef.hasChanged.subscribe((event) => this.refreshableHasChanged(event));
  }

  ngOnInit() {
  }

  tabChange(changeEvent: NgbNavChangeEvent) {
    switch (changeEvent.nextId) {
      case 0:
        if (!(this.pageCode == PageCodes.webPassPage)) {
          this.router.navigateByUrl('/list/0');
        }
        break;
      
      case 1:
        if (!(this.pageCode == PageCodes.categoryPage)) {
          this.router.navigateByUrl("/category");
        }
        break;

      case 2:
        if (!(this.pageCode == PageCodes.usersPage)) {
          this.router.navigateByUrl("/users");
        }
        break;
    
      default:
        break;
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
    console.log("logout()");
    this.configService.logout()
    .then(
      (answer: JSON) => {
        this.loginService.clearSession();
        this.loginService.clearLocal();
        this.loginComponent.state = LoginState.userNameInsert;
        this.appState = AppState.notLogged;
        this.routedComponent.refresh(InputCodes.Refresh);
        this.childInjected = "";
        this.pageCode = "";
        // Logout
        this.category = [];
        this.webPassDropDownUpdate();
        
      });
  }

  onNewFunc() {
    // Propagate to child
    this.routedComponent.refresh(InputCodes.BtnPress);
    this.webPassDropDownUpdate();
  }

  onSearch() {
    this.searchString = this.comboInput.textToSort;
    this.router.navigateByUrl('/search/' + this.searchString);
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

}
