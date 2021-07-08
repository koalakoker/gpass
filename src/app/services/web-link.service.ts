import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { WebPass } from '../modules/webpass';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class WebLinkService {

  private mockup: Array<WebPass> = [];
  private mockupId: number = 0;

  constructor(private loginService: LoginService) {
  }

  async getFromUserLinks(): Promise<Array<WebPass>> {
    // httpGet
    return new Promise<Array<WebPass>>((resolve, reject) => {
      const data: Array<WebPass> = this.mockup;
      let webPassList: WebPass[] = [];
      // Decode and create a new WebPass list
      webPassList = data.map((x) => {
        const w = new WebPass(x);
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

  createWebPass(webPass: WebPass): Promise<number> {
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

  updateWebPass(id: number, webPass: WebPass): Promise<WebPass> {
    return new Promise<WebPass>((resolve, reject) => {
      const index = this.mockup.indexOf(this.mockup.find((web) => {
        return web.id === id;
      }));
      this.mockup[index] = _.cloneDeep(webPass);
      resolve(webPass);
    });
  }
}
