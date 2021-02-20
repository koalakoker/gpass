import { Injectable } from '@angular/core';
import { SessionService } from '../services/session.service';
import { GCrypto } from '../modules/gcrypto';
import { WebPassService } from '../services/web-pass.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  g: GCrypto;
  logged = false;
  chipher_password: string;

  constructor(private sessionService: SessionService, private configService: WebPassService) {
    this.g = new GCrypto(this.configService);
   }

  checklogged() {
    return new Promise((resolve, reject) => {
      const storedPass = this.sessionService.getKey('ChipherPassword');
      if ((storedPass != undefined) && (storedPass != '')) {
        this.chipher_password = storedPass;
        this.logged = true;
        resolve(true);
      }
      else {
        this.chipher_password = '';
        this.logged = false;
        reject("Wrong password");
      }
    })
  }
}
