import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { WebPass } from './webpass';
import { WebPassList } from './moka_webpass';

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

