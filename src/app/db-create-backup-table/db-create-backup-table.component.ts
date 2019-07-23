import { Refreshable } from './../modules/refreshable';
import { PopupMessageComponent } from './../popup-message/popup-message.component';
import { WebPassService } from './../services/web-pass.service';
import { Component, OnInit, ViewChild } from '@angular/core';

export class dbCreateTableForm {
  chiper_key: string = '';
}

@Component({
  selector: 'app-db-create-backup-table',
  templateUrl: './db-create-backup-table.component.html',
  styleUrls: ['./db-create-backup-table.component.css']
})
export class DbCreateBackupTableComponent implements OnInit, Refreshable {

  url: string = "db_create_table_backup.php";
  val: dbCreateTableForm = new dbCreateTableForm();
  @ViewChild('popupMessage') popupMessage: PopupMessageComponent;

  constructor(private httpService: WebPassService) { }

  refresh() {
  }

  ngOnInit() {
  }

  onSubmit() {
    let body = new URLSearchParams();
    body.set('chipher_password', this.val.chiper_key);
    this.httpService.post(body, 'https://www.koalakoker.com/angular/php/' + this.url)
    .subscribe(res => {
      this.popupMessage.sendMessage(res, 3000);
    })
  }

}
