import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { WebService } from './services/web.service';
import { Refreshable } from './modules/refreshable';
import { Router, NavigationEnd } from '@angular/router';
import { Category } from './modules/category';
import { ComboBoxComponent } from './combo-box/combo-box.component'
import { LoginService } from './services/login.service'

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
  param = "";
  category: Category[];

  @ViewChild('webPassDropDown')  webPassDropDown:  ElementRef;
  @ViewChild('categoryDropDown') categoryDropDown: ElementRef;
  @ViewChild('usersDropDown')    usersDropDown:    ElementRef;
  webpassActive = "active";
  categoryActive = "";
  userActive = "";
  
  searchString: string = "";

  appState : AppState = AppState.masterPasswordInsert;

  catDataAll = { link: '/list/0', label: "All", activated: "active" }; 
  catData = [];

  routerData = [
    { link: '/newPass'      , label: "New password"          , activated: "" },
    { link: '/changePass'   , label: "Change master password", activated: "" },
    { link: '/dbCreateTable', label: "CreateBackupTable"     , activated: "" },
    { link: '/dbBackup'     , label: "Backup"                , activated: "" }
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
        this.routedComponent.refresh("")
        .then ((strReturn) => {
          this.childInjected = strReturn;
          if (this.isWepPassPage(val.url)) {
            this.routerData.forEach((link) => {
              link.activated = "";
            });
            this.catData.forEach((cat) => {
              if ((cat.link === val.url) || ((val.url === '/') && (cat.label == "All"))) {
                cat.activated = "active";
              }
              else {
                cat.activated = "";
              }
            });
            this.webpassActive  = "active";
            this.categoryActive = "";
            this.userActive     = "";
          } else if (this.isCategoryPage(val.url)) {
            this.categoryActive = "active";
            this.webpassActive  = "";
            this.userActive     = "";
          } else if (this.isUsersPage(val.url)) {
            this.categoryActive = "";
            this.webpassActive  = "";
            this.userActive     = "active";
          } else {
            this.webpassActive  = "";
            this.categoryActive = "";
            this.userActive     = "";
            this.routerData.forEach((link) => {
              if (link.link === val.url) {
                link.activated = "active";
              }
              else {
                link.activated = "";
              }
            });
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

  isWepPassPage(url) {
    return ((url.slice(1, 5) == "list") || (url === '/'));
  }

  isCategoryPage(url) {
    return (url == '/category');
  }

  isUsersPage(url) {
    return (url == '/users');
  }

  ngAfterViewChecked() {
    this.bindDropDown();
  }

  bindDropDown() {
    if (this.webPassDropDown) {
      this.webPassDropDown.nativeElement.addEventListener('show.bs.dropdown', () => {
        if (!this.isWepPassPage(this.router.url)) {
          this.router.navigateByUrl('/list/0');
        }
      });
    }
    
    if (this.categoryDropDown) {
      this.categoryDropDown.nativeElement.addEventListener('show.bs.dropdown', () => {
        if (!this.isCategoryPage(this.router.url)) {
          this.router.navigateByUrl("/category");
        }
      });
    }

    if (this.usersDropDown) {
      this.usersDropDown.nativeElement.addEventListener('show.bs.dropdown', () => {
        if (!this.isUsersPage(this.router.url)) {
          this.router.navigateByUrl("/users");
        }
      });
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
        this.routedComponent.refresh("")
        .then((str) => {
          this.childInjected = str;
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
    this.configService.logout().subscribe(
      (answer: JSON) => {
        console.log("Callback");
        this.loginService.clearSession();
        this.loginService.clearLocal();
        this.appState = AppState.userNameInsert;
        this.routedComponent.refresh("");
        this.childInjected = "";
        this.catData = [];
        this.catData.push(this.catDataAll);
      });
  }

  onNewFunc() {
    // Propagate to child
    this.routedComponent.refresh("btnPress");
  }

  getCategory(encrypted = "") {
    // Get Category list
    this.configService.get(encrypted, 'category').subscribe((data: Array<Category>) => {
      this.category = data;
      this.catData = [];
      this.catData.push(this.catDataAll);
      data.forEach(cat => {
        var newCatList = { link: '/list/' + cat.id, label: cat.name, activated: "" };
        this.catData.push(newCatList);
      });
    }, err => {
      this.printErrorMessage(JSON.stringify(err));
    }
    );
  }

  onSearch() {
    this.searchString = this.comboInput.textToSort;
    this.router.navigateByUrl('/search/' + this.searchString);
  }

  plusOneYearAll() {
    // Propagate to child
    this.routedComponent.refresh("+1Yr.All");
  }

  removeMasterKey() {
    this.loginService.removeMasterKey();
    this.logOut();
  }
}
