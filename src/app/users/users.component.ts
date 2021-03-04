import { Component, OnInit } from '@angular/core';

import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';
import * as InputCodes from '../modules/refreshable/inputCodes';

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
    this.webService.get("", 'users')
    .then((json: JSON) => {
      var data: Array<User> = [];
      for (var i in json) {
        let elem: User = Object.assign(new User(), json[i]);
        data.push(elem);
      }

      this.user = data;
    }, err => console.log(err));
  }

  refresh(cmd: string): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.usersPage;
      if (cmd == InputCodes.Refresh) {
        this.loginService.checklogged()
          .then(() => {
            this.show = true;
            this.enter();
            ret.childInject = ReturnCodes.ButtonInsertUsers;
            resolve(ret);
          })
          .catch((err) => {
            reject("Not logged");
          });
      }
      else if (cmd == InputCodes.BtnPress) {
        this.onNewFunc();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      }
      else {
        reject("Wrong command");
      }
    })
  }

  onNewFunc() {
    const user = new User();
    this.webService.createUser(user, "")
    .then((json: JSON) => {
      user.id = +json;
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
    this.webService.updateUser(user, "")
      .then(() => {})
      .catch(err => console.log(err));
  }

  onButtonRemove(i: number) {
    const usr = this.user[i];
    this.webService.delete(usr.id, "", 'users')
      .then(() => {
        this.user.splice(i, 1);
      })
      .catch(err => console.log(err));
  }

  returnUrl: string = 'http://localhost:4200/newuser';

  onButtonInvite(i: number) {
    const usr = this.user[i];
    console.log("Send invitation to user: " + usr.username + " Email:" + usr.email);

    // Add the params that needs to be crypted in loginService.sendLink
    var params = {
      "returnurl": this.returnUrl,
      "user_name": usr.username,
      "user_password": usr.password,
      "email": usr.email
    };

    this.loginService.sendLink(params)
      .then((logged) => {
        if (logged) {
          console.log("Done");
        }
      })
    
    // window.location.href = this.emailServiceUrl + '?' + new URLSearchParams(params).toString();
  }

}
