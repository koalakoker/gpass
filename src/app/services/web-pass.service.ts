import { WebPass } from '../modules/webpass';
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class WebPassService {
    constructor(private http: HttpClient) {
    }

    urlGetData = 'http://www.koalakoker.com/angular/php/api.php/gpass';

    getData() {
        return this.http.get<Array<WebPass>>(this.urlGetData, {responseType: 'json'});
    }

    update(webPass: WebPass): Observable<any> {
      return this.http.put(this.urlGetData+"/"+webPass.id, webPass, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'gogogogogogoog'
        })
      });
    }
}