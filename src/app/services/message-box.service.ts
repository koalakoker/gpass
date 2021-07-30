import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutModalComponent } from '../bootstrap/modal/about-modal/about-modal.component';
import { MessageBoxComponent } from '../bootstrap/modal/message-box/message-box.component';
import { QuestionModalComponent } from '../bootstrap/modal/question-modal/question-modal.component';
import { ModalAnswers } from '../bootstrap/modal/modalAnswers';
import { User } from '../modules/user'
import { PasswordModalComponent } from '../bootstrap/modal/password-modal/password-modal.component';

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  constructor(private modalService: NgbModal) { }

  async message(title: string, message: string) {
    const modalRef = this.modalService.open(MessageBoxComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    await modalRef.result;
  }

  async about(user: User) {
    const modalRef = this.modalService.open(AboutModalComponent);
    modalRef.componentInstance.user = user;
    await modalRef.result;
  }

  async question(title: string, message: string) {
    const modalRef = this.modalService.open(QuestionModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    let ans;
    try {
      ans = await modalRef.result;
    } catch (error) {
      if ((error === 0) || (error == 1)) {
        ans = ModalAnswers.esc;
      } else {
        ans = error;
      }
    }
    return ans;
  }

  async password(title: string, message: string): Promise<any> {
    const modalRef = this.modalService.open(PasswordModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    let ans;
    let password = '';
    try {
      ans = await modalRef.result;
      password = modalRef.componentInstance.password;
    } catch (error) {
      if ((error === 0) || (error == 1)) {
        ans = ModalAnswers.esc;
      } else {
        ans = error;
      }
    }
    return { ans, password };
  }
}
