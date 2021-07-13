import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { Category } from '../modules/category';
import { LocalService } from './local.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl: string = 'http://localhost:5000/api/category/';

  constructor(
    private localService: LocalService,
    private loginService: LoginService,
    private http: HttpClient
  ) {}

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'x-auth-token': this.localService.getKey('x-auth-token'),
      })
    };
  }

  decryptList(dataCypt: Array<Category>): Array<Category> {
    let dataDecrypt: Array<Category> = [];
    let userPassword: string = this.loginService.getUserKey();
    dataDecrypt = dataCypt.map((element: Category) => {
      const elementClone = new Category(element);
      elementClone.decrypt(userPassword);
      return elementClone;
    }, this);
    return dataDecrypt;
  }

  sortList(data: Array<Category>): Array<Category> {
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

  async getFromUserCategory(): Promise<Array<Category>> {
    try {
      let data = await this.http.get<Array<Category>>(this.apiUrl, this.httpOptions()).toPromise();
      data = this.decryptList(data);
      data = this.sortList(data);    
      return(data);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async createCategory(category: Category): Promise<string> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let categoryClone = _.cloneDeep(category);
      categoryClone.crypt(userPassword);
      const body = _.omit(categoryClone, ['_id']);
      const newCategory = await this.http.post<Category>(this.apiUrl, body, this.httpOptions()).toPromise();
      return (newCategory._id);
    } catch (error) {
      console.log(error.error);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.http.delete<Category>(this.apiUrl + '/' + id, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }

  async updateCategory(id: string, category: Category): Promise<Category> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let categoryClone = _.cloneDeep(category);
      categoryClone.crypt(userPassword);
      const body = _.omit(categoryClone, ['_id']);
      return await this.http.put<Category>(this.apiUrl + '/' + id, body, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }

}
