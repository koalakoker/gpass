import { Component, OnInit, ViewChild} from '@angular/core';

import { GCrypto } from './modules/gcrypto';
import { LoginService } from './services/login.service';

import { Router, NavigationEnd } from '@angular/router';
import { Refreshable } from './modules/refreshable/refreshable';
import * as PageCodes from './modules/refreshable/pagesCodes'
import * as InputCodes from './modules/refreshable/inputCodes';

import { Category } from './modules/category';
import { ComboBoxComponent } from './components/combo-box/combo-box.component';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './components/login/login.component';
import { LoginState } from './components/login/loginState';

import { Menu } from "./modules/menu/menu"
import { ItemState } from "./modules/menu/menuItem";
import { DropDown } from "./modules/menu/dropDown";
import { Action } from "./modules/menu/action";
import { Divider } from "./modules/menu/divider";
import { RouterLink } from './modules/menu/routerLink';
import { CategoryService } from './services/category.service';
import { MessageBoxService } from './services/message-box.service';
import { UserService } from './services/user.service';
import { User } from './modules/user';

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
  pendingRouterComponentRefresh: boolean = false;
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
  lockDropDownOpen: boolean = true;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private messageBox: MessageBoxService
  ) {
    this.gCrypto = new GCrypto();
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      {
        this.navigationEnd(event);
      }
    });
    this.menuPopulate();
  }

  navigationEnd(event: NavigationEnd) {
    if (this.isLoggedState()) {
      this.componentRefresh(event);
    }
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
  
  ngOnInit() {
  }

  webPassDropDownUpdate(): Promise<void> {
    return new Promise<void> ((resolve,reject) => {
      this.categoryService.getFromUserCategory()
        .then((data: Array<Category>) => {
          this.category = data;
          this.webPassDropDown.clear();
          this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_new            , label: "New"       , onClick: this.onNew         , state: this.getNewActionState()}));
          this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_plusOneYearAll , label: "+1 Yr. all", onClick: this.plusOneYearAll, state: this.getPlustOneYearAllState()}));
          this.webPassDropDown.addItem(new Action({ tag: MenuItemTag.webPass_logOut         , label: "Logout"    , onClick: this.logOut         }));
          this.webPassDropDown.addItem(new Divider(MenuItemTag.webPass_divider1));
          this.webPassDropDown.addItem(this.catDataAll);
          if (this.category) {
            this.category.forEach(cat => {
              let newCatList = new RouterLink('webPass_' + cat.name, '/list/' + cat._id, cat.name, 0, false);
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
    if (this.pendingRouterComponentRefresh) {
      this.userLogged();
    }
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
    this.lockDropDownOpen = true;
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
    if (this.routedComponent == undefined) 
    {
      this.pendingRouterComponentRefresh = true;
      return;
    }
    try {
      this.appState = AppState.logged;
      let returnData = await this.routedComponent.refresh(InputCodes.Refresh);  
      this.childInjected = returnData.childInject;
      this.pageCode = returnData.pageCode;
      await this.webPassDropDownUpdate();
      
      // let isPassInResetState = await this.loginService.isPassInResetState();
      // if (isPassInResetState) {
      //   this.menuHideAllButLogout();
      //   this.router.navigateByUrl('/changePass');
      // } else {
      //   this.menuShowAll();
      // }
    } catch (error) {
      console.log(error);
    }
  }

  clear() {
    this.appState = AppState.notLogged;
  }

  logOut() {
    this.clear();
    this.loginService.clear();
    this.loginComponent.clear();
    this.routedComponent.refresh(InputCodes.Refresh)
    .catch(err => console.log(err));
    this.childInjected = "";
    this.pageCode = "";
    this.category = [];
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

  async onGpassLabel() {
    const me = await this.userService.getUserInfo();
    const user = new User();
    user.username = me['name'];
    user.email = me['email'];
    user.level = me['isAdmin'] ? 1 : 0; 
    this.messageBox.showUser(user);
  }

  test() {
    console.log("Admin test");
  }
}
