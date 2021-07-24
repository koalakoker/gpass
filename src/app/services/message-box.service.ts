import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutModalComponent } from '../bootstrap/modal/about-modal/about-modal.component';
import { MessageBoxComponent } from '../bootstrap/modal/message-box.component';
import { QuestionModalAnswers, QuestionModalComponent } from '../bootstrap/modal/question-modal/question-modal.component';
import { User } from '../modules/user'

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
    this.onClose();
  }

  async about(user: User) {
    const modalRef = this.modalService.open(AboutModalComponent);
    modalRef.componentInstance.user = user;
    await modalRef.result;
    this.onClose();
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
        ans = QuestionModalAnswers.esc;
      } else {
        ans = error;
      }
    }
    return ans;
  }

  onClose() {
  }
}
