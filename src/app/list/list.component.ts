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

  isSelected(listElement: Element): boolean {
    return (listElement === this.selectedListElement);
  }
}