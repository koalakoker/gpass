import { Component, OnInit } from '@angular/core';
import { WebPass } from '../modules/webpass';
import { WebPassService } from '../services/web-pass.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent implements OnInit {

  list: WebPass[];
  selecteWebPass: WebPass;
  edit: boolean = false;
  chipher_password: string;
  logged = false;
  errorMessage = '';
  copyMessage = '';
  interval;
 
  constructor(
    private configService: WebPassService,
    private sessionService: SessionService
    ) {}

  private KEY_CHIPER_PASS = 'ChipherPassword';

  ngOnInit() {
    const storedPass = this.sessionService.getKey(this.KEY_CHIPER_PASS);
    if ((storedPass != undefined) && (storedPass!= '')) {
      this.chipher_password = storedPass;
      this.enter();
    }
  }

  enter() {
    this.errorMessage = '';
    this.getWebPassList();
  }

  logOut() {
    this.logged = false;
    this.chipher_password = '';
    this.sessionService.setKey(this.KEY_CHIPER_PASS, '');
    this.list = [];
  }

  getWebPassList() {
    this.configService.get(this.chipher_password).subscribe(
      (data: Array<WebPass>) => {
        this.list = data;
        this.list = this.list.map( function (x: WebPass) {
          WebPass.prototype.decrypt.call(x, this.chipher_password);
          return x;
        }, this);

        this.logged = true;
        this.sessionService.setKey(this.KEY_CHIPER_PASS, this.chipher_password);
      },
      err => {
        this.errorMessage = 'The password is not correct';
        this.chipher_password = '';
        this.sessionService.setKey(this.KEY_CHIPER_PASS, '');
      }
    );
  }

  save(index: number) {
    const webPass = new WebPass(this.list[index]);
    WebPass.prototype.crypt.call(webPass, this.chipher_password);
    this.configService.update(webPass, this.chipher_password)
     .subscribe(() => {

     });
  }

  onNewFunc() {
    const webPass = new WebPass();
    webPass.crypt(this.chipher_password);
    this.configService.create(webPass, this.chipher_password).subscribe((id: number) => {
      webPass.id = id;
      webPass.decrypt(this.chipher_password);
      this.list.push(webPass);
    });
  }

  onSelect(webPass: WebPass) {
    if (this.selecteWebPass != webPass) {
      this.edit = false;
    }
    this.selecteWebPass = webPass;
  }

  onButtonEdit() {
    this.edit = !this.edit;
  }

  onButtonRemove(i: number) {
    const webPass = this.list[i];
    this.configService.delete(webPass.id, this.chipher_password).subscribe(() => {
      this.list.splice(i, 1);
    });
  }

  isSelected(webPass: WebPass): boolean {
    return (webPass === this.selecteWebPass);
  }

  onCopyToClipboard(text: string) {
    clearInterval(this.interval);
    this.copyMessage = text;
    this.interval = setInterval(() => {
      this.copyMessage = '';
      clearInterval(this.interval);
    }, 2000)
  }

  getUrl(name: string, index: number) {
    let str: string;
    const styleStrPrefix = 'spanColFixed';
    let en: boolean;
    switch (name) {
      case 'id':
        const id = this.list[index].id;
        if (id) {
          str = id.toString();
        }
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'url':
        str = this.list[index].url;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'username':
        str = this.list[index].username;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'pass':
        str = this.list[index].pass;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'registrationDate':
        str = this.list[index].registrationDate;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'expirationDate':
        str = this.list[index].expirationDate;
        en = str ? true : false;
        str = str ? str : name;
        break;
      default:
        break;
    }
    return { value: str, enabled: styleStrPrefix + (en === true ? '' : 'Disabled')};
  }


}
