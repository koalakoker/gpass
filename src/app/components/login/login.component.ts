import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/api/login.service';
import { LoginState } from './loginState';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  state: LoginState = LoginState.emailInsert;
  @Output() userLogged = new EventEmitter<void>();
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('emailInput') userNameInput: ElementRef;

  email: string;
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
      this.loginService.updateUserLevel();
      this.userLogged.emit();
    } else {
      this.clear();
    };
  }

  isEmailState() {
    return this.state == LoginState.emailInsert;
  }

  isPasswordState() {
    return this.state == LoginState.passwordInsert;
  }

  emailEntered() {
    this.state = LoginState.passwordInsert;
    setTimeout(() => {
      this.passwordInput.nativeElement.focus();
    }, 100);
  }

  passwordEntered() {
    this.enter();
  }

  clear() {
    this.state = LoginState.emailInsert;
    this.email = '';
    this.userPassword = '';
  }

  async enter() {
    try {
      let errorCode: number = await this.loginService.checkLogin(this.email, this.userPassword);
      if (errorCode == this.errorCodeNoError) {
        this.state = LoginState.logged;
        this.userLogged.emit();
      } else {
        this.sendMessage.emit('Password not correct');
        if ((errorCode == this.errorCodeWrongUsername) || 
            (errorCode == this.errorCodeWrongUserPassword)) {
          this.email = '';
        }
        this.clear();
      }
      
    } catch (error) {
      console.log(error);
      this.sendMessage.emit('Login error');
      this.clear();
    }
  }

}
