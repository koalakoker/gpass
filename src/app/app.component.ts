import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { WebService } from './services/web.service';
import { SessionService } from './services/session.service';
import { LocalService} from './services/local.service';
import { Refreshable } from './modules/refreshable';
import { Router, NavigationEnd } from '@angular/router';
import { Category } from './modules/category';
import { ComboBoxComponent } from './combo-box/combo-box.component'

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
  chipher_password: string;
  logged: boolean = false;
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

  appState : AppState = AppState.userNameInsert;
  user : string = ""
  password: string = "";
  keepMeLogged = false;

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
    private sessionService: SessionService,
    private localService: LocalService,
    private router: Router
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
    const localPass         = this.localService.getKey('ChipherPassword');
    const localUserName     = this.localService.getKey('UserName');
    const localUserPassword = this.localService.getKey('UserPassword');
    if ((localPass         != undefined) && (localPass         != '') &&
        (localUserName     != undefined) && (localUserName     != '') &&
        (localUserPassword != undefined) && (localUserPassword != '')) {
      this.chipher_password = localPass;
      this.user             = localUserName;
      this.password         = localUserPassword;
      this.enter();
    }

    const storedPass         = this.sessionService.getKey('ChipherPassword');
    const storedUserName     = this.sessionService.getKey('UserName');
    const storedUserPassword = this.sessionService.getKey('UserPassword');

    if ((storedPass         != undefined) && (storedPass         != '') &&
        (storedUserName     != undefined) && (storedUserName     != '') &&
        (storedUserPassword != undefined) && (storedUserPassword != '')) {
      this.chipher_password = storedPass;
      this.user             = storedUserName;
      this.password         = storedUserPassword;
      this.logged           = true;
    }
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

  clearSession() {
    this.chipher_password = '';
    this.sessionService.setKey('ChipherPassword', '');
    this.sessionService.setKey('EncryptedPassword', '');
    this.sessionService.setKey('SessionToken', '');
    this.sessionService.setKey('UserName', '');
    this.sessionService.setKey('UserPassword', '');
    this.appState = AppState.userNameInsert;
  }

  clearLocal() {
    this.chipher_password = '';
    this.localService.setKey('ChipherPassword', '');
    this.localService.setKey('EncryptedPassword', '');
    this.localService.setKey('SessionToken', '');
    this.localService.setKey('UserName', '');
    this.localService.setKey('UserPassword', '');
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

  usernameEntered() {
    this.appState = AppState.passwordInsert;
  }

  isPasswordState() {
    return this.appState == AppState.passwordInsert;
  }

  passwordEntered() {
    this.appState = AppState.masterPasswordInsert;
  }

  isMasterPasswordState() {
    return this.appState == AppState.masterPasswordInsert;
  }

  isLoggedState() {
    return this.appState == AppState.logged;
  }

  async enter() {
    this.errorMessage = '';
    var encrypted    = await this.g.promise_cryptPass(this.chipher_password);
    var userName     = await this.g.promise_cryptPass(this.user);
    var userPassword = await this.g.promise_cryptPass(this.password);
    this.configService.login(encrypted, userName, userPassword).toPromise()
      .then((answer: JSON) => {
        this.logged = answer["logged"];
        // answer["encrypted"] can be used if session variable is not available in the server
        this.configService.setTesting_chiper(answer["encrypted"]);
        if (this.logged) {
          this.sessionService.setKey('ChipherPassword', this.chipher_password);
          this.sessionService.setKey('EncryptedPassword', encrypted);
          this.sessionService.setKey('SessionToken', answer["sessionToken"]);
          this.sessionService.setKey('UserName', this.user);
          this.sessionService.setKey('UserPassword', this.password);

          if (this.keepMeLogged) {
            this.localService.setKey('ChipherPassword', this.chipher_password);
            this.localService.setKey('EncryptedPassword', encrypted);
            this.localService.setKey('SessionToken', answer["sessionToken"]);
            this.localService.setKey('UserName', this.user);
            this.localService.setKey('UserPassword', this.password);
          }

          this.appState = AppState.logged;
          this.routedComponent.refresh("")
            .then((str) => {
              this.childInjected = str;
            })
            .catch((err) => {
              console.log("Promise error: " + err);
            });
          this.getCategory();
        }
        else {
          this.clearSession();
          this.printErrorMessage('Password not correct');
        }
      })
      .catch((err) => {
        this.clearSession();
        this.printErrorMessage('Login error');
        console.log(err);
      });
  }

  logOut() {
    this.configService.logout().subscribe(
      (answer: JSON) => {
        this.logged = false;
        this.clearSession();
        this.clearLocal();
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
}
