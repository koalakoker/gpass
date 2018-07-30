import { Component, OnInit } from '@angular/core';
import { WebPassService } from '../services/web-pass.service'
import { ListComponent } from '../list/list.component';
import { WebPass } from '../modules/webpass';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent extends ListComponent implements OnInit {

  list: WebPass[];
  selectedListElement: WebPass;
  edit: boolean = false;
  text: string;

  constructor(private webPassService: WebPassService) {
    super(webPassService);
  }

  ngOnInit() {
    this.getWebPassList();
  }

  getWebPassList() {
    this.webPassService.getData().subscribe(data => {this.list = data; this.text=this.list.length.toString()});
  }

  onSelect(listElement: WebPass) {
    if (this.selectedListElement != listElement) {
      this.edit = false;
    }
    this.selectedListElement = listElement;
  }

  onButtonEdit() {
    this.edit = !this.edit;
  }

  onButtonRemove(listElement: WebPass) {
    const i: number = this.list.indexOf(listElement);
    this.list.splice(i,1);
  }

  onButtonInsert(listElement: WebPass) {
    const i: number = this.list.indexOf(listElement);
    this.list.splice(i+1, 0, new WebPass());
  }

  swap(list: WebPass[], i: number, j: number): WebPass[] {
    const tmp:WebPass = list[j];
    list[j] = list[i];
    list[i] = tmp;
    return list;
  }

  onButtonUp(listElement: WebPass) {
    const i: number = this.list.indexOf(listElement);
    this.swap(this.list,i,i-1);
  }

  onButtonDown(listElement: WebPass) {
    const i: number = this.list.indexOf(listElement);
    this.swap(this.list, i, i + 1);
  }

  isSelected(listElement: WebPass): boolean {
    return (listElement === this.selectedListElement);
  }

  isNotFirst(listElement: WebPass): boolean {
    const i: number = this.list.indexOf(listElement);
    return (i > 0);
  }

  isNotLast(listElement: WebPass): boolean {
    const i: number = this.list.indexOf(listElement);
    return (i < this.list.length - 1);
  }
}
