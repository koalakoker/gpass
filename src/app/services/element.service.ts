import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { Element } from "../modules/element";

@Injectable({
  providedIn: 'root'
})
export abstract class ElementService {

  constructor() { }

  abstract getData(): Observable<Element[]>;
}
