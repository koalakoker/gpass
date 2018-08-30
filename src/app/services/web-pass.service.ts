import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { WebPass } from '../modules/webpass';
import { GCrypto } from '../modules/gcrypto';

@Injectable()
export class WebPassService {
  constructor(private http: HttpClient) {
  }

  urlAddr =     'https://www.koalakoker.com/angular/php/api.php/gpass';
  chiperAddr =  'https://www.koalakoker.com/angular/php/getCriptDBAccess.php';

  get(chipher_password: string) {
    return this.http.get(this.urlAddr, {
      params: {["chipher_password"]: GCrypto.hash(chipher_password)},
      responseType: 'json'
    });
  }

  update(webPass: WebPass, chipher_password: string): Observable<any> {
    return this.http.put(this.urlAddr+"/"+webPass.id, webPass, {
      params: {["chipher_password"]: GCrypto.hash(chipher_password)},
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  create(webPass: WebPass, chipher_password: string): Observable<number> {
    return this.http.post<number>(this.urlAddr, webPass, {
      params: {["chipher_password"]: GCrypto.hash(chipher_password)},
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

  delete(id: number, chipher_password: string): Observable<{}> {
    return this.http.delete(this.urlAddr+"/"+id,{
      params: {["chipher_password"]: GCrypto.hash(chipher_password)},
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
  })
  }

  callChipher(chipher_password: string) {
    return this.http.get(this.chiperAddr, {
      params: {["chipher_password"]: GCrypto.hash(chipher_password)},
      responseType: 'json'
    })
  }
}