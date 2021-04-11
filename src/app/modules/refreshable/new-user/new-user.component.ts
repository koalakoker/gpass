import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';

import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../services/login.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit, Refreshable {

  username: string;
  userhash: string;
  masterhash: string;
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();
  loggedTxt: string = "Verify invitation details";

  constructor(
    private route: ActivatedRoute,
    public loginService: LoginService
    ) { }
  
  queryForAction(string: any): boolean {
    return false;
  }

  ngOnInit(): void {
  }

  refresh(cmd: string): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.newUserPage;
      this.username = this.route.snapshot.paramMap.get('username');
      this.userhash = this.route.snapshot.paramMap.get('userhash');
      this.masterhash = this.route.snapshot.paramMap.get('masterpassword');
      var strListCrypt = [];
      strListCrypt.push(this.username);
      strListCrypt.push(this.userhash);
      strListCrypt.push(this.masterhash);
      this.loginService.decryptList(strListCrypt)
        .then( strListDeCrypt => {
          this.loginService.userName = strListDeCrypt[0];
          this.loginService.userHash = strListDeCrypt[1];
          this.loginService.chipher_hash = strListDeCrypt[2];
          this.loginService.chipher_password = "";
          this.loginService.keepMeLogged = true;
          this.loginService.userPassword = '';
          this.loginService.checkLogin()
            .then((errorCode: number) => {
              if (errorCode == 0) {
                this.loggedTxt = "Invitation detail valid.";
                ret.childInject = ReturnCodes.LoginValid;
                resolve(ret);
              } else {
                this.loggedTxt = "Invitation detail not valid. Contact the admin to fix this problem.";
                ret.childInject = ReturnCodes.LoginInvalid;
                resolve(ret);
              }
            })
            .catch((err) => {
              this.loggedTxt = "Error validating login detail. Please check the internet connection.";
              console.log(err);
            });
        })
        .catch( err => console.log(err));
    });
  }
}
