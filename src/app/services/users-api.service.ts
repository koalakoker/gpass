import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  private loginApiUrl: string = 'http://localhost:5000/api/auth/';

  constructor(private http: HttpClient) { }

  userLogin(user: User): Promise<any> {
    return this.http.post(this.loginApiUrl, user, { observe: 'response', responseType: "text" }).toPromise();
  }
}
