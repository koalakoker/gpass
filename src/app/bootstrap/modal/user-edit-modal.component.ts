import * as _ from 'lodash-es';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/api/user.service';

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

  async save() {
    const user = new User(this.user);
    try {
      await this.userService.updateUser(_.pick(user, ['_id', 'isAdmin', 'resetpass']))
      console.log('Database updated');
    } catch (error) {
      console.log(error);
    }
  }

  updateLevel(isAdmin: number) {
    this.user.isAdmin = (isAdmin === 1 ? true : false);
    this.save();
  }
}