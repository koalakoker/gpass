import { WebPass } from '../modules/webpass';
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";

@Injectable()
export class WebPassService {
    constructor(private http: HttpClient) {
    }

    //configUrl = 'http://www.koalakoker.com/angular/assets/db_get_json.php';
    urlGetData = 'http://192.168.1.129/angular/php/json.php';

    getData() {
        return this.http.get<Array<WebPass>>(this.urlGetData, {responseType: 'json'});
    }
}