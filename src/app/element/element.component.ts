import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-element',
  template: '',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {

  derivedElementTrigger: string = "<app-web-pass-element></app-web-pass-element>"

  constructor() { }

  ngOnInit() {
  }

}
