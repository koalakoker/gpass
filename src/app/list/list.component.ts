import { Component, OnInit } from '@angular/core';
import { Element } from '../modules/element';
import { ElementService } from '../services/element.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  list: Element[];
  selectedListElement: Element;
  edit: boolean = false;
  text: string;

  constructor(private elementService: ElementService) { }

  ngOnInit() {
    this.getWebPassList();
  }

  getWebPassList() {
    this.elementService.getData().subscribe(data => this.list = data);
  }

  onSelect(listElement: Element) {
    if (this.selectedListElement != listElement) {
      this.edit = false;
    }
    this.selectedListElement = listElement;
  }

  onButtonEdit() {
    this.edit = !this.edit;
  }

  onButtonRemove(listElement: Element) {
    const i: number = this.list.indexOf(listElement);
    this.list.splice(i,1);
  }

  onButtonInsert(listElement: Element) {
    const i: number = this.list.indexOf(listElement);
    this.list.splice(i+1, 0, new Element());
  }

  swap(list: Element[], i: number, j: number): Element[] {
    const tmp:Element = list[j];
    list[j] = list[i];
    list[i] = tmp;
    return list;
  }

  onButtonUp(listElement: Element) {
    const i: number = this.list.indexOf(listElement);
    this.swap(this.list,i,i-1);
  }

  onButtonDown(listElement: Element) {
    const i: number = this.list.indexOf(listElement);
    this.swap(this.list, i, i + 1);
  }

  isSelected(listElement: Element): boolean {
    return (listElement === this.selectedListElement);
  }

  isNotFirst(listElement: Element): boolean {
    const i: number = this.list.indexOf(listElement);
    return (i > 0);
  }

  isNotLast(listElement: Element): boolean {
    const i: number = this.list.indexOf(listElement);
    return (i < this.list.length - 1);
  }
}