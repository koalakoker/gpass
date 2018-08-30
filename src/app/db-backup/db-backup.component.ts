import { Component, OnInit } from '@angular/core';
import { WebPassService } from '../services/web-pass.service';

export class dbBackupForm {
  chiper_key  : string = '';
  newtablename: string = '';
}

@Component({
  selector: 'app-db-backup',
  templateUrl: './db-backup.component.html',
  styleUrls: ['./db-backup.component.css']
})
export class DbBackupComponent implements OnInit {

  constructor(private httpService: WebPassService) { }

  url: string = "db_backup.php";
  val: dbBackupForm = new dbBackupForm();
  message: string;

  ngOnInit() {
  }

  onSubmit() {
    let body = new URLSearchParams();
    body.set('chipher_password', this.val.chiper_key);
    body.set('newtable', this.val.newtablename);
    this.httpService.post(body, 'https://www.koalakoker.com/angular/php/' + this.url)
      .subscribe(res => {
        this.message = res;
      })
  }

}
