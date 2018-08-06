import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../list/list.component';
import { WebPass } from '../modules/webpass';
import { WebPassService } from '../services/web-pass.service';

enum elementName {
  EN_URL = 0,
  EN_PASS = 1,
  EN_START = 2,
  EN_STOP = 3,
  EN_ID = 4
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

  constructor(private configService: WebPassService) {
    super();
  }

  ngOnInit() {
    this.getWebPassList();
  }

  getWebPassList() {
    this.configService.getData().subscribe((data: Array<WebPass>) => {
      this.list = data;
    })
  }

  save(index: number) {
    const webPass = this.list[index];
    this.configService.update(webPass)
     .subscribe(() => console.log("Put Done"));
  }

  onNewFunc(i: number)
  {
    const webPass = new WebPass();
    this.configService.create(webPass).subscribe((webPass) => {this.onInsert(webPass);;console.log("Create Done");});
  }

  onRemoveFunc(i: number)
  {
    const webPass = this.list[i];
    console.log("Remove: " + webPass.id);
    this.configService.delete(webPass.id).subscribe((res) => {console.log(res)});
  }

  getUrl(name: elementName, index: number)
  {
    var str: string;
    var styleStrPrefix;
    var en: boolean;
    switch (name) {
      case elementName.EN_URL:
        str = this.list[index].url;
        en = str?true:false;
        str = str?str:"Url";
        styleStrPrefix = "spanColFixed"
        break;
      case elementName.EN_PASS:
        str = this.list[index].pass;
        en = str ? true : false;
        str = str ? str : "Password";
        styleStrPrefix = "spanColFixed"
        break;
      case elementName.EN_START:
        str = this.list[index].registrationDate;
        en = str ? true : false;
        str = str ? str : "Registration Date";
        styleStrPrefix = "spanColFixedSmall"
        break;
      case elementName.EN_STOP:
        str = this.list[index].expirationDate;
        en = str ? true : false;
        str = str ? str : "Expiration date";
        styleStrPrefix = "spanColFixedSmall"
        break;
      case elementName.EN_ID:
        const id = this.list[index].id;
        if (id)
        {
          str = id.toString();
        }
        en = str ? true : false;
        str = str ? str : "ID";
        styleStrPrefix = "spanColFixedSmall"
        break;
    
      default:
        break;
    }
    return { value: str, enabled: styleStrPrefix + (en==true?"":"Disabled")};
  }


}
