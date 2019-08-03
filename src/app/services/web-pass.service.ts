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

  //urlAddr = 'http://localhost/api.php';    // Just for testing to be fied when publishing
  urlAddr =     'https://www.koalakoker.com/angular/php/api.php';
  chiperAddr =  'https://www.koalakoker.com/angular/php/getCriptDBAccess.php';

  apiGet(url: string) {
    return this.http.get(url, {
      responseType: 'json'
    });
  }
  
  // **************************************************
  // **********           Common             **********
  // **************************************************
  get(chipher_password: string, table: string = 'gpass') {
    return this.http.get(this.urlAddr + '/' + table, {
      params: {["chipher_password"]: chipher_password},
      responseType: 'json'
    });
  }

  delete(id: number, chipher_password: string, table: string = 'gpass'): Observable<{}> {
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
    return this.http.put(this.urlAddr + '/' + table +"/"+webPass.id, webPass, {
      params: {["chipher_password"]: chipher_password},
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateCategory(category: Category, chipher_password: string, table: string = 'category'): Observable<any> {
    return this.http.put(this.urlAddr + '/' + table + "/" + category.id, category, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateRelWebCat(rel: RelWebCat, chipher_password: string, table: string = 'webcatrel'): Observable<any> {
    return this.http.put(this.urlAddr + '/' + table + "/" + rel.id, rel, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  create(webPass: WebPass, chipher_password: string, table: string = 'gpass'): Observable<number> {
    return this.http.post<number>(this.urlAddr + '/' + table, webPass, {
      params: {["chipher_password"]: chipher_password},
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  createCategory(category: Category, chipher_password: string, table: string = 'category'): Observable<number> {
    return this.http.post<number>(this.urlAddr + '/' + table, category, {
      params: { ["chipher_password"]: chipher_password },
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  createRelWebCat(rel: RelWebCat, chipher_password: string, table: string = 'webcatrel'): Observable<number> {
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