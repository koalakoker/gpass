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

  async getFromUserCategory(): Promise<Array<Category>> {
    try {
      const categories = await this.http.get<Array<Category>>(this.apiUrl, this.httpOptions()).toPromise();
      
      // Different way to sort can be implemented by name is in server side
      // categories.sort((a, b) => {
      //   if (a.name < b.name) {
      //     return -1;
      //   } else {
      //     if (a.name > b.name) {
      //       return 1;
      //     } else {
      //       return 0;
      //     }
      //   }
      // })
  
      return(categories);
    } catch (error) {
      console.log(error.error);
      return [];
    }
  }

  async createCategory(category: Category): Promise<string> {
    try {
      const body = _.omit(category, ['_id']);
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
      const body = _.omit(category, ['_id']);
      return await this.http.put<Category>(this.apiUrl + '/' + id, body, this.httpOptions()).toPromise();
    } catch (error) {
      console.log(error.error);
    }
  }

}
