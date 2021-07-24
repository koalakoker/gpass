import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAnswers } from '../modalAnswers';

@Component({
  selector: 'app-question-modal',
  templateUrl: './question-modal.component.html'
})
export class QuestionModalComponent implements OnInit {

  title: string = "Title";
  message: string = "Message";
  esc: string = ModalAnswers.esc;
  yes: string = ModalAnswers.yes;
  no:  string = ModalAnswers.no;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  dismiss(str: string) {
    this.activeModal.dismiss(str);
  }

  close(str: string) {
    this.activeModal.close(str);
  }

}
