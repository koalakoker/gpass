import { Refreshable, RefreshReturnData } from '../modules/refreshable/refreshable';
import * as PageCodes from '../modules/refreshable/pagesCodes'
import * as ReturnCodes from '../modules/refreshable/returnCodes';
import * as InputCodes from '../modules/refreshable/inputCodes';

import { PopupMessageComponent } from './../popup-message/popup-message.component';
import { WebService } from '../services/web.service';
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

  constructor(private httpService: WebService) { }

  refresh(): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.dbCreateBackupTable;
      ret.childInject = ReturnCodes.None;
      resolve(ret);
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    let body = new URLSearchParams();
    body.set('chipher_password', this.val.chiper_key);
    console.log("Verify that");
    this.httpService.post(body, 'https://www.koalakoker.com/angular/php/' + this.url)
    .then((json: JSON) => {
      var res: string;
      this.popupMessage.sendMessage(res, 3000);
    })
  }

}
