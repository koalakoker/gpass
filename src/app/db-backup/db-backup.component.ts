import { Component, OnInit, ViewChild } from '@angular/core';
import { WebPassService } from '../services/web-pass.service';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { Refreshable } from '../modules/refreshable';

export class dbBackupForm {
  chiper_key  : string = '';
  newtablename: string = '';
}

@Component({
  selector: 'app-db-backup',
  templateUrl: './db-backup.component.html',
  styleUrls: ['./db-backup.component.css']
})
export class DbBackupComponent implements OnInit, Refreshable {

  constructor(private httpService: WebPassService) { }

  url: string = "db_backup.php";
  val: dbBackupForm = new dbBackupForm();
  @ViewChild('popupMessage') popupMessage: PopupMessageComponent;

  ngOnInit() {
  }

  refresh(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve("");
    })
  }

  onSubmit() {
    let body = new URLSearchParams();
    body.set('chipher_password', this.val.chiper_key);
    body.set('newtable', this.val.newtablename);
    this.httpService.post(body, 'https://www.koalakoker.com/angular/php/' + this.url)
      .subscribe(res => {
        this.popupMessage.sendMessage(res, 3000);
      })
  }

}
