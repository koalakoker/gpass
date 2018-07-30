import { Component, OnInit } from '@angular/core';
import { WebPassService } from '../services/web-pass.service'
import { ListComponent } from '../list/list.component';
import { WebPass } from '../modules/webpass';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent extends ListComponent implements OnInit {

  list: WebPass[];
  selectedListElement: WebPass;
  edit: boolean = false;

  constructor(private webPassService: WebPassService) {
    super();
  }

  ngOnInit() {
    this.getWebPassList();
  }

  getWebPassList() {
    this.webPassService.getData().subscribe(data => {this.list = data});
  }
}
