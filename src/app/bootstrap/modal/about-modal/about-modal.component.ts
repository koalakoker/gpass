import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/modules/user';
import { name, version } from '../../../../../package.json';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html'
})
export class AboutModalComponent {

  title: string = 'GPass - ' + version;
  @Input() user: User;

  constructor(public activeModal: NgbActiveModal) { }

  onCloseEdit() {
    this.activeModal.close("");
  }

}
