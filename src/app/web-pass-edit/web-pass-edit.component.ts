import { Component, OnInit, Input } from '@angular/core';
import { WebPass } from '../modules/webpass';

@Component({
  selector: 'app-web-pass-edit',
  templateUrl: './web-pass-edit.component.html',
  styleUrls: ['./web-pass-edit.component.css']
})
export class WebPassEditComponent implements OnInit {

  @Input() webPass: WebPass;
  text: string;

  constructor() { }

  ngOnInit() {
  }


}
