import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { WebService } from '../services/web.service';
import { PopupMessageComponent } from '../popup-message/popup-message.component';

import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';

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

  url: string = "php/db_backup.php";
  val: dbBackupForm = new dbBackupForm();
  @ViewChild('popupMessage') popupMessage: PopupMessageComponent;
  @Output() hasChanged: EventEmitter<void> = new EventEmitter<void>();

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
    console.log("Verify this");
    this.httpService.post(body, this.url)
      .then((json: JSON) => {
        var res: string;
        this.popupMessage.sendMessage(res, 3000);
      })
  }

}
