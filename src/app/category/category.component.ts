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
  encrypted_password: string;
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
    this.configService.get(this.encrypted_password, 'category').subscribe((data: Array<Category>) => {
      this.category = data;
    }, err => {
      // Encrypted pass scaduta o Chipher Password errata
      this.g.cryptPass(this.chipher_password, (encrypted) => {
        this.sessionService.setKey('EncryptedPassword', encrypted);
        this.encrypted_password = encrypted;
        this.enter();
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
      this.encrypted_password = this.sessionService.getKey('EncryptedPassword');
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
    this.configService.updateCategory(category, this.encrypted_password).subscribe(() => {
      this.sendMessage("Database updated");
    }, err => {
      // Encrypted pass scaduta o Chipher Password errata
      this.g.cryptPass(this.chipher_password, (encrypted) => {
        this.sessionService.setKey('EncryptedPassword', encrypted);
        this.encrypted_password = encrypted;
        this.save(index);
      });
    });
  }

  onNewFunc() {
    const category = new Category();
    this.configService.createCategory(category, this.encrypted_password).subscribe((id: number) => {
      category.id = id;
      this.category.push(category);
    }, err => {
      // Encrypted pass scaduta o Chipher Password errata
      this.g.cryptPass(this.chipher_password, (encrypted) => {
        this.sessionService.setKey('EncryptedPassword', encrypted);
        this.encrypted_password = encrypted;
        this.onNewFunc();
      });
    });
  }

  onButtonRemove(i: number) {
    const cat = this.category[i];
    this.configService.delete(cat.id, this.encrypted_password, 'category').subscribe(() => {
      this.category.splice(i, 1);
    }, err => {
      // Encrypted pass scaduta o Chipher Password errata
      this.g.cryptPass(this.chipher_password, (encrypted) => {
        this.sessionService.setKey('EncryptedPassword', encrypted);
        this.encrypted_password = encrypted;
        this.onButtonRemove(i);
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
