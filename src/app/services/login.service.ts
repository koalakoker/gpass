import { Injectable } from '@angular/core';
import { GCrypto } from '../modules/gcrypto';
import { LocalService } from './local.service';
import { User } from '../services/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginApiUrl: string = 'http://localhost:5000/api/auth/';

  gCrypto: GCrypto;
  keepMeLogged = false;
  logged = false;
  userid: number;
  userName: string;
  userPassword: string;
  userHash: string;
  level: number = 0;

  constructor(
    private http: HttpClient,
    private localService: LocalService) {
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
      // this.webService.email(params)
      //   .then((answer: JSON) => {
      //     resolve(answer["done"]);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     reject(false);
      //   })
      resolve(true);
      })
  }

  calculateUserHash(userName: string, userPassword: string): string {
    // var user: User = new User();
    // user.username = userName;
    // user.updateHash(userPassword);
    // return user.userhash;
    return '';
  }

  async checkLogin(userName: string, userPassword: string): Promise<number> {

    const user: User = {'email': userName, 'password': userPassword};
    
    try {
      const response = await this.http.post(this.loginApiUrl, user, { observe: 'response', responseType: "text" }).toPromise();
      const token = response.headers.get('x-auth-token');
      if (!token) {
        console.log('Database error\nToken not generated');
      }
      this.localService.setKey('x-auth-token', token);
      this.updateUserLevel();
      return 0;
    } catch (error) {
      console.log(error.error);
      this.clear();
      return 4;
    }
  }

  async isPassInResetState(): Promise<boolean> {
    // let user: JSON = await this.webService.get("users", this.userid);
    // if (user["result"] === "fail" ) {
    //   throw new Error("Error getting user details!");
    // }
    // return user[0]["resetpass"] === "0" ? false : true;
    return false;
  }
  
  checklogged(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.check()) {
        this.logged = true;
        resolve(true);
      } else {
        this.logged = false;
        reject("login.service(checklogged)->User not logged");
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

  check(): boolean {
    return this.localService.getKey('x-auth-token') != '';
  }

  checkRights(minLevel: number): boolean {
    return this.level >= minLevel ? true : false;
  }

  clear(): void {
    this.clearUserVars();
    this.clearLocal();
  }

  clearUserVars(): void {
    this.logged = false;
    this.keepMeLogged = false;
  }

  clearLocal() : void {
    this.localService.setKey('x-auth-token', '');
  }

  updateUserLevel() {
    // To be fixed
    this.level = 1;
  }

  updateUserPassword(newPassword: string) : void {
    // this.userPassword = newPassword;
    // this.userHash = this.calculateUserHash(this.userName, newPassword);
    // if (this.keepMeLogged) {
    //   this.localService.setKey(Keys.UserPassword, this.userPassword);
    //   this.localService.setKey(Keys.UserHash    , this.userHash);
    // }
  }

  logStatus(): void {
    const token = this.localService.getKey('x-auth-token');
    console.log("Token" + token);
    
  }
}
