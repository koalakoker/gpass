import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export class QuestionModalAnswers {
  static yes: string = 'yes click';
  static no: string  = 'no click';
  static esc: string = 'esc click';
} 

@Component({
  selector: 'app-question-modal',
  templateUrl: './question-modal.component.html'
})
export class QuestionModalComponent implements OnInit {

  title: string = "Title";
  message: string = "Message";
  esc: string = QuestionModalAnswers.esc;
  yes: string = QuestionModalAnswers.yes;
  no:  string = QuestionModalAnswers.no;

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
