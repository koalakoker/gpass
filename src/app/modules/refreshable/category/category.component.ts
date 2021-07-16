import { Category } from '../../category';
import { Component, OnInit, Output, EventEmitter} from '@angular/core';

import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';

import { LoginService } from '../../../services/api/login.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../bootstrap/modal/confirm-modal.component';
import { CategoryEditModalComponent } from '../../../bootstrap/modal/category-edit-modal.component';
import { CategoryService } from 'src/app/services/api/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, Refreshable {

  show: boolean = false;
  edit: boolean;
  selecteCategory: Category;
  category: Category[];
  errorMessage: string = '';
  message: string = '';
  interval;
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(private categoryService: CategoryService,
              private loginService: LoginService,
              private modalService: NgbModal) {
  }
  
  async enter() {
    try {
      const data = await this.categoryService.getFromUserCategory();
      this.category = [];
      data.forEach(category => {
        this.category.push(category);
      });
    } catch (error) {
      console.log(error);
    }
  }

  queryForAction(action: any): boolean {
    if (action === InputCodes.NewBtnPress) {
      return (this.isNewPosible())
    }
  }

  ngOnInit() {
    this.loginService.checklogged()
    .then (() => {
      this.show = true;
      this.enter();
    })
    .catch ((err) => {
      console.log("promise failed with err:" + err);
    })
  }

  refresh(cmd: string = ""): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.categoryPage;
      if (cmd == InputCodes.Refresh) {
        this.loginService.checklogged()
        .then(() => {
          this.show = true;
          this.enter();
          ret.childInject = ReturnCodes.ButtonInsertCategory
          resolve(ret);
        })
        .catch((err) => {
          this.category = [];
          reject("Not logged");
        });
      }
      else if (cmd == InputCodes.NewBtnPress) {
        this.onNewFunc();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      }
      else {
        reject("Wrong command");
      }
    })
  }

  isNewPosible(): boolean {
    return (this.loginService.userPassword !== "");
  }

  async onNewFunc() {
    const category = new Category();
    try {
      const id = await this.categoryService.createCategory(category);  
      category._id = id;
      this.category.unshift(category);
      this.hasChanged.emit();
    } catch (error) {
      console.log(error);
    }
  }

  async onButtonRemove(i: number) {
    const cat = this.category[i];
    try {
      await this.categoryService.deleteCategory(cat._id);  
      this.category.splice(i, 1);
      this.hasChanged.emit();
    } catch (error) {
      console.log(error);
    }
  }

  isSelected(cat: Category): boolean {
    return (cat === this.selecteCategory);
  }

  isActive(cat: Category): string {
    return (this.isSelected(cat) ? "active" : "");
  }

  onSelect(cat: Category) {
    if (this.selecteCategory != cat) {
      this.edit = false;
    }
    this.selecteCategory = cat;
  }

  sendMessage(text: string) {
    clearInterval(this.interval);
    this.message = text;
    this.interval = setInterval(() => {
      this.message = '';
      clearInterval(this.interval);
    }, 2000);
  }

  onCloseEdit() {
    this.hasChanged.emit();
  }

  confirmDeleteModal(i: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = "Warning";
    modalRef.componentInstance.message = "Are you sure to delete this?";
    modalRef.result
      .then((result) => {
        this.onButtonRemove(i);
      }, () => { });
  }

  openEditModal(i: number) {
    const modalRef = this.modalService.open(CategoryEditModalComponent);
    modalRef.componentInstance.category = this.category[i];
    modalRef.result
      .then((result) => {
        this.onCloseEdit();
      }, (reason) => {
        this.onCloseEdit();
      });
  }
}
