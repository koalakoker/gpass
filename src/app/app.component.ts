import { Component, ViewChild, OnInit, HostListener} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { LoginService } from './services/api/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { Refreshable } from './modules/refreshable/refreshable';
import * as PageCodes from './modules/refreshable/pagesCodes'
import * as InputCodes from './modules/refreshable/inputCodes';
import { ItemState } from "./modules/menu/menuItem";
import { MessageBoxService } from './services/message-box.service';
import { UserService } from './services/api/user.service';
import { ModalAnswers } from './bootstrap/modal/modalAnswers';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ActionsQuery } from './components/navbar/actionsQuery';
import { ActionSignal } from './components/navbar/actionSignal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private routedComponent: Refreshable;
  @ViewChild(NavbarComponent) private navbarComponent: NavbarComponent;
  
  @HostListener('document:keypress', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if ((event.ctrlKey) && (event.key === 'f')) {
      this.navbarComponent.comboInput.setFocus();
    }
  }

  gCrypto: GCrypto;
  errorMessage: string = '';
  message: string = '';
  DebugTxt: string = "";
  interval;
  param = "";
  checkDuration_ms: number = 5000;
  loading: boolean = false;
  routerOutletPaddingTop: number = 0;
  actionsQuery: ActionsQuery = new ActionsQuery();

  constructor(
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
    this.actionsQuery.getDeleteAllStateFn = this.getDeleteAllState;
    this.actionsQuery.getExportActionStateFn = this.getExportActionState;
    this.actionsQuery.getImportActionStateFn = this.getImportActionState;
    this.actionsQuery.getNewActionStateFn = this.getNewActionState;
    this.actionsQuery.getPlustOneYearAllStateFn = this.getPlustOneYearAllState;
    this.actionsQuery.parent = this;
  }

  ngOnInit() {
    //this.checkForBackend();
  }

  onRouterNavigate(url: string) {
    this.router.navigateByUrl(url);
  }

  isLoggedState() {
    return this.loginService.logged;
  }

  navigationEnd(event: NavigationEnd) {
    if (this.isLoggedState) {
      this.componentRefresh(event);
    }
  }

  async onRefresh() {
    try {
      this.loading = true;
      await this.routedComponent.refresh(InputCodes.Refresh);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.printErrorMessage(error);
      return;
    }
  }

  async componentRefresh(event: NavigationEnd): Promise<void> {
    let returnData;
    try {
      this.loading = true;
      returnData  = await this.routedComponent.refresh(InputCodes.Refresh);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
      return;
    }
    this.navbarComponent.afterRefresh(returnData.pageCode, event);
  }

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
    componentRef.hasChanged.subscribe((event) => this.refreshableHasChanged(event));
  }

  refreshableHasChanged(event) {
    if (event === PageCodes.webPassPage) {
      this.navbarComponent.webPassDropDownUpdate();
    }
    if (event === PageCodes.changePass) {
      //this.userLogged();
      //this.loginComponent.state = LoginState.logged;
      //this.router.navigateByUrl("/list/0");
    }
    if (event === PageCodes.waitForBackend) {
      this.router.navigateByUrl("/list/0");
      this.checkForBackend();
    }
    if (event === PageCodes.forceRefresh) {
      this.componentRefresh(event);
    }
  }

  printErrorMessage(txt : string) {
    this.errorMessage = txt;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.errorMessage = '';
      clearInterval(this.interval);
    }, 10000);
  }

  // *****Old code pass in reset state*****
  
  // let isPassInResetState = await this.loginService.isPassInResetState();
  // if (isPassInResetState) {
  //   this.menuHideAllButLogout();
  //   this.router.navigateByUrl('/changePass');
  // } else {
  //   this.menuShowAll();
  // }

  // menuHideAllButLogout(): void {
  //   this.webPassDropDown.getItems().forEach(item => {
  //     if (item.tag !== MenuItemTag.webPass_logOut) {
  //       item.visible = false;
  //     }
  //   });

  //   this.menu.forEach(item => {
  //     if (item.tag !== MenuItemTag.webPass) {
  //       item.visible = false;
  //     }
  //   });
  // }

  // menuShowAll(): void {
  //   this.webPassDropDown.getItems().forEach(item => {
  //     item.visible = true;
  //   });

  //   this.menu.forEach(item => {
  //     item.visible = true;
  //   });
  // }

  onLoading(state) {
    this.loading = state;
  }

  onSendMessage(txt) {
    this.printErrorMessage(txt);
  }

  async checkForBackend(): Promise<boolean> {
    console.log('app.component -> checkForBackend');
    if (!this.isLoggedState()) {
      setTimeout(this.checkForBackend.bind(this), this.checkDuration_ms);
      return;
    }
    try {
      const me = await this.userService.getUserInfo();
      setTimeout(this.checkForBackend.bind(this), this.checkDuration_ms);
      return true;
    } catch (error) {
      //this.appState = AppState.notLogged;
      this.router.navigateByUrl("waitForBackend");
      return false;
    }
  }

  onToggle(value: number) {
    this.routerOutletPaddingTop = value;
  }

  onSearch(searchString) {
    this.router.navigateByUrl('/search/' + searchString);
  }

  /* Actions */

  onActionSignal(action: ActionSignal) {
    switch (action) {
      case ActionSignal.onNewSignal:
          this.onNew();
        break;
      case ActionSignal.deleteAllSignal:
          this.deleteAll();
        break;
      case ActionSignal.plusOneYearAllSignal:
          this.plusOneYearAll();
        break;
      case ActionSignal.onExportSignal:
          this.onExport();
        break;
      case ActionSignal.onImportSignal:
          this.onImport();
        break;
      case ActionSignal.logOutSignal:
          this.logOut();
        break;
      case ActionSignal.testSignal:
          this.test();
        break;
    
      default:
        break;
    }
  }

  getNewActionState(): ItemState {
    try {
      return this.routedComponent.queryForAction(InputCodes.NewBtnPress)?ItemState.enabled:ItemState.disabled;
    } catch (error) {
      console.log(error);
    }
  } 
  
  onNew(): void {
    this.routedComponent.refresh(InputCodes.NewBtnPress);
  }

  getDeleteAllState() {
    try {
      return this.routedComponent.queryForAction(InputCodes.PlusOneYearAll) ? ItemState.enabled : ItemState.disabled;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    const ans = await this.messageBox.question('Warning', 'You are about to delete all. Are you sure?');
    if (ans === ModalAnswers.yes) {
      this.routedComponent.refresh(InputCodes.DeleteAll);
    }
  }

  getPlustOneYearAllState() {
    try {
      return this.routedComponent.queryForAction(InputCodes.PlusOneYearAll) ? ItemState.enabled : ItemState.disabled;
    } catch (error) {
      console.log(error);
    }
  }

  plusOneYearAll() {
    this.routedComponent.refresh(InputCodes.PlusOneYearAll);
  }
  
  getExportActionState(): ItemState {
    try {
      return this.routedComponent.queryForAction(InputCodes.PlusOneYearAll) ? ItemState.enabled : ItemState.disabled;
    } catch (error) {
      console.log(error);
    }
  }
  
  onExport(): void {
    this.routedComponent.refresh(InputCodes.Export);
  }
  
  getImportActionState(): ItemState {
    return ItemState.enabled;
  }

  onImport(): void {
    this.routedComponent.refresh(InputCodes.Import);
  }
  
  async logOut() {
    this.loginService.clear();
    try {
      this.loading = true;
      await this.routedComponent.refresh(InputCodes.Refresh);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
    this.navbarComponent.pageCode = "";
    this.navbarComponent.category = [];
  }

  test() {
    console.log("Admin test");
  }
}
