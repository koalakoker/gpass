import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { isConfigForTesting } from '../../config'

import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';

import { LoginService } from '../../../services/login.service'
import { WebService } from '../../../services/web.service'
import { User } from '../../user'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Modal from '../../../bootstrap/modal/modal'
import { NewUserModalComponent } from '../../../bootstrap/modal/new-user-modal.component';
import { ConfirmModalComponent } from '../../../bootstrap/modal/confirm-modal.component';
import { UserEditModalComponent } from '../../../bootstrap/modal/user-edit-modal.component';

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, Refreshable {

  show: boolean = false;
  user: User[];
  selectedUser: User;
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();

  returnUrl: string = '';
  
  constructor(
    private loginService: LoginService,
    private webService: WebService,
    private modalService: NgbModal) {
      let baseAddr = '';
      if (isConfigForTesting()) {
        baseAddr = 'http://localhost:4200/';
      } else {
        baseAddr = 'https://www.koalakoker.com/gpass/';
      }
      this.returnUrl = baseAddr + '#/newuser'
    }
  
  queryForAction(string: any): boolean {
    return false;
  }

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
            this.user = [];
            reject("Not logged");
          });
      }
      else if (cmd == InputCodes.NewBtnPress) {
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
          this.createNewUser(modalRef.componentInstance.user,
                             modalRef.componentInstance.tempPassword);
        }
      }, (reason) => {
      });
  }

  createNewUser(user: User, tempPassword: string) {
    user.updateHash(tempPassword);
    this.webService.createUser(user)
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
    this.webService.delete(usr.id, 'users')
      .then(() => {
        this.user.splice(i, 1);
      })
      .catch(err => console.log(err));
  }

  openConfirmUserInviteModal(i: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = "Send invitation email to " + this.user[i].username;
    modalRef.componentInstance.message = "Are you sure you want to sent invitation to this user?";
    modalRef.result
      .then((result) => {
        this.onButtonInvite(i);
      }, () => { });
  }

  onButtonInvite(i: number) {
    const usr = this.user[i];
    console.log("Send invitation to user: " + usr.username + " Email:" + usr.email + " Hash: " + usr.userhash);

    // Add the params that needs to be crypted in loginService.sendLink
    var params = {
      // To be crypted
      "return_url": this.returnUrl,
      "userhash": usr.userhash,
      // No encription
      "invitedUserId": usr.id
    };

    this.loginService.sendLink(params)
      .then((done) => {
        if (done) {
          console.log("Invitation sent.");
        } else {
          console.log("Problem with operation. Invitation has not been sent.");
        }
      })
  }

  confirmDeleteModal(i: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = "Warning";
    modalRef.componentInstance.message = "Are you sure to delete this?";
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