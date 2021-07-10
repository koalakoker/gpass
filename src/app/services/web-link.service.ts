import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { WebPassClass } from '../modules/webpass';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class WebLinkService {

  private mockup: Array<WebPassClass> = [];
  private mockupId: number = 0;

  constructor(private loginService: LoginService) {
  }

  async getFromUserLinks(): Promise<Array<WebPassClass>> {
    // httpGet
    return new Promise<Array<WebPassClass>>((resolve, reject) => {
      const data: Array<WebPassClass> = this.mockup;
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
      resolve(_.cloneDeep(webPassList));
    });
  }

  createWebPass(webPass: WebPassClass): Promise<number> {
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
