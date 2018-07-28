import { WebPass } from './../../webpass';
import { Component, OnInit } from '@angular/core';
import { WebPassList } from '../../moka_webpass';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent implements OnInit {

  list: WebPass[];
  selectedWebPass: WebPass;
  edit: boolean = false;

  constructor() { }

  ngOnInit() {
    const WL = new WebPassList();
    this.list = WL.getList();
  }

  onSelect(webPass: WebPass) {
    if (this.selectedWebPass != webPass) {
      this.edit = false;
    }
    this.selectedWebPass = webPass;
  }

  onButton(event: MouseEvent) {
    this.edit = !this.edit;
  }

  primaryBtn(webPass: WebPass): boolean {
    return (webPass !== this.selectedWebPass);
  }

  secondaryBtn(webPass: WebPass): boolean {
    return ((webPass === this.selectedWebPass ) && (!this.edit));
  }

  darkBtn(webPass: WebPass): boolean {
    return ((webPass === this.selectedWebPass ) && (this.edit));
  }

}
