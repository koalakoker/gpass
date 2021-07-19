import * as _ from 'lodash-es';
import { Injectable } from '@angular/core';
import { Category } from '../../modules/category';
import { LocalService } from '../local.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends Api {

  private apiUrl: string = this.apiBaseUrl + '/category/';

  constructor(
    private localService: LocalService,
    private loginService: LoginService,
    private http: HttpClient
  ) {
    super();
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
      let data = await this.http.get<Array<Category>>(this.apiUrl, this.httpOptions(this.localService)).toPromise();
      data = this.decryptList(data);
      data = this.sortList(data);    
      return(data);
    } catch (error) {
      this.error("is not possible to retrieve the categories list");
    }
  }

  async createCategory(category: Category): Promise<string> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let categoryClone = _.cloneDeep(category);
      categoryClone.crypt(userPassword);
      const body = _.omit(categoryClone, ['_id']);
      const newCategory = await this.http.post<Category>(this.apiUrl, body, this.httpOptions(this.localService)).toPromise();
      return (newCategory._id);
    } catch (error) {
      this.error('is not possible to create a new category');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.http.delete<Category>(this.apiUrl + '/' + id, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to delete the category");
    }
  }

  async updateCategory(id: string, category: Category): Promise<Category> {
    try {
      let userPassword: string = this.loginService.getUserKey();
      let categoryClone = _.cloneDeep(category);
      categoryClone.crypt(userPassword);
      const body = _.omit(categoryClone, ['_id']);
      return await this.http.put<Category>(this.apiUrl + '/' + id, body, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to update the category");
    }
  }

}
