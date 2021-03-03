import { Component, OnInit, ViewChild } from '@angular/core';
import { WebService } from '../services/web.service';
import { PopupMessageComponent } from '../popup-message/popup-message.component';

import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';
import * as InputCodes from '../modules/refreshable/inputCodes';

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

  constructor(private httpService: WebService) { }

  url: string = "db_backup.php";
  val: dbBackupForm = new dbBackupForm();
  @ViewChild('popupMessage') popupMessage: PopupMessageComponent;

  ngOnInit() {
  }

  refresh(): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.dbBackup;
      ret.childInject = ReturnCodes.None;
      resolve(ret);
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
