import { Component, OnInit } from '@angular/core';
import { Refreshable } from '../modules/refreshable';
import { LoginService } from '../services/login.service'
import { WebService } from '../services/web.service'
import { User } from '../modules/user'

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, Refreshable {

  show: boolean = false;
  user: User[];
  selectedUser: User;

  constructor(
    private loginService: LoginService,
    private webService: WebService) { }

  ngOnInit(): void {
    this.loginService.checklogged()
      .then(() => {
        this.show = true;
        this.enter();
      })
      .catch((err) => {
        console.log("promise failed with err:" + err);
      }) 
  }

  enter() {
    // User is logged show content
    this.webService.get("", 'users').toPromise()
    .then((data: Array<User>) => {
      this.user = data;
    }, err => console.log(err));
  }

  refresh(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (cmd == "") {
        this.loginService.checklogged()
          .then(() => {
            this.show = true;
            this.enter();
            resolve("btnInsertUsers");
          })
          .catch((err) => {
            reject("Not logged");
          });
      }
      else if (cmd == "btnPress") {
        this.onNewFunc();
        resolve("");
      }
      else {
        reject("Wrong command");
      }
    })
  }

  onNewFunc() {
    const user = new User();
    this.webService.createUser(user, "").subscribe((id: number) => {
      user.id = id;
      this.user.unshift(user);
    }, err => console.log(err));
  }

  onSelect(usr: User) {
    this.selectedUser = usr;
  }

  isSelected(usr: User): boolean {
    return (usr === this.selectedUser);
  }

  isActive(usr: User): string {
    return (this.isSelected(usr) ? "active" : "");
  }

  onCloseEdit() {
  }

  save(index: number) {
    const user = new User(this.user[index]);
    this.webService.updateUser(user, "").subscribe(() => {
    }, err => console.log(err));
  }

  onButtonRemove(i: number) {
    const usr = this.user[i];
    this.webService.delete(usr.id, "", 'users').subscribe(() => {
      this.user.splice(i, 1);
    }, err => console.log(err));
  }

}
