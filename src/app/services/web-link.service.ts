import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { WebPassClass } from '../modules/webpass';
import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class WebLinkService {

  private apiUrl: string = 'http://localhost:5000/api/webpass/';
  private mockup: Array<WebPassClass> = [];
  private mockupId: number = 0;

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

  async getFromUserLinks(): Promise<Array<WebPassClass>> {
    try {
      const data = await this.http.get<Array<WebPassClass>>(this.apiUrl, this.httpOptions()).toPromise();
      let webPassList: WebPassClass[] = [];
      // Decode and create a new WebPass list
      webPassList = data.map((x: WebPassClass) => {
        const w = new WebPassClass(x);
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

  async createWebPass(webPass: WebPassClass): Promise<string> {
    try {
      const body = _.omit(webPass, ['_id']);
      const newVebPass = await this.http.post<WebPassClass>(this.apiUrl, body, this.httpOptions()).toPromise();
      return (newVebPass._id);
    } catch (error) {
      console.log(error.error);
    }
  }

  async deleteWebPass(id: string): Promise<void> {
    try {
      await this.http.delete<WebPassClass>(this.apiUrl + '/' + id, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }

  async updateWebPass(id: string, webPass: WebPassClass): Promise<WebPassClass> {
    try {
      const body = _.omit(webPass, ['_id']);
      return await this.http.put<WebPassClass>(this.apiUrl + '/' + id, body, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }
}
