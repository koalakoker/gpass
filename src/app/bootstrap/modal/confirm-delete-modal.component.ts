import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector:    'confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html'
})
export class ConfirmDeleteModalComponent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) { }

  dismiss(str: string){
    this.activeModal.dismiss(str);
  }

  close(str: string){
    this.activeModal.close(str);
  }
}