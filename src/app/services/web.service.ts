import { Injectable } from '@angular/core';
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

  testing_chipher: string = null;
  testing_userid : number = null;
  testing_level  : number = null;

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
    this.emailAddr       = baseAddr + 'inviteUser.php'
    this.getAddr         = baseAddr + 'api.php';
    this.chiperAddr      = baseAddr + 'getCriptDBAccess.php';
  }
  
  defineConfigForProduction(): void {
    var baseAddr: string = "php/";
    this.loginAddr       = baseAddr + 'login.php'
    this.emailAddr       = baseAddr + 'inviteUser.php'
    this.getAddr         = baseAddr + 'api.php';
    this.chiperAddr      = baseAddr + 'getCriptDBAccess.php';
  }

  setTesting_chiper(encrypted: string): void {
    if (isConfigForTesting()) {
      this.testing_chipher = encrypted;
    }
  }

  setTesting_userid(userid: number): void {
    if (isConfigForTesting()) {
      this.testing_userid = userid;
    }
  }
  
  setTesting_level(level: number): void {
    if (isConfigForTesting()) {
      this.testing_level = level;
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
  appendToParams(params, value, key) {
    if (value != null) {
      params[key] = value;
    }
    return params;
  }

  appendTestingsParams(params) {
    params = this.appendToParams(params, this.testing_chipher, 'chipher_password');
    params = this.appendToParams(params, this.testing_userid, 'userid');
    params = this.appendToParams(params, this.testing_level, 'level');
    return params;
  }

  login(chipher_password: string, userName: string, userPassword: string) {
    var params = {
      'chipher_password': chipher_password,
      'user_name': userName,
      'user_password': userPassword
    }
    return this.api(this.loginAddr, params); 
  }

  email(params: any) {
    params = this.appendTestingsParams(params);
    return this.api(this.emailAddr,params);
  }

  logout() {
    var params = {
      'logout': true
    };
    return this.api(this.loginAddr, params);
  }

  get(table: string): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    return this.api(this.getAddr + '/' + table, params);
  }

  getFromUser(table: string): Promise<JSON> {
    var params = {'fromuser': true};
    params = this.appendTestingsParams(params);
    return this.api(this.getAddr + '/' + table, params);
  }

  delete(id: number, table: string): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/' + table + "/" + id;
    return this.api(url, params, 'DELETE');
  }

  // **************************************************
  // **********          Specific            **********
  // **************************************************
  updateWebPass(webPass: WebPass): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/gpass/' + webPass.id;
    return this.api(url, params, 'PUT', webPass);
  }

  updateCategory(category: Category): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/category/' + category.id;
    return this.api(url, params, 'PUT', category);
  }

  updateRelWebCat(rel: RelWebCat): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/webcatrel/' + rel.id;
    return this.api(url, params, 'PUT', rel);
  }

  updateUser(user: User): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/users/' + user.id;
    return this.api(url, params, 'PUT', user);
  }

  createWebPass(webPass: WebPass): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/gpass';
    return this.api(url, params, 'POST', webPass);
  }

  createCategory(category: Category): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/category';
    return this.api(url, params, 'POST', category);
  }

  createRelWebCat(rel: RelWebCat): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/webcatrel';
    return this.api(url, params, 'POST', rel);
  }

  /* Admin */
  createUser(user: User): Promise<JSON> {
    var params = {};
    params = this.appendTestingsParams(params);
    var url = this.getAddr + '/users';
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