import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from '../../../node_modules/rxjs';
import { WebPass } from '../modules/webpass';

@Injectable()
export class WebPassService {
    constructor(private http: HttpClient) {
    }

    urlAddr = 'http://www.koalakoker.com/angular/php/api.php/gpass';

    get(chipher_password: string) {
        return this.http.get<Array<WebPass>>(this.urlAddr, {
          params: {["chipher_password"]:chipher_password},
          responseType: 'json'
        });
    }

    update(webPass: WebPass, chipher_password: string): Observable<any> {
      return this.http.put(this.urlAddr+"/"+webPass.id, webPass, {
        params: {["chipher_password"]:chipher_password},
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }

    create(webPass: WebPass, chipher_password: string): Observable<number> {
      return this.http.post<number>(this.urlAddr, webPass, {
        params: {["chipher_password"]:chipher_password},
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
    }
  
    delete(id: number, chipher_password: string): Observable<{}> {
      return this.http.delete(this.urlAddr+"/"+id,{
        params: {["chipher_password"]:chipher_password},
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    })
  }
}