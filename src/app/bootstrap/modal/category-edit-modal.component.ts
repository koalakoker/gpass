import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../modules/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector:    'category-edit-modal',
  templateUrl: './category-edit-modal.component.html'
})
export class CategoryEditModalComponent {
  @Input() category: Category;
  
  constructor(
    public activeModal: NgbActiveModal,
    private categoryService: CategoryService) {
   }

  onCloseEdit(){
    this.activeModal.close("");
  }

  async save() {
    const category = new Category(this.category);
    try {
      await this.categoryService.updateCategory(category._id, category)
    } catch (error) {
      console.log(error);
    }
  }
}