import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoginService } from '../services/login.service';

export enum LoginState {
  userNameInsert,
  passwordInsert,
  masterPasswordInsert,
  logged
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  @Input() state: LoginState = LoginState.masterPasswordInsert;
  @Output() userLogged = new EventEmitter<void>();
  @Output() sendMessage = new EventEmitter<string>();

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    if (this.loginService.getSession()) {
      this.enter();
    } else {
      if (this.loginService.getLocal()) {
        this.enter();
      } else {
        if (this.loginService.chipher_password == '') {
          this.state = LoginState.masterPasswordInsert;
        } else if (this.loginService.userName == '') {
          this.state = LoginState.userNameInsert;
        } else if (this.loginService.userPassword == '') {
          this.state = LoginState.passwordInsert;
        }
      };
    };
  }

  isUserNameState() {
    return this.state == LoginState.userNameInsert;
  }
  isPasswordState() {
    return this.state == LoginState.passwordInsert;
  }
  isMasterPasswordState() {
    return this.state == LoginState.masterPasswordInsert;
  }

  materPasswordEntered() {
    this.state = LoginState.userNameInsert;
  }
  usernameEntered() {
    this.state = LoginState.passwordInsert;
  }
  passwordEntered() {
    this.enter();
  }

  async enter() {
    this.loginService.checkLogin()
      .then((logged: boolean) => {
        if (logged) {
          this.state = LoginState.logged;
          this.userLogged.emit();
        } else {
          this.state = LoginState.userNameInsert;
          this.sendMessage.emit('Password not correct');
        }
      })
      .catch((err) => {
        this.state = LoginState.userNameInsert;
        this.sendMessage.emit('Login error');
        console.log(err);
      });
  }

}
