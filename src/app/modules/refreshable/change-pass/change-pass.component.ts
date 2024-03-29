import * as _ from 'lodash-es';
import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { WebLinkService } from '../../../services/api/web-link.service';
import { UserService } from 'src/app/services/api/user.service';
import { WebPass } from '../../webpass';
import { User } from '../../user';
import { LoginService } from '../../../services/api/login.service';
import { Category } from '../../category';
import { CategoryService } from 'src/app/services/api/category.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit, Refreshable {

  new_password        : string = '';
  repeat_new_password : string = '';
  valid: boolean = false;
  message: string = '';
  interval;
  itemToBeSentNbr: number = 0;
  serverAccess: string = '';
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('buttonChange') buttonChange: ElementRef;

  constructor(
    private webLinkService: WebLinkService,
    private categoryService: CategoryService,
    private userService: UserService,
    private loginService: LoginService) { }

  queryForAction(string: any): boolean {
    return false;
  }

  ngOnInit() {
  }

  refresh(): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>(resolve => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.changePass;
      ret.childInject = ReturnCodes.None;
      resolve(ret);
    })
  }

  checkRights(minLevel: number) {
    return this.loginService.checkRights(minLevel);
  }

  async changeUserPass(new_password: string) {
    try {
      await this.updateUserPasswordInDB(new_password);
      await this.updateDataInDB(new_password);
      this.hasChanged.emit(PageCodes.changePass);
      if (new_password !== "") {
        this.sendMessage("Password has been modified", 3000);
      } else {
        this.sendMessage("Password has been reset", 3000);
      }
    } catch (error) {
      console.log(error);
      this.sendMessage("Error updating db", 3000);
    }
  }

  async updateUserPasswordInDB(newPassword: string) {
    try {
      let user: User = await this.userService.getUserInfo();
      user.password = newPassword;
      user = _.pick(user, ['_id', 'name', 'password']);
      await this.userService.updateUser(user);
    } catch (error) {
      throw new Error("Error updating user password");
      
    }
  }

  async updateDataInDB(new_password: string): Promise<void> {
    try {
      // Crypt and decrypt is done inside webLinkService using the 
      // password from loginService.
      const webPassList: Array<WebPass> = await this.webLinkService.getFromUserLinks()
      const categoryList: Array<Category> = await this.categoryService.getFromUserCategory();
      this.loginService.updateUserPassword(new_password);
      webPassList.forEach(async (webPass) => {
        await this.webLinkService.updateWebPass(webPass._id, webPass);
      });
      categoryList.forEach(async (category) => {
        await this.categoryService.updateCategory(category._id, category);
      })
    } catch (error) {
      console.log(error);
    }
  }

  onChangePassButtonClick(): void {
    if (this.insertedValuesAreValid()) {
      this.changeUserPass(this.new_password)
        .catch( err => {
          console.log(err);
        });
    }
  }

  onResetPassButtonClick(): void {
    this.changeUserPass("")
      .catch(err => {
        console.log(err);
      });
  }

  errorMessageTimeout: any;

  onKeyUp() {
    // Clear previus error timeout
    if (this.errorMessageTimeout != undefined) {
      clearTimeout(this.errorMessageTimeout)
    }

    if (this.insertedValuesAreValid()) {
      this.valid = true;
      setTimeout(() => {
        this.buttonChange.nativeElement.focus();
      }, 100, this);
    } else {
      this.valid = false;
      this.errorMessageTimeout = setTimeout(() => {
        this.sendErrorMessage()
      }, 1000);
    }
  }

  insertedValuesAreValid(): boolean {
    return ((this.new_password.length >= 5) &&
            (this.new_password === this.repeat_new_password));
  }

  sendErrorMessage(): void {
    const delta = 3000;

    if (this.new_password.length < 5) {
      let message = "The new password must be at least 5 char";
      this.sendMessage(message, delta);
      return;
    }

    if (this.repeat_new_password !== this.new_password) {
      let message = "The two passwords must be the same";
      this.sendMessage(message, delta);
      return;
    }
  }

  sendMessage(text: string, time: number): void {
    clearInterval(this.interval);
    this.message = text;
    this.interval = setInterval(() => {
      this.message = '';
      clearInterval(this.interval);
    }, time);
  }

}
