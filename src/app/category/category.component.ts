import { Category } from './../modules/category';
import { Component, OnInit } from '@angular/core';

import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';
import * as InputCodes from '../modules/refreshable/inputCodes';

import { WebService } from '../services/web.service';
import { LoginService } from '../services/login.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteModalComponent } from '../bootstrap/modal/confirm-delete-modal.component';
import { CategoryEditModalComponent } from '../bootstrap/modal/category-edit-modal.component';

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

  constructor(private configService: WebService,
              private loginService: LoginService,
              private modalService: NgbModal) {
  };

  enter() {
    // User is logged show content
    this.configService.getFromUser('category')
      .then((json: JSON) => {
        var data: Array<Category> = [];
        for (var i in json) {
          let elem: Category = Object.assign(new Category(), json[i]);
          data.push(elem);
        }
        this.category = data;
        this.category.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else {
            if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          }
        })
      })
      .catch(err => console.log(err));
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
          reject("Not logged");
        });
      }
      else if (cmd == "btnPress") {
        this.onNewFunc();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      }
      else {
        reject("Wrong command");
      }
    })
  }

  onNewFunc() {
    const category = new Category();
    category.userid = this.loginService.userid;
    this.configService.createCategory(category)
      .then((json: JSON) => {
        category.id = +json;
        this.category.unshift(category);
      })
      .catch(err => console.log(err));
  }

  onButtonRemove(i: number) {
    const cat = this.category[i];
    this.configService.delete(cat.id, 'category')
      .then(() => {
        this.category.splice(i, 1);
      })
      .catch(err => console.log(err));
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
  }

  confirmDeleteModal(i: number) {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
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
