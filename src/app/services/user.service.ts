import { Injectable } from '@angular/core';
import { IUser } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private mockup: Array<IUser> = [];
  private mockupId: number = 0;

  constructor() {
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
