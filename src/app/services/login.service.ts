import { Injectable } from '@angular/core';
import { GCrypto } from '../modules/gcrypto';
import { SessionService } from './session.service';
import { LocalService } from './local.service';
import { WebService } from './web.service';
import { User } from '../modules/user';
import { ErrorCodes } from '../login/errorCodes';
import { Keys } from './keys';

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
              private webService: WebService) {
    this.gCrypto = new GCrypto(this.webService);
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
      this.webService.email(params)
        .then((answer: JSON) => {
          resolve(answer["done"]);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        })
      })
  }

  calculateUserHash(userName: string, userPassword: string): string {
    var user: User = new User();
    user.username = userName;
    user.updateHash(userPassword);
    return user.userhash;
  }

  async checkLogin(): Promise<number> {

    var strList: string[] = [];
    strList.push(this.chipher_password);
    strList.push(this.chipher_hash);
    strList.push(this.userName);

    if (this.userPassword !== '') {
      this.userHash = this.calculateUserHash(this.userName, this.userPassword);
    } else {
      if (this.userHash === '') {
        this.userHash = this.calculateUserHash(this.userName, '');
      }
    }
    
    strList.push(this.userHash);

    const strListCrypt = await this.gCrypto.promise_cryptText(strList);
    var chipher_password = strListCrypt[0];
    var chipher_hash     = strListCrypt[1];
    var userName         = strListCrypt[2];
    var userHash         = strListCrypt[3];
    
    return new Promise<number>((resolve, reject) => {
      this.webService.login(chipher_password, chipher_hash, userName, userHash)
        .then((answer: JSON) => {
          this.logged = answer["logged"];
          
          if (this.logged) {
            this.userid = answer["userid"];
            this.level = answer["level"];
            
            // answers can be used if session variable is not available in the server
            this.webService.setTesting_chiper(answer["encrypted"]);
            this.webService.setTesting_userid(this.userid);
            this.webService.setTesting_level(this.level);

            this.sessionService.setKey(Keys.ChipherPassword, this.chipher_password);
            this.sessionService.setKey(Keys.ChipherHash    , this.chipher_hash);
            this.sessionService.setKey(Keys.UserName       , this.userName);
            this.sessionService.setKey(Keys.UserPassword   , this.userPassword);
            this.sessionService.setKey(Keys.UserHash       , this.userHash);
            this.sessionService.setKey(Keys.KeepMeLogged   , this.keepMeLogged?"true":"false");
  
            if (this.keepMeLogged) {
              this.localService.setKey(Keys.ChipherPassword, this.chipher_password);
              this.localService.setKey(Keys.ChipherHash    , this.chipher_hash);
              this.localService.setKey(Keys.UserName       , this.userName);
              this.localService.setKey(Keys.UserPassword   , this.userPassword);
              this.localService.setKey(Keys.UserHash       , this.userHash);
              this.localService.setKey(Keys.KeepMeLogged, this.keepMeLogged ? "true" : "false");
            }
            resolve(0);
          } else {
            let errorCode = answer["errorCode"];
            console.log("Check login fails");
            console.log("Error:"+answer["error"]);
            console.log("ErrorCode:" + ErrorCodes[errorCode]);
            
            this.clear();
            resolve(errorCode);
          }
        })
        .catch((err) => {
          this.clear();
          reject(err);
        });
    });
  }

  async isPassInResetState(): Promise<boolean> {
    let user: JSON = await this.webService.get("users", this.userid);
    if (user["result"] === "fail" ) {
      throw new Error("Error getting user details!");
      
    }
    return user["resetpass"] === "0" ? false : true;
  }
  
  checklogged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.check()) {
        this.logged = true;
        resolve(true);
      } else {
        this.logged = false;
        reject("login.service(checklogged)->Wrong password");
      }
    })
  }

  getDefined(value?:string): string {
    let retVal: string;
    if (value == undefined) {
      retVal = '';
    } else {
      retVal = value;
    }
    return retVal;
  }

  getLocal(): void {
    this.chipher_password = this.getDefined(this.localService.getKey(Keys.ChipherPassword));
    this.chipher_hash     = this.getDefined(this.localService.getKey(Keys.ChipherHash));
    this.userName         = this.getDefined(this.localService.getKey(Keys.UserName));
    this.userHash         = this.getDefined(this.localService.getKey(Keys.UserHash));
    this.userPassword     = this.getDefined(this.localService.getKey(Keys.UserPassword)); 
    this.keepMeLogged     = this.getDefined(this.localService.getKey(Keys.KeepMeLogged))==="true"; 
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

  checkRights(minLevel: number): boolean {
    return this.level >= minLevel ? true : false;
  }

  getSession(): void {
    this.chipher_password = this.getDefined(this.sessionService.getKey(Keys.ChipherPassword));
    this.chipher_hash     = this.getDefined(this.sessionService.getKey(Keys.ChipherHash));
    this.userName         = this.getDefined(this.sessionService.getKey(Keys.UserName));
    this.userHash         = this.getDefined(this.sessionService.getKey(Keys.UserHash));
    this.userPassword     = this.getDefined(this.sessionService.getKey(Keys.UserPassword));
    this.keepMeLogged     = this.getDefined(this.sessionService.getKey(Keys.KeepMeLogged)) === "true";
  }

  clear(): void {
    this.clearUserVars();
    this.clearSession();
    this.clearLocal();
  }

  clearUserVars(): void {
    this.logged = false;
    this.userName = '';
    this.userPassword = '';
    this.userHash = '';
    this.keepMeLogged = false;
  }

  clearSession() : void {
    this.sessionService.setKey(Keys.ChipherPassword, '');
    this.sessionService.setKey(Keys.ChipherHash    , '');
    this.sessionService.setKey(Keys.UserName       , '');
    this.sessionService.setKey(Keys.UserPassword   , '');
    this.sessionService.setKey(Keys.UserHash       , '');
    this.sessionService.setKey(Keys.KeepMeLogged   , 'false');
  }

  clearLocal() : void {
    this.localService.setKey(Keys.UserName    , '');
    this.localService.setKey(Keys.UserPassword, '');
    this.localService.setKey(Keys.UserHash    , '');
    this.localService.setKey(Keys.KeepMeLogged, 'false');
  }

  removeMasterKey() : void {
    this.chipher_password = "";
    this.sessionService.setKey(Keys.ChipherPassword, '');
    this.localService  .setKey(Keys.ChipherPassword, '');
  }

  isMasterKeyEmpty() : boolean {
    let retVal: boolean = ((this.localService.getKey(Keys.ChipherPassword) == '') &&
                           (this.localService.getKey(Keys.ChipherHash) == ''))
    return retVal;
  }

  updateUserPassword(newPassword: string) : void {
    this.userPassword = newPassword;
    this.userHash = this.calculateUserHash(this.userName, newPassword);
    this.sessionService.setKey(Keys.UserPassword, this.userPassword);
    this.sessionService.setKey(Keys.UserHash    , this.userHash);
    if (this.keepMeLogged) {
      this.localService.setKey(Keys.UserPassword, this.userPassword);
      this.localService.setKey(Keys.UserHash    , this.userHash);
    }
  }

  logStatus(): void {
    console.log("chipher_password" + this.chipher_password);
    console.log("chipher_hash    " + this.chipher_hash    );
    console.log("userName        " + this.userName        );
    console.log("userPassword    " + this.userPassword    );
    console.log("userHash        " + this.userHash        );
  }
}
