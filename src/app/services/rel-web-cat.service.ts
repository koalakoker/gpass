import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { RelWebCat } from '../modules/relwebcat';
import { LocalService } from './local.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class RelWebCatService {

  private apiUrl: string = 'http://localhost:5000/api/relWebCat/';
  private mockup: Array<RelWebCat> = [];
  private mockupId: string = '';

  constructor(
    private localService: LocalService,
    private loginService: LoginService,
    private http: HttpClient
  ) { }

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'x-auth-token': this.localService.getKey('x-auth-token'),
      })
    };
  }

  async getWebCatRel(): Promise<Array<RelWebCat>> {
    try {
      const relWebCats = await this.http.get<Array<RelWebCat>>(this.apiUrl, this.httpOptions()).toPromise();
      return (relWebCats);
    } catch (error) {
      console.log(error.error);
      return [];
    }
  }

  async createRelWebCat(rel: RelWebCat): Promise<string> {
    try {
      const body = _.omit(rel, ['_id']);
      const newRel = await this.http.post<RelWebCat>(this.apiUrl, body, this.httpOptions()).toPromise();
      return (newRel._id);
    } catch (error) {
      console.log(error.error);
    }
  }

  async updateRelWebCat(id: string, rel: RelWebCat): Promise<RelWebCat> {
    try {
      const body = _.omit(rel, ['_id']);
      return await this.http.put<RelWebCat>(this.apiUrl + '/' + id, body, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }

  
}
