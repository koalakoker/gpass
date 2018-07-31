import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";

export interface Config {
    heroesUrl: string;
    textfile: string;
  }

@Injectable()
export class ConfigService {
    constructor(private http: HttpClient) {
    }

    configUrl = 'assets/config.json';

    getConfig() {
        return this.http.get<Config>(this.configUrl);
    }

    getConfigResponse(): Observable<HttpResponse<Config>> {
        return this.http.get<Config>(this.configUrl, {observe: 'response'});
    }
}