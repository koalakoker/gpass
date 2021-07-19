import * as _ from 'lodash-es';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalService } from '../local.service';
import { User } from '../../modules/user';
import { Api } from './api';
import { GCrypto } from 'src/app/modules/gcrypto';

@Injectable({
  providedIn: 'root'
})
export class UserService extends Api {

  private userApiUrl: string = this.apiBaseUrl + '/users/';
  private meApiUrl: string = this.apiBaseUrl + '/users/me';

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
      let userClone: User = _.cloneDeep(user);
      userClone.password = GCrypto.hash(userClone.password);
      const usr = await this.http.post<string>(this.userApiUrl, userClone, this.httpOptions(this.localService)).toPromise();
      return usr['_id'];
    } catch (error) {
      this.error("is not possible to create an user");
    }
  }

  async updateUser(user: any): Promise<User> {
    try {
      if (user.password != undefined) {
        // user is not used in caller functions so can be modified 
        user.password = GCrypto.hash(user.password);
      }
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
