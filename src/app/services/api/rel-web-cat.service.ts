import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { RelWebCat } from '../../modules/relwebcat';
import { LocalService } from '../local.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class RelWebCatService extends Api {

  private apiUrl: string = this.apiBaseUrl + '/relWebCat/';

  constructor(
    private localService: LocalService,
    private http: HttpClient
  ) {
    super();
   }

  async getWebCatRel(): Promise<Array<RelWebCat>> {
    try {
      const relWebCats = await this.http.get<Array<RelWebCat>>(this.apiUrl, this.httpOptions(this.localService)).toPromise();
      return (relWebCats);
    } catch (error) {
      this.error("is not possible to retrive the category relations");
    }
  }

  async createRelWebCat(rel: RelWebCat): Promise<string> {
    try {
      const body = _.omit(rel, ['_id']);
      const newRel = await this.http.post<RelWebCat>(this.apiUrl, body, this.httpOptions(this.localService)).toPromise();
      return (newRel._id);
    } catch (error) {
      this.error("is not possible to create a new category relation");
    }
  }

  async updateRelWebCat(id: string, rel: RelWebCat): Promise<RelWebCat> {
    try {
      const body = _.omit(rel, ['_id']);
      return await this.http.put<RelWebCat>(this.apiUrl + '/' + id, body, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to update the category relation");
    }
  }

  
}
