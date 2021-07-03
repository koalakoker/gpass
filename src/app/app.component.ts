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

import { Menu } from "./modules/menu/menu"
import { ItemState, MenuItem } from "./modules/menu/menuItem";
import { DropDown } from "./modules/menu/dropDown";
import { Action } from "./modules/menu/action";
import { Divider } from "./modules/menu/divider";
import { RouterLink } from './modules/menu/routerLink';

enum AppState {
  notLogged,
  logged
}

enum MenuItemTag {
  webPass                  = "webPass",
  webPass_all              = "webPass_all",
  webPass_new              = "webPass_new",
  webPass_plusOneYearAll   = "webPass_plusOneYearAll",
  webPass_logOut           = "webPass_logOut",
  webPass_divider1         = "webPass_divider1",

  category                 = "category",
  category_new             = "category_new",

  users                    = "users",
  users_new                = "users_new",

  admin                    = "admin",
  admin_removeMasterKey    = "removeMasterKey",
  admin_test               = "test",

  routerLink_changePass    = "routerLink_changePass",
  routerLink_newPass       = "routerLink_newPass"
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
  catDataAll: RouterLink = new RouterLink(MenuItemTag.webPass_all, "/list/0", "All", 0, true);
  menu: Menu = new Menu();
  webPassDropDown: DropDown;
  categoryDropDown: DropDown;
  userDropDown: DropDown;

  constructor(
    private configService: WebService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.gCrypto = new GCrypto(this.configService);
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      {
        this.navigationEnd(event);
      }
    });
    this.menuPopulate();
  }

  navigationEnd(event: NavigationEnd) {
    this.componentRefresh(event);
  }

  componentRefresh(event: NavigationEnd): void {
    this.routedComponent.refresh(InputCodes.Refresh)
      .then((returnData) => {
        this.childInjected = returnData.childInject;
        this.pageCode = returnData.pageCode;

        switch (returnData.pageCode) {
          case PageCodes.webPassPage:
            this.webPassDropDownUpdate()
              .then(() => {
                for (let item of this.webPassDropDown.getItems()) {
                  if (item instanceof RouterLink) {
                    if ((item.link === event.url) || ((event.url === '/') && (item.label == "All"))) {
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
          
          default:

            break;
        }
      })
      .catch((err) => {
        console.log("Promise error: " + err);
      });
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
          this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_new            , label: "New"       , onClick: this.onNew         , state: this.getNewActionState()}));
          this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_plusOneYearAll , label: "+1 Yr. all", onClick: this.plusOneYearAll, state: this.getPlustOneYearAllState()}));
          this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_logOut         , label: "Logout"    , onClick: this.logOut         }));
          this.webPassDropDown.addItem(new Divider(MenuItemTag.webPass_divider1));
          this.webPassDropDown.addItem(this.catDataAll);
          if (this.category) {
            this.category.forEach(cat => {
              let newCatList = new RouterLink('webPass_' + cat.name, '/list/' + cat.id, cat.name, 0, false);
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
    this.categoryDropDown.addItem(new Action({ tag: MenuItemTag.category_new, label: "New", onClick: this.onNew, state: this.getNewActionState()}));
  }

  menuPopulate() {
    let dropDown: DropDown;

    dropDown = new DropDown(MenuItemTag.webPass, "WebPass");
    this.menu.push(dropDown);
    this.webPassDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.category, "Category");
    this.menu.push(dropDown);
    this.categoryDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.users, "Users", 1);
    dropDown.addItem(new Action({tag: MenuItemTag.users_new, label: "New", onClick: this.onNew }));
    this.menu.push(dropDown);
    this.userDropDown = dropDown;

    dropDown = new DropDown(MenuItemTag.admin, "Admin", 1);
    dropDown.addItem(new Action({tag: MenuItemTag.admin_removeMasterKey , label: "Remove master key", onClick: this.removeMasterKey}));
    dropDown.addItem(new Action({tag: MenuItemTag.admin_test            , label: "Test"             , onClick: this.test      }));
    this.menu.push(dropDown);

    let routerLink: RouterLink;

    routerLink = new RouterLink(MenuItemTag.routerLink_changePass, '/changePass', "Change password");
    this.menu.push(routerLink);

    routerLink = new RouterLink(MenuItemTag.routerLink_newPass, '/newPass', "New password");
    this.menu.push(routerLink);
  }

  menuHideAllButLogout(): void {
    this.webPassDropDown.getItems().forEach(item => {
      if (item.tag !== MenuItemTag.webPass_logOut) {
        item.visible = false;
      }
    });

    this.menu.forEach(item => {
      if (item.tag !== MenuItemTag.webPass) {
        item.visible = false;
      }
    });
  }

  menuShowAll(): void {
    this.webPassDropDown.getItems().forEach(item => {
      item.visible = true;
    });

    this.menu.forEach(item => {
      item.visible = true;
    });
  }

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
    componentRef.hasChanged.subscribe((event) => this.refreshableHasChanged(event));
  }

  refreshableHasChanged(event) {
    if (event === PageCodes.webPassPage) {
      this.webPassDropDownUpdate();
    }
    if (event === PageCodes.changePass) {
      this.userLogged();
      this.loginComponent.state = LoginState.logged;
      this.router.navigateByUrl("/list/0");
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

  async userLogged() {
    try {
      let returnData = await this.routedComponent.refresh(InputCodes.Refresh);  
      this.childInjected = returnData.childInject;
      this.pageCode = returnData.pageCode;
      await this.webPassDropDownUpdate();
      this.appState = AppState.logged;
      let isPassInResetState = await this.loginService.isPassInResetState();
      if (isPassInResetState) {
        this.menuHideAllButLogout();
        this.router.navigateByUrl('/changePass');
      } else {
        this.menuShowAll();
      }
    } catch (error) {
      console.log(error);
    }
  }

  logOut() {
    this.configService.logout()
    .then(
      (answer: JSON) => {
        if (answer["error"] === "Session destroyed") {
          this.loginService.clear();
          
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

  isItemVisible(menuItem: MenuItem): boolean {
    return this.checkRights(menuItem.minLevel) && menuItem.visible;
  }

  checkRights(minLevel: number) {
    return this.loginService.checkRights(minLevel);
  }

  test() {
    console.log("Admin test");
  }

}
