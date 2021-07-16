import { LoginService } from './login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalService } from '../local.service';

export class Api {
  constructor() {}

  protected httpOptions(localService: LocalService) {
    return {
      headers: new HttpHeaders({
        'x-auth-token': localService.getKey('x-auth-token'),
      })
    };
  }

  protected error(message: string) {
    throw new Error("Database error: " + message);
  }
}