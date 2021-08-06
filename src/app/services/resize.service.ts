import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ScreenSize } from "../components/size-detector/screen-size.enum";
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class ResizeService {
  
  private resizeSubject: Subject<ScreenSize>;
  lastSize: ScreenSize = ScreenSize.XL;
  
  constructor() {
    this.resizeSubject = new Subject();
  }
  
  get onResize$(): Observable<ScreenSize> {
    return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
  }

  onResize(size: ScreenSize) {
    this.resizeSubject.next(size);
    this.lastSize = size;
  }

}