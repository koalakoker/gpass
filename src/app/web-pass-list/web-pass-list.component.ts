import { Component, OnInit } from '@angular/core';
import { WebPassService } from '../services/web-pass.service'
import { ListComponent } from '../list/list.component';
import { WebPass } from '../modules/webpass';

enum elementName {
  EN_URL = 0,
  EN_PASS = 1,
  EN_START = 2,
  EN_STOP = 3
}

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

  onNewFunc(i: number)
  {
    this.onInsert(i, new WebPass());
  }

  getUrl(name: elementName, index: number)
  {
    var str: string;
    var en: boolean;
    switch (name) {
      case elementName.EN_URL:
        str = this.list[index].url;
        en = str?true:false;
        str = str?str:"Url";
        break;
      case elementName.EN_PASS:
        str = this.list[index].pass;
        en = str ? true : false;
        str = str ? str : "Password";
        break;
      case elementName.EN_START:
        str = this.list[index].registeredDate;
        en = str ? true : false;
        str = str ? str : "Registration Date";
        break;
      case elementName.EN_STOP:
        str = this.list[index].expiriatonDate;
        en = str ? true : false;
        str = str ? str : "Expiration date";
        break;
    
      default:
        break;
    }
    return { value: str, enabled: en ? "spanColUrl" : "spanColUrlDisabled"};
  }


}
