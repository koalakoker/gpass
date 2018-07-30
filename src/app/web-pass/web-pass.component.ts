import { Component, OnInit, Input } from '@angular/core';
import { WebPass } from '../modules/webpass';

@Component({
  selector: 'app-web-pass',
  templateUrl: './web-pass.component.html',
  styleUrls: ['./web-pass.component.css']
})
export class WebPassComponent implements OnInit {

  @Input() webPass: WebPass;
  text: string;

  constructor() { }

  ngOnInit() {
  }


}
