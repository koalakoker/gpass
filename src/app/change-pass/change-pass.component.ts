import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebService } from '../services/web.service';
import { WebPass } from '../modules/webpass';
import { User } from '../modules/user';
import { GCrypto } from '../modules/gcrypto';
import { LoginService } from '../services/login.service';

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

  @ViewChild('buttonChange') buttonChange: ElementRef;

  constructor(private dbService: WebService,
              private loginService: LoginService) { }

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

  async changeUserPass(new_password: string) {
    var list: WebPass[] = await this.getWebPass();
    this.cryptWebPassAndUpdateDB(list);
    this.updateUserHashInDB(new_password);
    this.updateUserPassword(new_password);
  }

  updateUserPassword(new_password: string) {
    this.loginService.updateUserPassword(new_password);
  }

  updateUserHashInDB(newPassword: string) {
    console.log("Update user with new hash");
    var user = new User();
    user.username = this.loginService.userName;
    user.updateHash(newPassword);
    var paramsToBeUpdated = {
      "id": this.loginService.userid,
      "userhash": user.userhash
    };
    this.dbService.updateUser(paramsToBeUpdated);
  }

  getWebPass(): Promise<WebPass[]> {
    // Get the DB values and decrypt with old pass
    return new Promise<WebPass[]>((resolve, reject) => {
      this.dbService.getFromUser('gpass')
        .then((json: JSON) => {
          var data: Array<WebPass> = [];
          for (var i in json) {
            let elem: WebPass = Object.assign(new WebPass(), json[i]);
            data.push(elem);
          }
          // Decode and create a new WebPass list
          const list: WebPass[] = data.map((x) => {
            const w = new WebPass(x);
            w.decrypt(this.loginService.userPassword);
            return w;
          }, this);
          resolve (list);
        })
        .catch(err => reject(err));
      });
  }

  cryptWebPassAndUpdateDB(list: WebPass[]): Promise<void> {
    // Cript the values of the DB with the new pass
    return new Promise<void>((resolve, reject) => {
      this.itemToBeSentNbr = list.length;
      list.forEach(webPass => {
        const newWebPass = new WebPass(webPass);
        webPass.crypt(this.new_password);
        this.dbService.updateWebPass(webPass)
          .then(
            () => {
              this.itemToBeSentNbr--;
              if (this.itemToBeSentNbr === 0) {
                resolve();
              }
            })
          .catch( err => reject(err));
      }, this);
    });
  }

  changeMasterKey() {
    // Calculate the new access file for the db
    this.dbService.callChipher(this.loginService.userPassword)
    .then((data) => {
      const key: string = GCrypto.hash(this.new_password);
      this.serverAccess = 'New <mark><i>master password</i></mark> has been updated. Please update the <mark><i>passDB_cript.php</i></mark> file with the following values:\n\n';
      this.serverAccess += '$Password = "' + key + '";\n';
      this.serverAccess += '$Server = "' + GCrypto.cryptDBAccess(data['server'], key) + '";\n';
      this.serverAccess += '$Username = "' + GCrypto.cryptDBAccess(data['username'], key) + '";\n';
      this.serverAccess += '$PW = "' + GCrypto.cryptDBAccess(data['password'], key) + '";\n';
      this.serverAccess += '$DB = "' + GCrypto.cryptDBAccess(data['database'], key) + '";\n';
    })
  }

  onChangePass() {
    this.changeUserPass(this.new_password)
    .catch( err => {
        console.log(err);
        this.sendMessage('The <mark><i>password is not correct</i></mark>', 3000);
      });
  }

  validate() {
    /* Valid condition */
    if ((this.new_password       !=='') &&
        (this.repeat_new_password!=='') &&
        (this.new_password === this.repeat_new_password)) {
      this.valid = true;
      setTimeout(() => {
        this.buttonChange.nativeElement.focus();
      }, 100, this);
    }

    let message = '';
    let time = 0;
    const delta = 3000;

    /* new no null */
    if (this.new_password === '')
    {
      message += 'The <mark><i>"new password"</mark></i> can\'t be empty\n';
      time += delta;
    }

    /* Repeat not equal to new */
    if (this.repeat_new_password !== this.new_password)
    {
      message += 'The <mark><i>"retyped new password"</mark></i> must be the same of the <mark><i>"new password"</mark></i>\n';
      time += delta;
    }

    this.sendMessage(message, time);

  }

  sendMessage(text: string, time: number) {
    clearInterval(this.interval);
    this.message = text;
    this.interval = setInterval(() => {
      this.message = '';
      clearInterval(this.interval);
    }, time);
  }

}
