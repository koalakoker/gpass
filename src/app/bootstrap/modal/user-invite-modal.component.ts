import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/modules/user';

@Component({
  selector: 'user-invite-modal',
  templateUrl: './user-invite-modal.component.html'
})
export class UserInviteModalComponent {

  user: User;

  constructor(public activeModal: NgbActiveModal) {
    this.user = new User();
   }

  dismiss(str: string) {
    this.activeModal.dismiss(str);
  }

  close(str: string) {
    this.activeModal.close(str);
  }
}