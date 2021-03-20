import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Category } from '../../modules/category';
import { WebService } from '../../services/web.service';

@Component({
  selector:    'category-edit-modal',
  templateUrl: './category-edit-modal.component.html'
})
export class CategoryEditModalComponent {
  @Input() category: Category;
  
  constructor(
    public activeModal: NgbActiveModal,
    private webService: WebService) {
   }

  onCloseEdit(){
    this.activeModal.close("");
  }

  save() {
    const category = new Category(this.category);
    this.webService.updateCategory(category)
      .then(() => {
        console.log("Database updated");
      })
      .catch(err => console.log(err));
  }
}