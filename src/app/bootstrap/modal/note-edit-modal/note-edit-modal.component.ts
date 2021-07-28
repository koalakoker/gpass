import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAnswers } from '../modalAnswers';

@Component({
  selector: 'app-note-edit-modal',
  templateUrl: './note-edit-modal.component.html'
})
export class NoteEditModalComponent {

  title: string;

  constructor(public activeModal: NgbActiveModal) { }

  onCloseEdit() {
    this.activeModal.close(ModalAnswers.esc);
  }

}
