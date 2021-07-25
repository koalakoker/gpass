import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';

import { LoginService } from '../../../services/api/login.service'
import { User } from '../../user'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Modal from '../../../bootstrap/modal/modalCodes'
import { NewUserModalComponent } from '../../../bootstrap/modal/new-user-modal.component';
import { ConfirmModalComponent } from '../../../bootstrap/modal/confirm-modal.component';
import { UserEditModalComponent } from '../../../bootstrap/modal/user-edit-modal.component';
import { UserService } from 'src/app/services/api/user.service';

@Component({
  selector: 'app-users-component',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, Refreshable {

  show: boolean = false;
  user: Array<User>;
  selectedUser: User;
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();

  returnUrl: string = '';
  
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private modalService: NgbModal) {
      let baseAddr = 'https://www.koalakoker.com/gpass/';
      this.returnUrl = baseAddr + '#/newuser'
    }
  
  queryForAction(string: any): boolean {
    return false;
  }

  ngOnInit(): void {
    if (this.loginService.checklogged())
      {
        this.show = true;
        this.enter();
      } else {
        console.log("User not logged");
      }
  }

  async enter() {
    try {
      this.user = await this.userService.getUsers();
    } catch (error) {
      console.log(error);
    }
  }

  refresh(cmd: string): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.usersPage;
      if (cmd == InputCodes.Refresh) {
        if (this.loginService.checklogged())
          {
            this.show = true;
            this.enter();
            ret.childInject = ReturnCodes.ButtonInsertUsers;
            resolve(ret);
          } else {
            this.user = [];
            reject("Not logged");
          };
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

  async createNewUser(user: User, tempPassword: string) {
    user.password = tempPassword;
    try {
      const id = await this.userService.createUser(user);  
      user._id = id;
      this.user.unshift(user);
    } catch (error) {
      console.log(error);
    }
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

  async onButtonRemove(i: number) {
    const usr = this.user[i];
    try {
      await this.userService.deleteUser(usr._id);  
      this.user.splice(i, 1);
    } catch (error) {
      console.log(error);
    }
  }

  openConfirmUserInviteModal(i: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = "Send invitation email to " + this.user[i].name;
    modalRef.componentInstance.message = "Are you sure you want to sent invitation to this user?";
    modalRef.result
      .then((result) => {
        this.onButtonInvite(i);
      }, () => { });
  }

  onButtonInvite(i: number) {
    const usr = this.user[i];
    console.log("Send invitation to user: " + usr.name + " Email:" + usr.email + " Hash: " + usr.password);

    // Add the params that needs to be crypted in loginService.sendLink
    var params = {
      // To be crypted
      "return_url": this.returnUrl,
      "userhash": usr.password,
      // No encription
      "invitedUserId": usr._id
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
