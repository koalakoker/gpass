import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAnswers } from '../modalAnswers';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html'
})
export class PasswordModalComponent implements OnInit {
  title: string = "Title";
  message: string = "Message";
  esc: string = ModalAnswers.esc;
  confirm: string = ModalAnswers.confirm;
  cancel: string = ModalAnswers.cancel;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.passwordInput.nativeElement.focus();
    }, 100);
  }



  dismiss(str: string) {
    this.activeModal.dismiss(str);
  }

  close(str: string) {
    this.activeModal.close(str);
  }

}
