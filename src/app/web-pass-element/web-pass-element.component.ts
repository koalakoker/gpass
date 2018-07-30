import { Component, OnInit, Input } from '@angular/core';
import { WebPass } from '../modules/webpass';
import { ElementComponent } from '../element/element.component';

@Component({
  selector: 'app-web-pass-element',
  templateUrl: './web-pass-element.component.html',
  styleUrls: ['./web-pass-element.component.css']
})
export class WebPassElementComponent extends ElementComponent implements OnInit {

  @Input()wpass: WebPass;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
