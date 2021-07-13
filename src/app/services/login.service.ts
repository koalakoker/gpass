import jwt_decode from "jwt-decode";
import { Injectable } from '@angular/core';
import { GCrypto } from '../modules/gcrypto';
import { LocalService } from './local.service';
import { IUser } from '../services/user';
import { HttpClient } from '@angular/common/http';
import { JwtDecoded } from "./jwtDecoded";

const localLabelToken: string = 'x-auth-token';
const localLabelPassw: string = 'userPassword';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginApiUrl: string = 'http://localhost:5000/api/auth/';

  gCrypto: GCrypto;
  logged = false;
  userName: string;
  userPassword: string;
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

  async checkLogin(userName: string, userPassword: string): Promise<number> {
    const user: IUser = {'email': userName, 'password': userPassword};
    try {
      const response = await this.http.post(this.loginApiUrl, user, { observe: 'response', responseType: "text" }).toPromise();
      const token = response.headers.get(localLabelToken);
      if (!token) {
        console.log('Database error\nToken not generated');
      }
      this.localService.setKey(localLabelToken, token);
      this.localService.setKey(localLabelPassw, userPassword);
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
    return ((this.getToken() != undefined) && (this.getUserKey() != undefined));
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
  }

  clearLocal() : void {
    this.localService.clearAll();
  }

  updateUserLevel() {
    var decoded = this.getTokenDecoded();
    this.level = 0;
    if (decoded['isAdmin'] == true) {
      this.level = 1;
    };
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
    const token = this.getToken();
    console.log("Token" + token);
    
  }

  getToken(): string {
    return this.localService.getKey(localLabelToken);
  }

  getTokenDecoded(): JwtDecoded {
    const token = this.getToken();
    return jwt_decode(token);
  }

  getUserKey(): string {
    return this.localService.getKey(localLabelPassw);
  }
}
