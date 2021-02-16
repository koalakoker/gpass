import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { WebPass } from '../modules/webpass';
import { Category } from '../modules/category';
import { RelWebCat } from './../modules/relwebcat';

@Injectable()
export class WebPassService {
  constructor(private http: HttpClient) {
  }

  // For testing create a LAMP server and clone the DB 
  //loginAddr = 'http://192.168.64.3/gpass/php/login.php'
  //urlAddr = 'http://192.168.64.3/gpass/php/api.php';
  //chiperAddr = 'http://192.168.64.3/gpass/php/getCriptDBAccess.php';
  
  // Decomment these for final production server use session vars
  loginAddr =   'php/login.php'
  urlAddr =     'php/api.php';
  chiperAddr =  'php/getCriptDBAccess.php';

  setTesting_chiper(encrypted: string) {
    // Comment this for final production server use session vars
    //this.testing_chipher = encrypted;
  }

  testing_chipher : string = "";

  apiGet(url: string) {
    return this.http.get(url, {
      responseType: 'json'
    });
  }

  // **************************************************
  // **********           Common             **********
  // **************************************************
  login(chipher_password: string) {
    return this.http.get(this.loginAddr, {
      params: { ["chipher_password"]: chipher_password },
      responseType: 'json'
    });
  }

  logout() {
    return this.http.get(this.loginAddr, {
      params: { ["chipher_password"]: "logout" },
      responseType: 'json'
    });
  }
  
  get(chipher_password: string, table: string = 'gpass') {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.get(this.urlAddr + '/' + table, {
      params: {["chipher_password"]: chipher_password},
      responseType: 'json'
    });
  }

  delete(id: number, chipher_password: string, table: string = 'gpass'): Observable<{}> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.delete(this.urlAddr + '/' + table + "/" + id, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  // **************************************************
  // **********          Specific            **********
  // **************************************************
  update(webPass: WebPass, chipher_password: string, table: string = 'gpass'): Observable<any> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.put(this.urlAddr + '/' + table +"/"+webPass.id, webPass, {
      params: {["chipher_password"]: chipher_password},
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateCategory(category: Category, chipher_password: string, table: string = 'category'): Observable<any> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.put(this.urlAddr + '/' + table + "/" + category.id, category, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateRelWebCat(rel: RelWebCat, chipher_password: string, table: string = 'webcatrel'): Observable<any> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.put(this.urlAddr + '/' + table + "/" + rel.id, rel, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  create(webPass: WebPass, chipher_password: string, table: string = 'gpass'): Observable<number> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.post<number>(this.urlAddr + '/' + table, webPass, {
      params: {["chipher_password"]: chipher_password},
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  createCategory(category: Category, chipher_password: string, table: string = 'category'): Observable<number> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.post<number>(this.urlAddr + '/' + table, category, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  createRelWebCat(rel: RelWebCat, chipher_password: string, table: string = 'webcatrel'): Observable<number> {
    if (this.testing_chipher != "") {
      chipher_password = this.testing_chipher;
    }
    return this.http.post<number>(this.urlAddr + '/' + table, rel, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  post(body, uri) {
    return this.http.post(uri, body.toString(), {
      responseType: 'text',
      observe: 'body',
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
  }

  callChipher(chipher_password: string) {
    return this.http.get(this.chiperAddr, {
      params: {["chipher_password"]: chipher_password},
      responseType: 'json'
    })
  }
}