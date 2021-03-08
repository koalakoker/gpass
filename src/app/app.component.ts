import { Component, OnInit, ViewChild} from '@angular/core';

import { GCrypto } from './modules/gcrypto';
import { WebService } from './services/web.service';
import { LoginService } from './services/login.service'

import { Router, NavigationEnd } from '@angular/router';
import { Refreshable } from './modules/refreshable/refreshable';
import * as PageCodes from './modules/refreshable/pagesCodes'
import * as ReturnCodes from './modules/refreshable/returnCodes';
import * as InputCodes from './modules/refreshable/inputCodes';

import { Category } from './modules/category';
import { ComboBoxComponent } from './combo-box/combo-box.component'
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

enum AppState {
  userNameInsert,
  passwordInsert,
  masterPasswordInsert,
  logged
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(ComboBoxComponent) private comboInput: ComboBoxComponent;

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

  appState : AppState = AppState.masterPasswordInsert;

  catDataAll = { link: '/list/0', label: "All", activated: "active" }; 
  catData = [];

  // Index for router data starts from 10
  routerData = [
    { link: '/newPass'      , label: "New password"          , index: 10 },
    { link: '/changePass'   , label: "Change master password", index: 11 },
    { link: '/dbCreateTable', label: "CreateBackupTable"     , index: 12 },
    { link: '/dbBackup'     , label: "Backup"                , index: 13 }
  ];

  constructor(
    private configService: WebService,
    private router: Router,
    public loginService: LoginService
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
              this.catData.forEach((cat) => {
                if ((cat.link === val.url) || ((val.url === '/') && (cat.label == "All"))) {
                  cat.activated = "active";
                }
                else {
                  cat.activated = "";
                }
              });
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
    this.catData.push(this.catDataAll);
  }

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
  }

  ngOnInit() {
    if (this.loginService.getSession()) {
      this.enter();
    } else {
      if (this.loginService.getLocal()) {
        this.enter();
      } else {
        if (this.loginService.chipher_password == '') {
          this.appState = AppState.masterPasswordInsert;
        } else if (this.loginService.userName == '') {
          this.appState = AppState.userNameInsert;
        } else if (this.loginService.userPassword == '') {
          this.appState = AppState.passwordInsert;
        }
      };
    };
    
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

  isUserNameState() {
    return this.appState == AppState.userNameInsert;
  }
  isPasswordState() {
    return this.appState == AppState.passwordInsert;
  }
  isMasterPasswordState() {
    return this.appState == AppState.masterPasswordInsert;
  }

  materPasswordEntered() {
    this.appState = AppState.userNameInsert;
  }
  usernameEntered() {
    this.appState = AppState.passwordInsert;
  }
  passwordEntered() {
    this.enter();
  }

  isLoggedState() {
    return this.appState == AppState.logged;
  }

  async enter() {
    this.errorMessage = '';
    this.loginService.checkLogin()
    .then( (logged: boolean) => {
      if (logged) {
        this.appState = AppState.logged;
        this.routedComponent.refresh(InputCodes.Refresh)
          .then((returnData) => {
            this.childInjected = returnData.childInject;
            this.pageCode = returnData.pageCode;
        })
        .catch((err) => {
          console.log("Promise error: " + err);
        });
        this.getCategory();
      } else {
        this.appState = AppState.userNameInsert;
        this.printErrorMessage('Password not correct');
      }
    })
    .catch((err) => {
      this.appState = AppState.userNameInsert;
      this.printErrorMessage('Login error');
      console.log(err);
    });
  }

  logOut() {
    this.configService.logout()
    .then(
      (answer: JSON) => {
        this.loginService.clearSession();
        this.loginService.clearLocal();
        this.appState = AppState.userNameInsert;
        this.routedComponent.refresh(InputCodes.Refresh);
        this.childInjected = "";
        this.pageCode = "";
        this.catData = [];
        this.catData.push(this.catDataAll);
      });
  }

  onNewFunc() {
    // Propagate to child
    this.routedComponent.refresh(InputCodes.BtnPress);
  }

  getCategory(encrypted = "") {
    // Get Category list
    this.configService.getFromUser('category')
      .then((json: JSON) => {
        var data: Array <Category> = [];
        for (var i in json) {
          let elem: Category = Object.assign(new Category(), json[i]);
          data.push(elem);
        }
        this.category = data;
        this.catData = [];
        this.catData.push(this.catDataAll);
        data.forEach(cat => {
          var newCatList = { link: '/list/' + cat.id, label: cat.name, activated: "" };
          this.catData.push(newCatList);
        });
      })
      .catch(err => {
        this.printErrorMessage(JSON.stringify(err));
       });
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

  test() {
    
  }
}
