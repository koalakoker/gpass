import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html'
})
export class MessageBoxComponent {
  title: string = 'Title';
  message: string = 'Message';

  constructor(public activeModal: NgbActiveModal) { }

  onCloseEdit() {
    this.activeModal.close("");
  }

}
