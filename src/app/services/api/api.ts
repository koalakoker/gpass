import { HttpHeaders } from '@angular/common/http';
import { LocalService } from '../local.service';

export class Api {

  apiBaseUrl: string = 'https://glinks.herokuapp.com/api';

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