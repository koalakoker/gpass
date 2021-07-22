import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutModalComponent } from '../bootstrap/modal/about-modal/about-modal.component';
import { MessageBoxComponent } from '../bootstrap/modal/message-box.component';
import { User } from '../modules/user'

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  constructor(private modalService: NgbModal) { }

  async show(title: string, message: string) {
    const modalRef = this.modalService.open(MessageBoxComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    await modalRef.result;
    this.onClose();
  }

  async showUser(user: User) {
    const modalRef = this.modalService.open(AboutModalComponent);
    modalRef.componentInstance.user = user;
    await modalRef.result;
    this.onClose();
  }


  onClose() {

  }
}
