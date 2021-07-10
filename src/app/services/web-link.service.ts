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
      webPassList = data.map((x) => {
        const w = new WebPassClass(x);
        w.decrypt(this.loginService.getUserKey());
        return w;
      }, this);
      webPassList.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      return(_.cloneDeep(webPassList));
    } catch (error) {
      console.log(error.error);
      return [];
    }
  }

  async createWebPass(webPass: WebPassClass): Promise<number> {
    try {
      const body = _.omit(webPass, ['id']);
      const id = await this.http.post(this.apiUrl, body, this.httpOptions()).toPromise();
      console.log(id);
    } catch (error) {
      console.log(error.error);
    }
    return new Promise<number>((resolve, reject) => {
      const newWebPass = _.cloneDeep(webPass);
      newWebPass.id = this.mockupId;
      this.mockup.push(_.cloneDeep(newWebPass));
      this.mockupId++;
      resolve(newWebPass.id);
    });
  }

  deleteWebPass(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const webPass = this.mockup.find((web) => {
        return web.id === id;
      });
      const index = this.mockup.indexOf(webPass);
      this.mockup.splice(index, 1);
    });
  }

  updateWebPass(id: number, webPass: WebPassClass): Promise<WebPassClass> {
    return new Promise<WebPassClass>((resolve, reject) => {
      const index = this.mockup.indexOf(this.mockup.find((web) => {
        return web.id === id;
      }));
      this.mockup[index] = _.cloneDeep(webPass);
      resolve(webPass);
    });
  }
}
