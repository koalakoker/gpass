import { Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { WebService } from './services/web.service';
import { SessionService } from './services/session.service';
import { LocalService} from './services/local.service';
import { Refreshable } from './modules/refreshable';
import { Router, NavigationEnd } from '@angular/router';
import { Category } from './modules/category';
import { ComboBoxComponent } from './combo-box/combo-box.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

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

  @ViewChild('webPassDropDown')  webPassDropDown: ElementRef;
  @ViewChild('categoryDropDown') categoryDropDown: ElementRef;
  webpassActive = "active";
  categoryActive = "";
  
  searchString: string = "";
  keepMeLogged = false;

  catDataAll = { link: '/list/0', label: "All", activated: "active" }; 
  catData = [];

  routerData = [
    { link: '/newPass'      , label: "New password"          , activated: ""},
    { link: '/changePass'   , label: "Change master password", activated: ""},
    { link: '/users'        , label: "Users"                 , activated: "" },
    { link: '/dbCreateTable', label: "CreateBackupTable"     , activated: ""},
    { link: '/dbBackup'     , label: "Backup"                , activated: ""}
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
          } else if (this.isCategoryPage(val.url)) {
            this.categoryActive = "active";
            this.webpassActive  = "";
          } else {
            this.webpassActive  = "";
            this.categoryActive = "";
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
    const localPass = this.localService.getKey('ChipherPassword');
    if ((localPass != undefined) && (localPass != '')) {
      this.chipher_password = localPass;
      this.enter();
    }

    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
    }
  }

  isWepPassPage(url) {
    return ((url.slice(1, 5) == "list") || (url === '/'));
  }

  isCategoryPage(url) {
    return (url == '/category');
  }

  ngAfterViewInit() {
    this.webPassDropDown.nativeElement.addEventListener('show.bs.dropdown', () => {
      if (!this.isWepPassPage(this.router.url)) {
        this.router.navigateByUrl('/list/0');
      }
    });

    this.categoryDropDown.nativeElement.addEventListener('show.bs.dropdown', () => {
      if (!this.isCategoryPage(this.router.url)) {
        this.router.navigateByUrl("/category");
      }
    });
  }

  clearSession() {
    this.chipher_password = '';
    this.sessionService.setKey('ChipherPassword', '');
    this.sessionService.setKey('EncryptedPassword', '');
    this.sessionService.setKey('SessionToken', '');
  }

  clearLocal() {
    this.chipher_password = '';
    this.localService.setKey('ChipherPassword', '');
    this.localService.setKey('EncryptedPassword', '');
    this.localService.setKey('SessionToken', '');
  }

  printErrorMessage(txt : string) {
    this.errorMessage = txt;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.errorMessage = '';
      clearInterval(this.interval);
    }, 2000);
  }

  enter() {
    this.errorMessage = '';
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.login(encrypted).subscribe(
        (answer: JSON) => {
          this.logged = answer["logged"];
          // answer["encrypted"] can be used if session variable is not available in the server
          this.configService.setTesting_chiper(answer["encrypted"]);
          if (this.logged) {
            this.sessionService.setKey('ChipherPassword', this.chipher_password);
            this.sessionService.setKey('EncryptedPassword', encrypted);
            this.sessionService.setKey('SessionToken', answer["sessionToken"]);
            
            if (this.keepMeLogged) {
              this.localService.setKey('ChipherPassword', this.chipher_password);
              this.localService.setKey('EncryptedPassword', encrypted);
              this.localService.setKey('SessionToken', answer["sessionToken"]);
            }
            
            this.routedComponent.refresh("")
            .then((str) => {
              this.childInjected = str;
            })
            .catch ((err) => {
              console.log("Promise error: " + err);
            });
            this.getCategory();
          }
          else {
            this.clearSession();
            this.printErrorMessage('Password not correct');
          }
        },
        (answer) => {
          // Error
          this.clearSession();
          this.printErrorMessage('Login error');
          //console.log(answer);
        },
        () => {
          // Complete
        }
      );
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
