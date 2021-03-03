import { Component, OnInit } from '@angular/core';

import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';
import * as InputCodes from '../modules/refreshable/inputCodes';

import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit, Refreshable {

  user_name: string;
  user_password: string;
  chipher_password: string;

  loggedTxt: string = "Verify invitation details";

  constructor(
    private route: ActivatedRoute,
    public loginService: LoginService
    ) { }

  ngOnInit(): void {
  }

  refresh(cmd: string): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.newUserPage;
      this.user_name = this.route.snapshot.paramMap.get('user_name');
      this.user_password = this.route.snapshot.paramMap.get('user_password');
      this.chipher_password = this.route.snapshot.paramMap.get('chipher_password');
      var strList = [];
      strList.push(this.user_name);
      strList.push(this.user_password);
      strList.push(this.chipher_password);
      this.loginService.decryptList(strList)
        .then((strListCrypt) => {
          this.loginService.userName = strListCrypt[0];
          this.loginService.userPassword = strListCrypt[1];
          this.loginService.chipher_password = strListCrypt[2];
          this.loginService.keepMeLogged = true;
          this.loginService.checkLogin()
            .then((logged: boolean) => {
              if (logged) {
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
    });
  }
}
