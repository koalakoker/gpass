import { Injectable } from '@angular/core';
import { Category } from '../modules/category';
import { RelWebCat } from '../modules/relwebcat';
import { WebPass } from '../modules/webpass';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class WebLinkService {

  private mockup: Array<WebPass> = [];
  private mockupId: number = 0;

  constructor(private loginService: LoginService) {
    for (let i = 0; i  < 5; i++) {
      const webPass = new WebPass();
      webPass.name = "Test-" + i;
      webPass.crypt(this.loginService.getUserKey());
      this.mockup.push(webPass);
    }
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
      resolve(webPassList);
    });
  }

  createWebPass(webPass: WebPass): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.mockup.push(webPass);
      this.mockupId++;
      resolve(this.mockupId);
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
      const webPass = this.mockup.find((web) => {
        return web.id === id;
      });
      const index = this.mockup.indexOf(webPass);
      this.mockup[index] = webPass;
      resolve(webPass);
    });
  }
}
