import { HttpHeaders } from '@angular/common/http';
import { LocalService } from '../local.service';

export class Api {

  //apiBaseUrl: string = 'http://localhost:5000/api';
  //apiBaseUrl: string = 'https://glinks.herokuapp.com/api';
  apiBaseUrl: string = 'https://woven-name-321505.appspot.com/api';

  constructor() {}

  protected httpOptions(localService: LocalService) {
    return {
      headers: new HttpHeaders({
        'x-auth-token': localService.getKey('x-auth-token'),
      })
    };
  }

  protected error(message: string) {
    throw "Database error: " + message;
  }
}