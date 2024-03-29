import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { WebPass } from '../../modules/webpass';
import { Api } from './api';
import { LoginService } from './login.service';
import { HttpClient} from '@angular/common/http';
import { LocalService } from '../local.service';

@Injectable({
  providedIn: 'root'
})
export class WebLinkService extends Api {

  private apiUrl: string = this.apiBaseUrl + '/webpass/';
  
  constructor(
    private localService: LocalService,
    private loginService: LoginService,
    private http: HttpClient
  ) {
    super();
  }

  decryptList(dataCypt: Array<WebPass>): Array<WebPass> {
    let dataDecrypt: Array<WebPass> = [];
    let userPassword: string = this.loginService.getUserKey();
    dataDecrypt = dataCypt.map((element: WebPass) => {
      const elementClone = new WebPass(element);
      elementClone.decrypt(userPassword);
      return elementClone;
    }, this);
    return dataDecrypt;
  }

  sortList(data: Array<WebPass>): Array<WebPass> {
    data.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return data;
  }

  async getFromUserLinks(): Promise<Array<WebPass>> {
    try {
      let data = await this.http.get<Array<WebPass>>(this.apiUrl, this.httpOptions(this.localService)).toPromise();
      data = this.decryptList(data);
      data = this.sortList(data);
      return(data);
    } catch (error) {
      this.error("is not possible to retrieve the webPass list");
    }
  }

  async createWebPass(webPass: WebPass): Promise<string> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let webPassClone = _.cloneDeep(webPass);
      webPassClone.crypt(userPassword);
      const body = _.omit(webPassClone, ['_id']);
      const newWebPass = await this.http.post<WebPass>(this.apiUrl, body, this.httpOptions(this.localService)).toPromise();
      return (newWebPass._id);
    } catch (error) {
      this.error("is not possible to create a new webPass");
    }
  }

  async deleteWebPass(id: string): Promise<void> {
    try {
      await this.http.delete<WebPass>(this.apiUrl + '/' + id, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to delete a webPass");
    }
  }

  async updateWebPass(id: string, webPass: WebPass): Promise<WebPass> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let webPassClone = _.cloneDeep(webPass);
      webPassClone.crypt(userPassword);
      const body = _.omit(webPassClone, ['_id']);
      return await this.http.put<WebPass>(this.apiUrl + '/' + id, body, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to update a webPass");
    }
  }
}
