import { Component, OnInit } from '@angular/core';

import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';
import * as InputCodes from '../modules/refreshable/inputCodes';

import { LoginService } from '../services/login.service'
import { WebService } from '../services/web.service'
import { User } from '../modules/user'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Modal from '../bootstrap/modal/modal'
import { NewUserModalComponent } from '../bootstrap/modal/new-user-modal.component'
import { ConfirmDeleteModalComponent } from '../bootstrap/modal/confirm-delete-modal.component'
import { UserEditModalComponent} from '../bootstrap/modal/user-edit-modal.component'

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, Refreshable {

  show: boolean = false;
  user: User[];
  selectedUser: User;

  constructor(
    private loginService: LoginService,
    private webService: WebService,
    private modalService: NgbModal) { }

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
    this.webService.get('users')
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
    const modalRef = this.modalService.open(NewUserModalComponent);
    const user = new User();
    modalRef.componentInstance.user = user;
    modalRef.result
      .then((result) => {
        if (result === Modal.MODAL_YES_BUTTON) {
          this.createNewUser(modalRef.componentInstance.user);
        }
      }, (reason) => {
      });
  }

  createNewUser(user: User) {
    user.updateHash("password");
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
      "user_hash": usr.userhash,
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

  confirmDeleteModal(i: number) {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
    modalRef.result
      .then((result) => {
        this.onButtonRemove(i);
      }, () => { });
  }

  openEditModal(i: number) {
    const modalRef = this.modalService.open(UserEditModalComponent);
    modalRef.componentInstance.user = this.user[i];
    modalRef.result
      .then((result) => {
        
      }, (reason) => {
        
      });
  }

}
