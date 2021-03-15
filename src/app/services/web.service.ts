import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebPass } from '../modules/webpass';
import { Category } from '../modules/category';
import { RelWebCat } from '../modules/relwebcat';
import { User } from '../modules/user'
import { isConfigForTesting } from '../modules/config'

@Injectable()
export class WebService {

  loginAddr       : string;
  emailAddr       : string;
  getAddr         : string;
  chiperAddr      : string;

  testing_chipher: string = "";
  userid: number;

  constructor() {
    if (isConfigForTesting()) {
      this.defineConfigFortesting();
    } else {
      this.defineConfigForProduction();
    }
  }

  defineConfigFortesting(): void {
    // For testing create a LAMP server and clone the DB use the following
    var baseAddr: string = "http://192.168.64.3/gpass/php/";
    this.loginAddr       = baseAddr + 'login.php'
    this.emailAddr       = baseAddr + 'email.php'
    this.getAddr         = baseAddr + 'api.php';
    this.chiperAddr      = baseAddr + 'getCriptDBAccess.php';
  }
  
  defineConfigForProduction(): void {
    var baseAddr: string = "https://www.koalakoker.com/gpass/php/";
    this.loginAddr       = baseAddr + 'login.php'
    this.emailAddr       = baseAddr + 'email.php'
    this.getAddr         = baseAddr + 'api.php';
    this.chiperAddr      = baseAddr + 'getCriptDBAccess.php';
  }

  setTesting_chiper(encrypted: string): void {
    if (isConfigForTesting) {
      this.testing_chipher = encrypted;
    }
  }

  setTesting_userid(userid: number): void {
    if (isConfigForTesting) {
      this.userid = userid;
    }
  }

  api(url: string, params?: any, method: string = 'GET', data: any = {} ): Promise<JSON> {
    if (params != null) {
      url += '?' + new URLSearchParams(params).toString();
    }
    var fetchData: any;
    if (method == 'GET')
    {
      fetchData = {
        method: method
      }
    } else {
      fetchData = {
        method: method,
        body: JSON.stringify(data)
      }
    }
    return new Promise<JSON>((resolve, reject) => {
      fetch(url, fetchData)
        .then(Response => {
          resolve(Response.json())
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        })
    })
  }

  // **************************************************
  // **********           Common             **********
  // **************************************************
  login(chipher_password: string, userName: string, userPassword: string) {
    var params = {
      'chipher_password': chipher_password,
      'user_name': userName,
      'user_password': userPassword
    }
    return this.api(this.loginAddr, params); 
  }

  email(params: any) {
    return this.api(this.emailAddr,params);
  }

  logout() {
    var params = {
      'logout': true
    };
    return this.api(this.loginAddr, params);
  }

  get(table: string): Promise<JSON> {
    var chipher_password: string;
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(this.getAddr + '/' + table, params);
  }
  
  getFromUser(table: string): Promise<JSON> {
    var chipher_password: string;
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var params = {
      'chipher_password': chipher_password,
      'fromuser': this.userid
    }
    return this.api(this.getAddr + '/' + table, params);
  }

  delete(id: number, chipher_password: string, table: string = 'gpass'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table + "/" + id;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'DELETE');
  }

  // **************************************************
  // **********          Specific            **********
  // **************************************************
  update(webPass: WebPass, chipher_password: string, table: string = 'gpass'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table + "/" + webPass.id;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'PUT', webPass);
  }

  updateCategory(category: Category, chipher_password: string, table: string = 'category'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table + "/" + category.id;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'PUT', category);
  }

  updateRelWebCat(rel: RelWebCat, chipher_password: string, table: string = 'webcatrel'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table + "/" + rel.id;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'PUT', rel);
  }

  updateUser(user: User): Promise<JSON> {
    var chipher_password: string;
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/users/' + user.id;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'PUT', user);
  }

  create(webPass: WebPass, chipher_password: string, table: string = 'gpass'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'POST', webPass);
  }

  createCategory(category: Category, chipher_password: string, table: string = 'category'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'POST', category);
  }

  createRelWebCat(rel: RelWebCat, chipher_password: string, table: string = 'webcatrel'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'POST', rel);
  }

  createUser(user: User, chipher_password: string, table: string = 'users'): Promise<JSON> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    var url = this.getAddr + '/' + table;
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(url, params, 'POST', user);
  }

  post(body, uri) {
    console.log("Post to be implemented");
    return this.api(uri);
    // return this.http.post(uri, body.toString(), {
    //   responseType: 'text',
    //   observe: 'body',
    //   headers: new HttpHeaders({
    //     'Accept': 'text/html, application/xhtml+xml, */*',
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   })
    // })
  }

  callChipher(chipher_password: string) {
    console.log("callChipher to be implemented");
    var params = {
      'chipher_password': chipher_password,
    }
    return this.api(this.chiperAddr, params, 'GET');
  }
}