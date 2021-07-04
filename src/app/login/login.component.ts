import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../services/login.service';

export enum LoginState {
  userNameInsert,
  passwordInsert,
  logged
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  @Input() state: LoginState = LoginState.userNameInsert;
  @Output() userLogged = new EventEmitter<void>();
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('userNameInput') userNameInput: ElementRef;

  userName: string;
  userPassword: string;

  errorCodeNoError           : number = 0;
  errorCodeMissingParams     : number = 1;
  errorCodeWrongUsername     : number = 3;
  errorCodeWrongUserPassword : number = 4;
  errorCodeSessionDestroyed  : number = 5;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    if (this.loginService.check()) {
      this.state = LoginState.logged;
      this.userLogged.emit();
    } else {
      this.stateReset();
    };
  }

  isUserNameState() {
    return this.state == LoginState.userNameInsert;
  }

  isPasswordState() {
    return this.state == LoginState.passwordInsert;
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
    this.state = LoginState.userNameInsert;
  }

  async enter() {
    try {
      let errorCode: number = await this.loginService.checkLogin(this.userName, this.userPassword);
      if (errorCode == this.errorCodeNoError) {
        this.state = LoginState.logged;
        this.userLogged.emit();
      } else {
        this.sendMessage.emit('Password not correct');
        if ((errorCode == this.errorCodeWrongUsername) || 
            (errorCode == this.errorCodeWrongUserPassword)) {
          this.userName = '';
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
