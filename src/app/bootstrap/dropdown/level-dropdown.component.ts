import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'level-dropdown',
  templateUrl: './level-dropdown.component.html'
})
export class LevelDropdownComponent {

  options = ["User",
             "Admin"];
  @Input() selectedElement = 0;
  @Output() changeEvent = new EventEmitter<number>();

  selected(){
    return this.options[this.selectedElement];
  }

  click(i){
    this.selectedElement = i;
    this.changeEvent.emit(i);
  }

}