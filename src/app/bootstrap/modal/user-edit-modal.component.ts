import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../../modules/user';
import { WebService } from '../../services/web.service';

@Component({
  selector:    'user-edit-modal',
  templateUrl: './user-edit-modal.component.html'
})
export class UserEditModalComponent {
  @Input() user: User;
  
  constructor(
    public activeModal: NgbActiveModal,
    private webService: WebService) {
   }

  onCloseEdit(){
    this.activeModal.close("");
  }

  save() {
    const user = new User(this.user);
    this.webService.updateUser(user)
      .catch(err => console.log(err));
  }
}