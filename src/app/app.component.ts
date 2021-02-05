import { Component, OnInit} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { WebPassService } from './services/web-pass.service';
import { SessionService } from './services/session.service';
import { WebPass } from './modules/webpass';
import { Refreshable } from './modules/refreshable';
import { Router, NavigationEnd } from '@angular/router';
import { Category } from './modules/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
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
  webpassActive = "active";

  catDataAll = { link: '/list/0', label: "All", activated: "active" }; 
  catData = [];

  routerData = [{link: '/category'     , label: "Category"              , activated: ""},
                {link: '/newPass'      , label: "New password"          , activated: ""},
                {link: '/changePass'   , label: "Change master password", activated: ""},
                {link: '/dbCreateTable', label: "CreateBackupTable"     , activated: ""},
                {link: '/dbBackup'     , label: "Backup"                , activated: ""}];

  constructor(
    private configService: WebPassService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.g = new GCrypto(this.configService);
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd)
      {
        this.childInjected = this.routedComponent.refresh("");
        if ((val.url.slice(1,5) == "list") || (val.url === '/')) {
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
          this.webpassActive = "active";
        } else {
          this.webpassActive = "";
          this.routerData.forEach((link) => {
            if (link.link === val.url) {
              link.activated = "active";
            }
            else {
              link.activated = "";
            }
          });
        }
      }
    });
    this.catData.push(this.catDataAll);
  }

  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
  }

  ngOnInit() {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
    }

  }

  clearSession() {
    this.chipher_password = '';
    this.sessionService.setKey('ChipherPassword', '');
    this.sessionService.setKey('EncryptedPassword', '');
    this.sessionService.setKey('SessionToken', '');
  }

  printErrorMessage(txt : string) {
    this.errorMessage = txt;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.errorMessage = '';
      clearInterval(this.interval);
    //}, 2000);
    }, 200000);
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
            this.childInjected = this.routedComponent.refresh("");
            this.getCategory();
          }
          else {
            this.clearSession();
            this.printErrorMessage('Password not correct');
          }
        },
        (answer) => {
          this.DebugTxt = "app.component.ts-enter()-login.subscribe()-Error";
          this.clearSession();
          this.printErrorMessage('Login error');
        },
        () => {
          this.DebugTxt = "app.component.ts-enter()-login.subscribe()-Complete";
        }
      );
    });
  }

  logOut() {
    this.configService.logout().subscribe(
      (answer: JSON) => {
        this.logged = false;
        this.clearSession();
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
}
