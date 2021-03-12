import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { usersPage } from 'src/app/modules/refreshable/pagesCodes';

import { User } from '../../modules/user';
import * as Modal from '../modal/modal'

@Component({
  selector:    'new-user-modal',
  templateUrl: './new-user-modal.component.html'
})
export class NewUserModalComponent {
  @Input() user: User;
  returnValue: string;

  constructor(
    public activeModal: NgbActiveModal) {
   }

  onCloseEdit(){
    this.activeModal.close(this.returnValue);
  }

  onCrossPressed() {
    this.returnValue = Modal.MODAL_CROSS_PRESSED;
    this.onCloseEdit();
  }
  
  onEscPressed() {
    this.returnValue = Modal.MODAL_ESC_PRESSED;
    this.onCloseEdit();
  }

  onClickYes() {
    this.returnValue = Modal.MODAL_YES_BUTTON;
    this.onCloseEdit();
  }

  onClickNo() {
    this.returnValue = Modal.MODAL_NO_BUTTON;
    this.onCloseEdit();
  }

  updateLevel(level: number) {
    this.user.level = level;
  }
}