import { Category } from './../modules/category';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Refreshable } from '../modules/refreshable';
import { GCrypto } from '../modules/gcrypto';
import { WebPassService } from '../services/web-pass.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, Refreshable {

  edit: boolean;
  selecteCategory: Category;
  logged = false;
  chipher_password: string;
  g: GCrypto;
  category: Category[];
  errorMessage: string = '';
  message: string = '';
  interval;

  constructor(
    private sessionService: SessionService,
    private configService: WebPassService) {
    this.g = new GCrypto(this.configService);
  };

  enter() {
    // User is logged show content
    this.configService.get("", 'category').subscribe((data: Array<Category>) => {
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
      });
    }, err => console.log(err));
  }

  ngOnInit() {
    this.checklogged();
  }

  refresh(cmd: string = "") {
    if (cmd == "")
    {
      this.checklogged();
      return "btnInsertCategory";
    }
    if (cmd == "btnPress") {
      this.onNewFunc();
    }
  }

  checklogged() {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
      this.enter();
    }
    else {
      this.chipher_password = '';
      this.logged = false;
    }
  }

  save(index: number) {
    const category = new Category(this.category[index]);
    this.configService.updateCategory(category, "").subscribe(() => {
      this.sendMessage("Database updated");
    }, err => console.log(err));
  }

  onNewFunc() {
    const category = new Category();
    this.configService.createCategory(category, "").subscribe((id: number) => {
      category.id = id;
      this.category.unshift(category);
    }, err => console.log(err));
  }

  onButtonEdit() {
    this.edit = !this.edit;
  }

  onButtonRemove(i: number) {
    const cat = this.category[i];
    this.configService.delete(cat.id, "", 'category').subscribe(() => {
      this.category.splice(i, 1);
    }, err => console.log(err));
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
}
