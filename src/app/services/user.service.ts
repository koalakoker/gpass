import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { IUser } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private meApiUrl: string = 'http://localhost:5000/api/users/me';
  private mockup: Array<IUser> = [];
  private mockupId: number = 0;

  constructor(
    private http: HttpClient,
    private localService: LocalService
  ) {}

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'x-auth-token': this.localService.getKey('x-auth-token'),
      })
    };
  }

  async getUserInfo(): Promise<any> {
    try {
      const user = await this.http.get(this.meApiUrl, this.httpOptions()).toPromise();
      return user;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  getUsers(): Promise<Array<IUser>> {
    return new Promise<Array<IUser>>((resolve, reject) => {
      resolve (this.mockup);
    })
  }

  createUser(user: IUser): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.mockup.push(user);
      this.mockupId++;
      resolve(this.mockupId);
    })
  }

  updateUser(user: any): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      resolve (user);
    });
  }

  deleteUser(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}
