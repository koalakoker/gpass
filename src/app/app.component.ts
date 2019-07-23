import { Component, OnInit} from '@angular/core';
import { GCrypto } from './modules/gcrypto';
import { WebPassService } from './services/web-pass.service';
import { SessionService } from './services/session.service';
import { WebPass } from './modules/webpass';
import { Refreshable } from './modules/refreshable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title: string = "GPass"
  g: GCrypto;
  chipher_password: string;
  logged: boolean = false;
  errorMessage: string = '';
  message: string = '';
  interval;

  constructor(
    private configService: WebPassService,
    private sessionService: SessionService
  ) {
    this.g = new GCrypto(this.configService);
  }

  ngOnInit() {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
      this.enter();
    }
  }

  enter() {
    this.errorMessage = '';
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.get(encrypted).subscribe(
        (data: Array<WebPass>) => {
          this.logged = true;
          this.sessionService.setKey('ChipherPassword', this.chipher_password);
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
