import { WebPass } from '../modules/webpass';
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class WebPassService {
    constructor(private http: HttpClient) {
    }

    urlGetData = 'http://www.koalakoker.com/angular/php/api.php/gpass';

    getData() {
        return this.http.get<Array<WebPass>>(this.urlGetData, {responseType: 'json'});
    }
}