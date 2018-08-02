import { WebPass } from '../modules/webpass';
import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
})
};

function getMethods(obj) {
    var result = [];
    for (var id in obj) {
      try {
        if (typeof(obj[id]) == "function") {
          result.push(id + ": " + obj[id].toString() +"\n----------------------------------------------------------\n");
        }
      } catch (err) {
        result.push(id + ": inaccessible");
      }
    }
    return result;
  }

@Injectable()
export class WebPassService {
    constructor(private http: HttpClient) {
    }

    //urlGetData = 'http://www.koalakoker.com/angular/php/db_get_json.php?chipher_password=f0t0graf1a!Papa';
    urlGetData = 'http://www.koalakoker.com/angular/php/db_get_json.php';
    //urlGetData = 'http://192.168.1.129/angular/php/json.php';

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `status.text ${error.statusText}, ` + 
            `status.message ${error.message}, ` + 
            `erro type ${typeof(error.error)}, ` + 
            `erro methods ${getMethods(document).join("\n")}, ` + 
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      };

    getData() {
        //return this.http.get<Array<WebPass>>(this.urlGetData, {responseType: 'json'}).pipe(catchError(this.handleError));

        return this.http.post(this.urlGetData, {chipher_password: "f0t0graf1a!Papa"}).pipe(catchError(this.handleError));
    }
}