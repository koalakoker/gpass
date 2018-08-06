import { WebPass } from '../modules/webpass';
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class WebPassService {
    constructor(private http: HttpClient) {
    }

    urlAddr = 'http://www.koalakoker.com/angular/php/api.php/gpass';

    get() {
        return this.http.get<Array<WebPass>>(this.urlAddr, {responseType: 'json'});
    }

    update(webPass: WebPass): Observable<any> {
      return this.http.put(this.urlAddr+"/"+webPass.id, webPass, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }

    create(webPass: WebPass): Observable<number> {
      return this.http.post<number>(this.urlAddr, webPass, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
    }
  
    delete(id: number): Observable<{}> {
      return this.http.delete(this.urlAddr+"/"+id,{
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    })
  }
}