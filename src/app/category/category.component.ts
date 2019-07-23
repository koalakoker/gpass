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
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.get(encrypted, 'category').subscribe((data: Array<Category>) => {
        this.category = data;
      });
    });
  }

  ngOnInit() {
    this.checklogged();
  }

  refresh() {
    this.checklogged();
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
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.updateCategory(category, encrypted).subscribe(() => {
        this.sendMessage("Database updated");
      });
    });
  }

  onNewFunc() {
    const category = new Category();
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.createCategory(category, encrypted).subscribe((id: number) => {
        category.id = id;
        this.category.push(category);
      },
        err => {
          console.log(err);
        });
    });
  }

  sendMessage(text: string) {
    clearInterval(this.interval);
    this.message = text;
    this.interval = setInterval(() => {
      this.message = '';
      clearInterval(this.interval);
    }, 2000);
  }
}
