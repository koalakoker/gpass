import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ResizeService } from 'src/app/services/resize.service';
import { LoginService } from '../../services/api/login.service';
import { LoginState } from './loginState';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  state: LoginState = LoginState.emailInsert;
  @Output() userLoggedNow = new EventEmitter<void>();
  @Output() userAlreadyLogged = new EventEmitter<void>();
  @Output() sendMessage = new EventEmitter<string>();
  @Output() loading = new EventEmitter<boolean>();
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;

  email: string;
  userPassword: string;

  errorCodeNoError           : number = 0;
  errorCodeMissingParams     : number = 1;
  errorCodeWrongUsername     : number = 3;
  errorCodeWrongUserPassword : number = 4;
  errorCodeSessionDestroyed  : number = 5;

  constructor(
    private loginService: LoginService,
    private sizeService: ResizeService) {
    this.sizeService.onResize$.subscribe((size) => {
      
    });
    }

  ngOnInit(): void {
    if (this.loginService.check()) {
      this.state = LoginState.logged;
      this.loginService.updateUserLevel();
      this.userAlreadyLogged.emit();
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

  emailIsValid(): boolean {
    return (this.email != ''); 
  }

  emailEntered() {
    this.state = LoginState.passwordInsert;
    setTimeout(() => {
      this.passwordInput.nativeElement.focus();
    }, 100);
  }

  backToEmail() {
    this.state = LoginState.emailInsert;
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 100);
  }

  passwordIsValid(): boolean {
    return (this.userPassword != '');
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
      this.loading.emit(true);
      let errorCode: number = await this.loginService.checkLogin(this.email, this.userPassword);
      this.loading.emit(false);
      if (errorCode == this.errorCodeNoError) {
        this.state = LoginState.logged;
        this.userLoggedNow.emit();
      } else {
        this.sendMessage.emit('Password not correct');
        if ((errorCode == this.errorCodeWrongUsername) || 
            (errorCode == this.errorCodeWrongUserPassword)) {
          this.email = '';
        }
        this.clear();
      }
    } catch (error) {
      this.loading.emit(false);
      console.log(error);
      this.sendMessage.emit(error);
      this.clear();
    }
  }

}
