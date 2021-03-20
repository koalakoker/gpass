import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {

  title: string = "Title";
  message: string = "Message";

  constructor(public activeModal: NgbActiveModal) { }

  dismiss(str: string) {
    this.activeModal.dismiss(str);
  }

  close(str: string) {
    this.activeModal.close(str);
  }
}