import { Injectable } from '@angular/core';
import { GCrypto } from '../modules/gcrypto';
import { SessionService } from './session.service';
import { LocalService } from './local.service';
import { WebService } from './web.service';
import { User } from '../modules/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  g: GCrypto;
  keepMeLogged = false;
  logged = false;
  chipher_password: string = "";
  userName: string = ""
  userid: number;
  userPassword: string = "";
  level: number = 0;

  constructor(private sessionService: SessionService,
              private localService: LocalService,
              private configService: WebService) {
    this.g = new GCrypto(this.configService);
  }

  async decryptList(strList: string[]) {
    const strListCrypt = await this.g.promise_deCryptText(strList, 'Month');
    return strListCrypt;
  }

  async sendLink(params: any): Promise<boolean> {
    
    var strList: string[] = [];
    strList.push(params["user_password"]);
    strList.push(params["return_url"]);
    const strListCrypt = await this.g.promise_cryptText(strList, 'Month');
    params["user_password"] = strListCrypt[0];
    params["return_url"] = strListCrypt[1];
    
    return new Promise<boolean>((resolve, reject) => {
      this.configService.email(params)
        .then((answer: JSON) => {
          resolve(answer["done"]);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        })
      })
  }

  async checkLogin(): Promise<boolean> {

    var strList: string[] = [];
    strList.push(this.chipher_password);
    strList.push(this.userName);

    var user: User = new User();
    user.username = this.userName;
    user.updateHash(this.userPassword);

    strList.push(user.userhash);
    const strListCrypt = await this.g.promise_cryptText(strList);
    var chipher_password = strListCrypt[0];
    var userName = strListCrypt[1];
    var userHash = strListCrypt[2];
    
    return new Promise<boolean>((resolve, reject) => {
      this.configService.login(chipher_password, userName, userHash)
        .then((answer: JSON) => {
          this.logged = answer["logged"];
          this.userid = answer["userid"];
          this.level = answer["level"];
          
          // answers can be used if session variable is not available in the server
          this.configService.setTesting_chiper(answer["encrypted"]);
          this.configService.setTesting_userid(this.userid);
          this.configService.setTesting_level(this.level);
          
          if (this.logged) {
            this.sessionService.setKey('ChipherPassword', this.chipher_password);
            this.sessionService.setKey('EncryptedPassword', chipher_password);
            this.sessionService.setKey('SessionToken', answer["sessionToken"]);
            this.sessionService.setKey('UserName', this.userName);
            this.sessionService.setKey('UserPassword', this.userPassword);
  
            if (this.keepMeLogged) {
              this.localService.setKey('ChipherPassword', this.chipher_password);
              this.localService.setKey('EncryptedPassword', chipher_password);
              this.localService.setKey('SessionToken', answer["sessionToken"]);
              this.localService.setKey('UserName', this.userName);
              this.localService.setKey('UserPassword', this.userPassword);
            }
            resolve(true);
          }
          else {
            this.clearSession();
            this.clearLocal();
            resolve(false);
          }
        })
        .catch((err) => {
          this.clearSession();
          this.clearLocal();
          reject(err);
        });
    });
  }

  checklogged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if ((this.chipher_password !='') &&
          (this.userName         != '') &&
          (this.userPassword     != '')) {
        this.logged = true;
        resolve(true);
      } else {
        this.logged = false;
        reject("Wrong password");
      }
    })
  }

  getLocal(): boolean {
    var retVal: boolean = true;

    this.chipher_password = '';
    const localPass = this.localService.getKey('ChipherPassword');
    if ((localPass != undefined) && (localPass != '')) {
      this.chipher_password = localPass;
    } else {
      retVal = false;
    }

    this.userName = '';
    const localUserName = this.localService.getKey('UserName');
    if ((localUserName != undefined) && (localUserName != ''))
    {
      this.userName = localUserName;
    } else {
      retVal = false;
    }

    this.userPassword = '';
    const localUserPassword = this.localService.getKey('UserPassword');
    if ((localUserPassword != undefined) && (localUserPassword != '')) {
      this.userPassword = localUserPassword;
    } else {
      retVal = false;
    }
    
    return retVal;
  }

  getSession(): boolean {
    var retVal: boolean = true;

    this.userName = '';
    const storedUserName = this.sessionService.getKey('UserName');
    if ((storedUserName != undefined) && (storedUserName != '')) {
      this.userName = storedUserName;
    } else {
      retVal = false;
    }

    this.userPassword = '';
    const storedUserPassword = this.sessionService.getKey('UserPassword');
    if ((storedUserPassword != undefined) && (storedUserPassword != '')) {
      this.userPassword = storedUserPassword;
    } else {
      retVal = false;
    }

    this.chipher_password = '';
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
    } else {
      retVal = false;
    }
    return retVal;
  }

  clearSession() : void {
    this.logged = false;
    this.userName = '';
    this.userPassword = '';
    this.sessionService.setKey('EncryptedPassword', '');
    this.sessionService.setKey('SessionToken', '');
    this.sessionService.setKey('UserName', '');
    this.sessionService.setKey('UserPassword', '');
  }

  clearLocal() : void {
    this.logged = false;
    this.userName = '';
    this.userPassword = '';
    this.localService.setKey('EncryptedPassword', '');
    this.localService.setKey('SessionToken', '');
    this.localService.setKey('UserName', '');
    this.localService.setKey('UserPassword', '');
  }

  removeMasterKey() : void {
    this.sessionService.setKey('ChipherPassword', '');
    this.localService.setKey('ChipherPassword', '');
  }

  updateUserPassword(new_password: string) : void {
    this.userPassword = new_password;
    this.sessionService.setKey('UserPassword', this.userPassword);
    if (this.keepMeLogged) {
      this.localService.setKey('UserPassword', this.userPassword);
    }
  }
}
