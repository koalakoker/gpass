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

  chipher_password: string;
  logged: boolean = false;
  list: WebPass[];
  selectedListElement: WebPass;
  edit: boolean = false;
  errorMessage: string = "";

  constructor(private configService: WebPassService) {
    super();
  }

  ngOnInit() {
  }

  enter() {
    this.errorMessage = "";
    this.getWebPassList();
  }

  logOut() {
    this.logged = false;
    this.chipher_password = "";
    this.list = [];
  }

  getWebPassList() {
    this.configService.get(this.chipher_password).subscribe(
      (data: Array<WebPass>) => {
        this.list = data;
        this.list = this.list.map( function (x : WebPass) {
          WebPass.prototype.decrypt.call(x, this.chipher_password);
          return x;
        }, this);

        this.logged = true;
      },
      err => {
        this.errorMessage = "The password is not correct";
        this.chipher_password = "";
      }
    )
  }

  save(index: number) {
    const webPass = new WebPass(this.list[index]);
    WebPass.prototype.crypt.call(webPass, this.chipher_password);
    this.configService.update(webPass, this.chipher_password)
     .subscribe(() => {

     });
  }

  onNewFunc()
  {
    const webPass = new WebPass();
    webPass.url  = "New url";
    webPass.pass = "New pass";
    webPass.crypt(this.chipher_password);
    this.configService.create(webPass, this.chipher_password).subscribe((id:number) => {
      webPass.id = id;
      webPass.decrypt(this.chipher_password);
      this.list.push(webPass);
    });
  }

  onRemoveFunc(i: number)
  {
    const webPass = this.list[i];
    this.configService.delete(webPass.id, this.chipher_password).subscribe(() => {
      this.list.splice(i,1);
    });
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
        styleStrPrefix = "spanColFixedId"
        break;
    
      default:
        break;
    }
    return { value: str, enabled: styleStrPrefix + (en==true?"":"Disabled")};
  }


}
