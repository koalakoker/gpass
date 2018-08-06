import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Element } from '../modules/element';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() elementTemplate;
  @Input() editTemplate;
  @Input()list: Element[];
  @Output() onNew   : EventEmitter<any> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  selectedListElement: Element;
  edit: boolean = false;
  text: string;

  constructor() { }

  ngOnInit() {    
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

  onButtonRemove(i: number) {
    this.onRemove.emit([i]);
  }

  onButtonInsert(i: number) {
    this.onNew.emit([i]);
  }

  swap(list: Element[], i: number, j: number): Element[] {
    const tmp:Element = list[j];
    list[j] = list[i];
    list[i] = tmp;
    return list;
  }

  onButtonUp(i: number) {
    this.swap(this.list,i,i-1);
  }

  onButtonDown(i: number) {
    this.swap(this.list, i, i + 1);
  }

  isSelected(listElement: Element): boolean {
    return (listElement === this.selectedListElement);
  }

  isNotFirst(i: number): boolean {
    return (i > 0);
  }

  isNotLast(i: number): boolean {
    return (i < this.list.length - 1);
  }
}