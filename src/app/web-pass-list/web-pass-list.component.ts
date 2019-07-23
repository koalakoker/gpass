import { Component, OnInit } from '@angular/core';
import { WebPass } from '../modules/webpass';
import { WebPassService } from '../services/web-pass.service';
import { SessionService } from '../services/session.service';
import { GCrypto } from '../modules/gcrypto';
import { Refreshable } from '../modules/refreshable';
import { Category } from '../modules/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent implements OnInit, Refreshable {

  cat: number;
  g: GCrypto;
  list: WebPass[];
  category: Category[];
  selecteWebPass: WebPass;
  edit: boolean = false;
  chipher_password: string;
  logged = false;
  errorMessage: string = '';
  message: string = '';
  interval;
  
  constructor(
    private route: ActivatedRoute,
    private configService: WebPassService,
    private sessionService: SessionService
    ) {
      this.g = new GCrypto(this.configService);
    }

  ngOnInit() {
    this.checklogged();
  }

  refresh() {
    this.checklogged();
  }

  checklogged() {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
      this.enter();
    }
    else {
      this.chipher_password = '';
      this.logged = false;
      this.list = [];
    }
  }

  enter() {
    this.cat = +this.route.snapshot.paramMap.get('cat');
    this.getWebPassList(this.cat);
  }

  getWebPassList(cat: number) {
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.get(encrypted,'gpass').subscribe(
        (data: Array<WebPass>) => {
          // Decode and create a new WebPass list
          this.list = data.map((x) => {
            const w = new WebPass(x);
            w.decrypt(this.chipher_password);
            return w;
          }, this);
          // Select only by cat (0 = all)
          if (cat != 0)
          {
            this.list = this.list.filter((x) => {
              return (x.category_id == cat);
            })
          }
          this.list.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            } else {
              if (a.name > b.name) {
                return 1;
              } else {
                return 0;
              }
            }
          });
        },
        err => {
          this.errorMessage = 'Server error';
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            this.errorMessage = '';
            clearInterval(this.interval);
          }, 2000);
        }
      );
      this.configService.get(encrypted, 'category').subscribe( (data: Array<Category>) => {
        this.category = data;
      });
    });
  }

  save(index: number) {
    const webPass = new WebPass(this.list[index]);
    webPass.crypt(this.chipher_password);
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.update(webPass, encrypted).subscribe(() => {
        this.sendMessage("Database updated");
      });
    });
  }

  onNewFunc() {
    const webPass = new WebPass();
    webPass.crypt(this.chipher_password);
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.create(webPass, encrypted).subscribe((id: number) => {
        webPass.id = id;
        webPass.decrypt(this.chipher_password);
        this.list.push(webPass);
      },
      err => {
        console.log(err);
      });
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
    this.g.cryptPass(this.chipher_password, (encrypted) => {
      this.configService.delete(webPass.id, encrypted).subscribe(() => {
        this.list.splice(i, 1);
      });
    });
  }

  isSelected(webPass: WebPass): boolean {
    return (webPass === this.selecteWebPass);
  }

  sendMessage(text: string) {
    clearInterval(this.interval);
    this.message = text;
    this.interval = setInterval(() => {
      this.message = '';
      clearInterval(this.interval);
    }, 2000);
  }

  onTodayButton(i: number) {
    const w: WebPass = this.list[i];
    const rd: string = w.registrationDate;
    const ed: string = w.expirationDate;
    w.setToday();
    if ((rd!==w.registrationDate)||(ed!==w.expirationDate)) {
      this.save(i);
    }
  }

  isExpired(i: number): string {
    let str = (this.list[i].isExpired()===true) ? '<expired>' : '';
    return str;
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
      case 'name':
        const n = this.list[index].name;
        if (n) {
          str = n.toString();
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
