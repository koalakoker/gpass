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

  gCrypto: GCrypto;
  keepMeLogged = false;
  logged = false;
  chipher_password: string = "";
  chipher_hash: string = "";
  userName: string = ""
  userid: number;
  userPassword: string = "";
  userHash: string = "";
  level: number = 0;

  constructor(private sessionService: SessionService,
              private localService: LocalService,
              private configService: WebService) {
    this.gCrypto = new GCrypto(this.configService);
  }

  async decryptList(strList: string[]) {
    const strListDeCrypt = await this.gCrypto.promise_deCryptText(strList, 'Month');
    return strListDeCrypt;
  }

  async sendLink(params: any): Promise<boolean> {
    
    var strList: string[] = [];
    strList.push(params["userhash"]);
    strList.push(params["return_url"]);
    const strListCrypt = await this.gCrypto.promise_cryptText(strList, 'Month');
    params["userhash"]   = strListCrypt[0];
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

  async checkLogin(): Promise<number> {

    var strList: string[] = [];
    strList.push(this.chipher_password);
    strList.push(this.chipher_hash);
    strList.push(this.userName);

    if (this.userPassword !== '') {
      var user: User = new User();
      user.username = this.userName;
      user.updateHash(this.userPassword);
      this.userHash = user.userhash;
    }
    if (this.userHash === '') {
      return new Promise<number>((resolve, reject) => {reject(-1)});
    }
    strList.push(this.userHash);

    const strListCrypt = await this.gCrypto.promise_cryptText(strList);
    var chipher_password = strListCrypt[0];
    var chipher_hash     = strListCrypt[1];
    var userName         = strListCrypt[2];
    var userHash         = strListCrypt[3];
    
    return new Promise<number>((resolve, reject) => {
      this.configService.login(chipher_password, chipher_hash, userName, userHash)
        .then((answer: JSON) => {
          this.logged = answer["logged"];
          
          if (this.logged) {
            this.userid = answer["userid"];
            this.level = answer["level"];
            
            // answers can be used if session variable is not available in the server
            this.configService.setTesting_chiper(answer["encrypted"]);
            this.configService.setTesting_userid(this.userid);
            this.configService.setTesting_level(this.level);

            this.sessionService.setKey('ChipherPassword', this.chipher_password);
            this.sessionService.setKey('ChipherHash'    , this.chipher_hash);
            this.sessionService.setKey('EncryptedPassword', answer["encrypted"]);
            this.sessionService.setKey('SessionToken', answer["sessionToken"]);
            this.sessionService.setKey('UserName', this.userName);
            this.sessionService.setKey('UserPassword', this.userPassword);
  
            if (this.keepMeLogged) {
              this.localService.setKey('ChipherPassword', this.chipher_password);
              this.localService.setKey('ChipherHash'    , this.chipher_hash);
              this.localService.setKey('EncryptedPassword', answer["encrypted"]);
              this.localService.setKey('SessionToken', answer["sessionToken"]);
              this.localService.setKey('UserName', this.userName);
              this.localService.setKey('UserPassword', this.userPassword);
            }
            resolve(0);
          } else {
            let errorCode = answer["errorCode"];
            console.log("Check login fails");
            console.log("Error:"+answer["error"]);
            console.log("ErrorCode:" + errorCode);
            
            this.clearSession();
            this.clearLocal();
            resolve(errorCode);
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
      if (this.check()) {
        this.logged = true;
        resolve(true);
      } else {
        this.logged = false;
        reject("Wrong password");
      }
    })
  }

  getLocal(): void {
    this.chipher_password = '';
    const localPass = this.localService.getKey('ChipherPassword');
    if ((localPass != undefined) && (localPass != '')) {
      this.chipher_password = localPass;
    }

    this.chipher_hash = '';
    const localHash = this.localService.getKey('ChipherHash');
    if ((localHash != undefined) && (localHash != '')) {
      this.chipher_hash = localHash;
    }
    
    this.userName = '';
    const localUserName = this.localService.getKey('UserName');
    if ((localUserName != undefined) && (localUserName != ''))
    {
      this.userName = localUserName;
    }

    this.userPassword = '';
    const localUserPassword = this.localService.getKey('UserPassword');
    if ((localUserPassword != undefined) && (localUserPassword != '')) {
      this.userPassword = localUserPassword;
    } 
  }

  check(): boolean {
    var retVal: boolean = true;

    if (((this.chipher_password != '') || (this.chipher_hash != '')) &&
         (this.userName != '') &&
        ((this.userPassword != '') || (this.userHash != '')))
    {
      retVal = true;
    } else {
      retVal = false;
    }

    return retVal;
  }

  getSession(): void {
    this.userName = '';
    const storedUserName = this.sessionService.getKey('UserName');
    if ((storedUserName != undefined) && (storedUserName != '')) {
      this.userName = storedUserName;
    }

    this.userPassword = '';
    const storedUserPassword = this.sessionService.getKey('UserPassword');
    if ((storedUserPassword != undefined) && (storedUserPassword != '')) {
      this.userPassword = storedUserPassword;
    }

    this.chipher_password = '';
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
    }

    this.chipher_hash = '';
    const storedHash = this.sessionService.getKey('ChipherHash');
    if ((storedHash != undefined) && (storedHash != '')) {
      this.chipher_hash = storedHash;
    }
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
    this.chipher_password = "";
    this.sessionService.setKey('ChipherPassword', '');
    this.localService.setKey('ChipherPassword', '');
  }

  isMasterKeyEmpty() : boolean {
    return (this.localService.getKey('ChipherPassword') == '');
  }

  updateUserPassword(new_password: string) : void {
    this.userPassword = new_password;
    this.sessionService.setKey('UserPassword', this.userPassword);
    if (this.keepMeLogged) {
      this.localService.setKey('UserPassword', this.userPassword);
    }
  }
}
