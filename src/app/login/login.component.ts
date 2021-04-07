import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('userNameInput') userNameInput: ElementRef;

  errorCodeNoError           : number = 0;
  errorCodeMissingParams     : number = 1;
  errorCodeWrongMasterKey    : number = 2;
  errorCodeWrongUsername     : number = 3;
  errorCodeWrongUserPassword : number = 4;
  errorCodeSessionDestroyed  : number = 5;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getSession();
    if (this.loginService.check()) {
      this.enter();
    } else {
      this.loginService.getLocal();
      if (this.loginService.check()) {
        this.enter();
      } else {
        this.stateReset();
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

  masterPasswordEntered() {
    this.state = LoginState.userNameInsert;
    setTimeout(() => {
      this.userNameInput.nativeElement.focus();
    }, 100);
  }

  usernameEntered() {
    this.state = LoginState.passwordInsert;
    setTimeout(() => {
      this.passwordInput.nativeElement.focus();
    }, 100);
  }

  passwordEntered() {
    this.enter();
  }

  stateReset() {
    if ((this.loginService.chipher_password == '') && 
        (this.loginService.chipher_hash     == '')) {
      this.state = LoginState.masterPasswordInsert;
    } else if (this.loginService.userName == '') {
      this.state = LoginState.userNameInsert;
    } else if (this.loginService.userPassword == '') {
      this.state = LoginState.passwordInsert;
    }
  }

  async enter() {
    try {
      let errorCode: number = await this.loginService.checkLogin();
      if (errorCode == this.errorCodeNoError) {
        this.state = LoginState.logged;
        this.userLogged.emit();
      } else {
        this.sendMessage.emit('Password not correct');
        if (errorCode == this.errorCodeWrongMasterKey) {
          this.loginService.chipher_password = '';
        }
        if ((errorCode == this.errorCodeWrongUsername) || 
            (errorCode == this.errorCodeWrongUserPassword)) {
          this.loginService.userName = '';
        }
        this.stateReset();
      }
      
    } catch (error) {
      console.log(error);
      this.sendMessage.emit('Login error');
      this.stateReset();
    }
  }

}
