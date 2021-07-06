import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

import { User } from '../../modules/user';

@Component({
  selector:    'user-edit-modal',
  templateUrl: './user-edit-modal.component.html'
})
export class UserEditModalComponent {
  @Input() user: User;
  
  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService) {
   }

  onCloseEdit(){
    this.activeModal.close("");
  }

  save() {
    const user = new User(this.user);
    this.userService.updateUser(user)
      .catch(err => console.log(err));
  }

  updateLevel(level: number) {
    this.user.level = level;
    this.save();
  }
}