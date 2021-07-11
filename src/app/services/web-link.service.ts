import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { WebPass } from '../modules/webpass';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class WebLinkService {

  private apiUrl: string = 'http://localhost:5000/api/webpass/';
  
  constructor(
    private localService: LocalService,
    private loginService: LoginService,
    private http: HttpClient,
  ) {}

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'x-auth-token': this.localService.getKey('x-auth-token'),
      })
    };
  }

  async getFromUserLinks(): Promise<Array<WebPass>> {
    try {
      const data = await this.http.get<Array<WebPass>>(this.apiUrl, this.httpOptions()).toPromise();
      let webPassList: WebPass[] = [];
      // Decode and create a new WebPass list
      webPassList = data.map((x: WebPass) => {
        const w = new WebPass(x);
        w.decrypt(this.loginService.getUserKey());
        return w;
      }, this);
      
      // Different way to sort can be implemented by name is in server side
      // webPassList.sort((a, b) => {
      //   if (a.name < b.name) {
      //     return -1;
      //   } else {
      //     if (a.name > b.name) {
      //       return 1;
      //     } else {
      //       return 0;
      //     }
      //   }
      // });
      
      return(webPassList);
    } catch (error) {
      console.log(error.error);
      return [];
    }
  }

  async createWebPass(webPass: WebPass): Promise<string> {
    try {
      const body = _.omit(webPass, ['_id']);
      const newVebPass = await this.http.post<WebPass>(this.apiUrl, body, this.httpOptions()).toPromise();
      return (newVebPass._id);
    } catch (error) {
      console.log(error.error);
    }
  }

  async deleteWebPass(id: string): Promise<void> {
    try {
      await this.http.delete<WebPass>(this.apiUrl + '/' + id, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }

  async updateWebPass(id: string, webPass: WebPass): Promise<WebPass> {
    try {
      const body = _.omit(webPass, ['_id']);
      return await this.http.put<WebPass>(this.apiUrl + '/' + id, body, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }
}
