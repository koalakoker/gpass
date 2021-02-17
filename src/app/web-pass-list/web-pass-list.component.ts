import { RelWebCat } from './../modules/relwebcat';
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

  catID: number;
  searchStr: string = "";
  webPassIndexSelected: number;
  g: GCrypto;
  list: WebPass[];
  category: Category[];
  relWebCat: RelWebCat[];
  listLoad: boolean = false;
  categoryLoad: boolean = false;
  relLoad: boolean = false;
  passRetry = false;
  selectedWebPassCatChecked: boolean[];
  selectedWebPass: WebPass;
  chipher_password: string;
  logged = false;
  errorMessage: string = '';
  message: string = '';
  interval;
  showCategory: boolean = false;
  needReenter: boolean = false;
  passwordType: string = "password";
  DebugTxt = "";

  constructor(
    private route: ActivatedRoute,
    private configService: WebPassService,
    private sessionService: SessionService
    ) {
      this.g = new GCrypto(this.configService);
    }

  ngOnInit() {
    this.catID = +this.route.snapshot.paramMap.get('cat');
    this.searchStr = this.route.snapshot.paramMap.get('str');
  }

  refresh(cmd: string = "") {
    if (cmd == "")
    {
      this.catID = +this.route.snapshot.paramMap.get('cat');
      this.searchStr = this.route.snapshot.paramMap.get('str');
      this.DebugTxt = "cat:" + this.catID + " src:" + this.searchStr;
      this.checklogged();
      return "btnInsert";
    }
    if (cmd == "btnPress") {
      this.onNewFunc();
    }
    if (cmd == "srcPress") {
      this.catID = 0;
      this.searchStr = this.route.snapshot.paramMap.get('str');
      this.checklogged();
    }
    if (cmd == "+1Yr.All") {
      this.list.forEach((web) => {
        web.plusOneYear();
      })
    }
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

  afterLoad() {
    var completed: boolean = this.listLoad && this.categoryLoad && this.relLoad;
    if (completed)
    {
      // Select only by cat (0 = all)
      if (this.catID != 0) {
        this.relWebCat = this.relWebCat.filter((x) => {
          return ((x.id_cat == this.catID) && (x.enabled == 1));
        });
        var filtWebId: number[] = [];
        this.relWebCat.forEach((rel) => {
          filtWebId.push(rel.id_web);
        });
        this.list = this.list.filter((web) => {
          return this.include(filtWebId, web.id);
        });
      } else {
        if (this.searchStr != null) {
          if (this.searchStr != "") {
            this.list = this.list.filter((web) => {
              return (web.name.toLocaleLowerCase().includes(this.searchStr.toLocaleLowerCase()));
            });
          }
        }
      }
    }
  }

  enter() {
    // catIndex = 0 no filter
    // catIndex-1 => category[]
    this.listLoad     = false;
    this.categoryLoad = false;
    this.relLoad      = false;
    this.passRetry    = false;
    this.getWebPassList(
      () => this.afterLoad(), 
      () => this.afterLoad(), 
      () => this.afterLoad());
  }

  retry(err) {
    console.log(err);
  }

  getWebPassList(
    webPassCbk: () => void,
    categoryCbk: () => void,
    relCbk: () => void) {
    // Get Webpass list
    this.configService.get("",'gpass').subscribe((data: Array<WebPass>) => {
      // Decode and create a new WebPass list
      this.list = data.map((x) => {
        const w = new WebPass(x);
        w.decrypt(this.chipher_password);
        return w;
      }, this);
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
      this.listLoad = true;
      webPassCbk();
    }, err => this.retry(err));

    // Get Category list
    this.configService.get("", 'category').subscribe( (data: Array<Category>) => {
      this.category = data;
      this.categoryLoad = true;
      categoryCbk();
    }, err => this.retry(err));

    // Get RelWebCat
    this.configService.get("", 'webcatrel').subscribe((data: Array<RelWebCat>) => {
      this.relWebCat = data;
      this.relLoad = true;
      relCbk();
    }, err => this.retry(err));
  }

  save(index: number) {
    const webPass = new WebPass(this.list[index]);
    webPass.crypt(this.chipher_password);
    this.configService.update(webPass, "").subscribe(() => {
      this.sendMessage("Database updated");
    }, err => this.retry(err));
  }

  onNewFunc() {
    const webPass = new WebPass();
    webPass.crypt(this.chipher_password);
    this.configService.create(webPass, "").subscribe(
      (id: number) => {
        webPass.id = id;
        webPass.decrypt(this.chipher_password);
        this.list.unshift(webPass);
      }, (err) => {
        this.retry(err);
      }
    );
    
  }

  onSelect(webPass: WebPass) {
    if (this.selectedWebPass != webPass) {
      this.showCategory = false;
    }
    this.selectedWebPass = webPass;
  }

  onButtonCategory(webPassIndexSelected: number)
  {
    this.showCategory = !this.showCategory;
    if (this.showCategory) {
      this.selectedWebPassCatChecked = [];
      this.webPassIndexSelected = webPassIndexSelected;
      this.configService.get("", 'webcatrel').subscribe((allRelWebCat: Array<RelWebCat>) => {
        this.category.forEach((cat) => {
          var found: boolean = false;
          allRelWebCat.forEach((rel) => {
            if ((rel.id_web == this.list[this.webPassIndexSelected].id) &&
              (rel.id_cat == cat.id) &&
              (rel.enabled == 1)) {
              found = true;
            }
          });
          this.selectedWebPassCatChecked.push(found);
        });
      }, err => this.retry(err));
    }
  }

  onCloseEdit() {
    if (this.needReenter) {
      if (this.catID != 0) {
        this.enter();
      }
      this.needReenter = false;
    }
    this.showCategory = false;
  }

  onButtonRemove(i: number) {
    const webPass = this.list[i];
    this.configService.delete(webPass.id, "").subscribe(() => {
      this.list.splice(i, 1);
    }, err => this.retry(err));
    
  }

  relExist(webPassIndex: number, catIndex: number, foundCbk: (index: number) => void, notFoundCbk: () => void) {
    var found: Boolean = false;
    this.relWebCat.forEach((rel, index) => {
      if ((rel.id_web == this.list[webPassIndex].id) &&
          (rel.id_cat == this.category[catIndex].id)) {
        found = true;
        foundCbk(index);
      }
    });
    if (!found) {
      notFoundCbk();
    }
  }

  saveRel(rel: RelWebCat) {
    this.configService.updateRelWebCat(rel, "").subscribe(() => {
      this.sendMessage("Database updated");
    }, err => this.retry(err));
  }

  newRel(rel: RelWebCat) {
    this.configService.createRelWebCat(rel, "").subscribe((id: number) => {
      rel.id = id;
      this.sendMessage("Database updated");
    }, err => this.retry(err));
  }

  onCatCheckChange(webPassIndex: number, catIndex: number)
  {
    if (this.selectedWebPassCatChecked[catIndex])
    {
      this.relExist(webPassIndex, catIndex,
        // Found Callback
        (index: number) => {
          this.relWebCat[index].enabled = 1;
          this.saveRel(this.relWebCat[index]);
        },
        // Not Found Callback
        () => {
          // Create a relation between list[webPasIndex] and category[catIndex]
          var newRel: RelWebCat = new RelWebCat();
          newRel.id_web = this.list[webPassIndex].id;
          newRel.id_cat = this.category[catIndex].id;
          newRel.enabled = 1;
          this.relWebCat.push(newRel);
          this.newRel(newRel);
      });
    }
    else {
      this.relExist(webPassIndex, catIndex, (index: number) => {
        this.relWebCat[index].enabled = 0;
        this.saveRel(this.relWebCat[index]);
      }, () => {
      });
    }
    this.needReenter = true;
  }

  isSelected(webPass: WebPass): boolean {
    return (webPass === this.selectedWebPass);
  }

  isActive(webPass: WebPass): string {
    return (this.isSelected(webPass)?"active":"");
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

  onPlusOneYear(i: number) {
    const w: WebPass = this.list[i];
    const ed: string = w.expirationDate;
    w.plusOneYear();
    if (ed !== w.expirationDate) {
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

  include(ar, el): boolean {
    var found: boolean = false;
    ar.forEach(element => {
      if (el == element) {
        found = true;
      }
    });
    return found;
  }

  showPass() {
    if (this.passwordType == "password") {
      this.passwordType = "text";
    } else {
      this.passwordType = "password";
    }
  }

}
