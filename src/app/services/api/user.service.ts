import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalService } from '../local.service';
import { User } from '../../modules/user';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Api {

  private meApiUrl:   string = 'http://localhost:5000/api/users/me';
  private userApiUrl: string = 'http://localhost:5000/api/users/';
  private mockup: Array<User> = [];
  private mockupId: string = '';

  constructor(
    private http: HttpClient,
    private localService: LocalService
  ) {
    super();
  }

  async getUserInfo(): Promise<any> {
    try {
      const user = await this.http.get(this.meApiUrl, this.httpOptions(this.localService)).toPromise();
      return user;
    } catch (error) {
      this.error("is not possible to retrieve the user info.")
    }
  }

  async getUsers(): Promise<Array<User>> {
    try {
      const users = await this.http.get<Array<User>>(this.userApiUrl, this.httpOptions(this.localService)).toPromise();
      return users;
    } catch (error) {
      this.error("is not possible to retrieve the list of users.");
    }
  }

  async createUser(user: User): Promise<string> {
    try {
      const id = await this.http.post<string>(this.userApiUrl, user, this.httpOptions(this.localService)).toPromise();
      return id;
    } catch (error) {
      this.error("is not possible to create an user");
    }
  }

  async updateUser(user: any): Promise<User> {
    try {
      const id = user._id;
      const body = _.omit(user, ['_id']);
      return await this.http.put<User>(this.userApiUrl + '/' + id, body, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to update the user");
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.http.delete<User>(this.userApiUrl + '/' + id, this.httpOptions(this.localService)).toPromise();
    } catch (error) {
      this.error("is not possible to delete an user");
    }
  }
}
