import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { WebPass } from '../modules/webpass';
import { WebPassList } from '../modules/moka_webpass';

@Injectable({
  providedIn: 'root'
})
export class WebPassService {

  list: WebPass[];

  constructor() {
    const WL: WebPassList = new WebPassList();
    this.list = WL.getList();
   }
   
   getData(): Observable<WebPass[]> {
    return of(this.list);
   }
}

