import { Component, OnInit } from '@angular/core';
import { Refreshable } from '../modules/refreshable';
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

  constructor(
    private route: ActivatedRoute,
    public loginService: LoginService
    ) { }

  ngOnInit(): void {
  }

  refresh(cmd: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.user_name = this.route.snapshot.paramMap.get('user_name');
      this.user_password = this.route.snapshot.paramMap.get('user_password');
      this.chipher_password = this.route.snapshot.paramMap.get('chipher_password');
      var strList = [];
      strList.push(this.user_name);
      strList.push(this.user_password);
      strList.push(this.chipher_password);
      this.loginService.decryptList(strList)
        .then((strListCrypt) => {
          this.user_name = strListCrypt[0];
          this.user_password = strListCrypt[1];
          this.chipher_password = strListCrypt[2];
          resolve("");
      })
    });
  }
}
