import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { WebPass } from '../../webpass';
import { Category } from '../../category';
import { RelWebCat } from '../../relwebcat';

import { Refreshable, RefreshReturnData } from '../refreshable';
import * as PageCodes from '../pagesCodes'
import * as ReturnCodes from '../returnCodes';
import * as InputCodes from '../inputCodes';

import { ActivatedRoute } from '@angular/router';

import { GCrypto } from '../../gcrypto';
import { WebService } from '../../../services/web.service';
import { LoginService } from '../../../services/login.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../bootstrap/modal/confirm-modal.component';
import { WebPassEditModalComponent } from '../../../bootstrap/modal/webpass-edit-modal.component';
import { Observer } from '../../observer';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent implements OnInit, Refreshable, Observer  {

  catID: number;
  searchStr: string = "";
  webPassIndexSelected: number;
  g: GCrypto;
  webPassList: WebPass[] = [];
  category: Category[];
  relWebCat: RelWebCat[];
  selectedWebPass: WebPass;
  errorMessage: string = '';
  message: string = '';
  interval;
  needReenter: boolean = false;
  DebugTxt: string = "";
  @Output() hasChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private webService: WebService,
    private loginService: LoginService) {
      this.g = new GCrypto(this.webService);
  }
  
  ngOnInit() {
    this.catID = +this.route.snapshot.paramMap.get('cat');
    this.searchStr = this.route.snapshot.paramMap.get('str');
  }
  
  refresh(cmd: string): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>((resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.webPassPage;


      if (cmd == InputCodes.Refresh) {
        this.catID = +this.route.snapshot.paramMap.get('cat');
        this.searchStr = this.route.snapshot.paramMap.get('str');
        this.loginService.checklogged()
        .then(() => {
          this.getWebPassList()
          .then(() => {
            ret.childInject = ReturnCodes.ButtonInsertWebPass;  
            resolve(ret);
          });    
        })
        .catch((err) => {
          this.webPassList = [];
          reject("web-pass-list(refresh)->" + err);
        })
      } else if (cmd == InputCodes.NewBtnPress) {
        this.onNew();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      } else if (cmd == InputCodes.SrcPress) {
        this.catID = 0;
        this.searchStr = this.route.snapshot.paramMap.get('str');
        this.loginService.checklogged()
        .then (() => {
          this.getWebPassList();
          ret.childInject = ReturnCodes.None;
          resolve(ret);
        })
        .catch ((err) => {
          this.webPassList = [];
          reject(err);
        })
      } else if (cmd == InputCodes.PlusOneYearAll) {
        this.webPassList.forEach((web) => {
          web.plusOneYear();
        })
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      } else if (cmd == InputCodes.Export) {
        this.export();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      }
    })
  }

  afterLoad() {
    // Select only by cat (0 = all)
    if (this.catID != 0) {
      this.relWebCat = this.relWebCat.filter((x) => {
        return ((x.id_cat == this.catID) && (x.enabled == 1));
      });
      var filtWebId: number[] = [];
      this.relWebCat.forEach((rel) => {
        filtWebId.push(rel.id_web);
      });
      this.webPassList = this.webPassList.filter((web) => {
        return this.include(filtWebId, web.id);
      });
    } else {
      if (this.searchStr != null) {
        if (this.searchStr != "") {
          this.webPassList = this.webPassList.filter((web) => {
            return (web.name.toLocaleLowerCase().includes(this.searchStr.toLocaleLowerCase()));
          });
        }
      }
    }
  }

  async getWebPassList() {    
    // Get Webpass list
    await this.webService.getFromUser('gpass')
      .then((json: JSON) => {
        var data: Array<WebPass> = [];
        for (var i in json) {
          let elem: WebPass = Object.assign(new WebPass(), json[i]);
          data.push(elem);
        }
        // Decode and create a new WebPass list
        this.webPassList = data.map((x) => {
          const w = new WebPass(x);
          w.decrypt(this.loginService.userPassword);
          return w;
        }, this);
        this.webPassList.sort((a, b) => {
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
    })
    .catch((err) => {
      console.log(err);
    });
    
    // Get Category list
    await this.webService.getFromUser('category')
      .then( (json: JSON) => {
        var data: Array<Category> = [];
        for (var i in json) {
          let elem: Category = Object.assign(new Category(), json[i]);
          data.push(elem);
        }
        this.category = data;
      })
      .catch((err) => {
        console.log(err);
      });

    // Get RelWebCat
    await this.webService.get('webcatrel')
      .then((json: JSON) => {
        var data: Array <RelWebCat> = [];
        for (var i in json) {
          let elem: RelWebCat = Object.assign(new RelWebCat(), json[i]);
          data.push(elem);
        }
        this.relWebCat = data;
      })
      .catch((err) => {
        console.log(err);
      });
    
      this.afterLoad();
  }

  getUserPassword(): string {
    let userPassword: string = this.loginService.userPassword;
    return userPassword;
  }

  queryForAction(action: string): boolean {
    if (action === InputCodes.NewBtnPress) {
      return (this.isNewPosible())
    }
    if (action === InputCodes.PlusOneYearAll) {

      return (this.isPlusOneYearPossible());
    }
  }

  update(): void {
    console.log("Notyfy the parente webpasslist->app");
  }

  isNewPosible(): boolean {
    return (this.getUserPassword() !== "");
  }

  isPlusOneYearPossible(): boolean {
    return (this.webPassList.length > 0);
  }

  onNew() {
    let userPassword: string = this.getUserPassword();
    if (this.isNewPosible()) {
      const webPass = new WebPass();
      webPass.crypt(userPassword);
      webPass.userid = this.loginService.userid;
      this.webService.createWebPass(webPass)
      .then((json: JSON) => {
        webPass.id = +json;
        webPass.decrypt(userPassword);
        this.webPassList.unshift(webPass);
        this.hasChanged.emit(PageCodes.webPassPage);
      }, (err) => {
        console.log(err);
      });
    }
  }

  onSelect(webPass: WebPass) {
    if (this.selectedWebPass != webPass) {
    }
    this.selectedWebPass = webPass;
  }

  onCloseEdit() {
    if (this.needReenter) {
      if (this.catID != 0) {
        this.getWebPassList();
      }
      this.needReenter = false;
    }
  }

  onButtonRemove(i: number) {
    const webPass = this.webPassList[i];
    this.webService.delete(webPass.id, 'gpass')
      .then(() => {
      this.webPassList.splice(i, 1);
        this.hasChanged.emit(PageCodes.webPassPage);
    }, err => console.log(err));
    
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

  isExpired(i: number): string {
    let str = (this.webPassList[i].isExpired()===true) ? '<expired>' : '';
    return str;
  }

  getUrl(name: string, index: number) {
    let str: string;
    const styleStrPrefix = 'spanColFixed';
    let en: boolean;
    switch (name) {
      case 'id':
        const id = this.webPassList[index].id;
        if (id) {
          str = id.toString();
        }
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'name':
        const n = this.webPassList[index].name;
        if (n) {
          str = n.toString();
        }
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'url':
        str = this.webPassList[index].url;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'username':
        str = this.webPassList[index].username;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'pass':
        str = this.webPassList[index].pass;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'registrationDate':
        str = this.webPassList[index].registrationDate;
        en = str ? true : false;
        str = str ? str : name;
        break;
      case 'expirationDate':
        str = this.webPassList[index].expirationDate;
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

  open(i: number) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = "Warning";
    modalRef.componentInstance.message = "Are you sure to delete this?";
    modalRef.result
      .then((result) => {
        this.onButtonRemove(i);
      },()=>{});
  }

  openEditModal(i: number) {
    const modalRef = this.modalService.open(WebPassEditModalComponent);
    modalRef.componentInstance.webpass = this.webPassList[i];
    modalRef.componentInstance.category = this.category;
    modalRef.componentInstance.webpassList = this;
    modalRef.componentInstance.title = this.getUrl('name', i).value;
    modalRef.result
      .then((result) => {
        this.onCloseEdit();
      }, (reason) => {
        this.onCloseEdit();
      });
  }

  download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


  export() {
    console.log("Export");
    this.download(this.webPassList, 'json.txt', 'text/plain');
  }
}