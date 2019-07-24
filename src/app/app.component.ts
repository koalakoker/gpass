import { Component, OnInit} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { WebPassService } from './services/web-pass.service';
import { SessionService } from './services/session.service';
import { WebPass } from './modules/webpass';
import { Refreshable } from './modules/refreshable';
import { Router, NavigationEnd } from '@angular/router';

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
  interval;

  routerData = [{link: '/list/0'       , label: "Webpass"               , activated: ""},
                {link: '/category'     , label: "Category"              , activated: ""},
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
        if (val.url.slice(1,5) == "list") {
          this.routerData.forEach((link) => {
            link.activated = "";
          });
          this.routerData[0].activated = "active";
        } else {
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
    })
  }

  ngOnInit() {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
    }
  }

  enter() {
    this.errorMessage = '';
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.get(encrypted).subscribe(
        (data: Array<WebPass>) => {
          this.logged = true;
          this.sessionService.setKey('ChipherPassword', this.chipher_password);
          this.sessionService.setKey('EncryptedPassword', encrypted);
          this.routedComponent.refresh();
        },
        err => {
          this.errorMessage = 'The password is not correct';
          this.chipher_password = '';
          this.sessionService.setKey('ChipherPassword', '');

          clearInterval(this.interval);
          this.interval = setInterval(() => {
            this.errorMessage = '';
            clearInterval(this.interval);
          }, 2000);
        }
      );
    });
  }

  logOut() {
    this.logged = false;
    this.chipher_password = '';
    this.sessionService.setKey('ChipherPassword', '');
    this.routedComponent.refresh();
  }

  private routedComponent: Refreshable;
  public setRoutedComponent(componentRef: Refreshable) {
    this.routedComponent = componentRef;
    this.routedComponent.refresh();
  }
}
