import { Component, OnInit } from '@angular/core';
import { WebPass } from './../../webpass';
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
  text: string;

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

  onButtonEdit() {
    this.edit = !this.edit;
  }

  onButtonRemove(webPass: WebPass) {
    const i: number = this.list.indexOf(webPass);
    this.list.splice(i,1);
  }

  onButtonInsert(webPass: WebPass) {
    const i: number = this.list.indexOf(webPass);
    this.list.splice(i+1, 0, new WebPass());
  }

  swap(list: WebPass[], i: number, j: number): WebPass[] {
    const tmp:WebPass = list[j];
    list[j] = list[i];
    list[i] = tmp;
    return list;
  }

  onButtonUp(webPass: WebPass) {
    const i: number = this.list.indexOf(webPass);
    this.swap(this.list,i,i-1);
  }

  onButtonDown(webPass: WebPass) {
    const i: number = this.list.indexOf(webPass);
    this.swap(this.list, i, i + 1);
  }

  isSelected(webPass: WebPass): boolean {
    return (webPass === this.selectedWebPass);
  }

  isNotFirst(webPass: WebPass): boolean {
    const i: number = this.list.indexOf(webPass);
    return (i > 0);
  }

  isNotLast(webPass: WebPass): boolean {
    const i: number = this.list.indexOf(webPass);
    return (i < this.list.length - 1);
  }
}
