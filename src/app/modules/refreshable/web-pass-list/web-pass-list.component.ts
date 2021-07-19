import * as _ from 'lodash-es';
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
import { WebLinkService } from 'src/app/services/api/web-link.service';
import { LoginService } from '../../../services/api/login.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../bootstrap/modal/confirm-modal.component';
import { WebPassEditModalComponent } from '../../../bootstrap/modal/webpass-edit-modal.component';
import { Observer } from '../../observer';
import { CategoryService } from 'src/app/services/api/category.service';
import { RelWebCatService } from 'src/app/services/api/rel-web-cat.service';

@Component({
  selector: 'app-web-pass-list',
  templateUrl: './web-pass-list.component.html',
  styleUrls: ['./web-pass-list.component.css']
})
export class WebPassListComponent implements OnInit, Refreshable, Observer  {

  catID: string;
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
    private webLinkService: WebLinkService,
    private categoryService: CategoryService,
    private relWebCatService: RelWebCatService,
    private loginService: LoginService) {
      this.g = new GCrypto();
  }
  
  ngOnInit() {
    this.catID = this.route.snapshot.paramMap.get('cat');
    this.searchStr = this.route.snapshot.paramMap.get('str');
  }
  
  refresh(cmd: string): Promise<RefreshReturnData> {
    return new Promise<RefreshReturnData>(async (resolve, reject) => {
      var ret: RefreshReturnData = new RefreshReturnData;
      ret.pageCode = PageCodes.webPassPage;

      if (cmd == InputCodes.Refresh) {
        this.catID = this.route.snapshot.paramMap.get('cat');
        this.searchStr = this.route.snapshot.paramMap.get('str');
        if (this.loginService.checklogged())
        {
          try {
            await this.getWebPassList();
            ret.childInject = ReturnCodes.ButtonInsertWebPass;
            resolve(ret);
          } catch (error) {
            reject(error);
          }
        } else {
          this.webPassList = [];
          reject("web-pass-list(refresh)->User not logged");
        }
      } else if (cmd == InputCodes.NewBtnPress) {
        this.onNew();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      } else if (cmd == InputCodes.SrcPress) {
        this.catID = '0';
        this.searchStr = this.route.snapshot.paramMap.get('str');
        if (this.loginService.checklogged())
        {
          this.getWebPassList();
          ret.childInject = ReturnCodes.None;
          resolve(ret);
        } else {
          this.webPassList = [];
          reject('User not logged');
        }
      } else if (cmd == InputCodes.PlusOneYearAll) {
        this.webPassList.forEach((web) => {
          web.plusOneYear();
        })
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      } else if (cmd == InputCodes.Import) {
        this.import({});
      } else if (cmd == InputCodes.Export) {
        this.export();
        ret.childInject = ReturnCodes.None;
        resolve(ret);
      }
    })
  }

  afterLoad() {
    // Select only by cat (0 = all)
    if (this.catID != '0') {
      this.relWebCat = this.relWebCat.filter((x) => {
        return ((x.id_cat == this.catID) && (x.enabled == 1));
      });
      var filtWebId: string[] = [];
      this.relWebCat.forEach((rel) => {
        filtWebId.push(rel.id_web);
      });
      this.webPassList = this.webPassList.filter((web) => {
        return this.include(filtWebId, web._id);
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
    try {
      this.webPassList = _.cloneDeep(await this.webLinkService.getFromUserLinks());
      this.category = _.cloneDeep(await this.categoryService.getFromUserCategory());
      this.relWebCat = _.cloneDeep(await this.relWebCatService.getWebCatRel());
      this.afterLoad();
    } catch (error) {
      console.log(error);
    }
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
    console.log("Notyfy the parent webpasslist->app");
  }

  isNewPosible(): boolean {
    return (this.loginService.getUserKey() !== "");
  }

  isPlusOneYearPossible(): boolean {
    return (this.webPassList.length > 0);
  }

  async import(PassJson: any) {
    try {
      await PassJson.forEach(async webPass => {
        const newWP = new WebPass();
        newWP.name = webPass.name;
        newWP.url = webPass.url;
        newWP.username = webPass.username;
        newWP.pass = webPass.pass;
        newWP.registrationDate = webPass.registrationDate;
        newWP.expirationDate = webPass.expirationDate;
        newWP._id = await this.webLinkService.createWebPass(newWP);
        this.webPassList.unshift(newWP);
      });
      this.hasChanged.emit(PageCodes.webPassPage);
    } catch (error) {
      console.log(error);
    }
  }

  async onNew() {
    if (this.isNewPosible()) {
      const webPass = new WebPass();
      try {
        webPass._id = await this.webLinkService.createWebPass(webPass);
        this.webPassList.unshift(webPass);
        this.hasChanged.emit(PageCodes.webPassPage);
      } catch(error) {
        console.log(error);
      }
    }
  }

  onSelect(webPass: WebPass) {
    if (this.selectedWebPass != webPass) {
    }
    this.selectedWebPass = webPass;
  }

  onCloseEdit() {
    if (this.needReenter) {
      if (this.catID != '0') {
        this.getWebPassList();
      }
      this.needReenter = false;
    }
  }

  async onButtonRemove(i: number) {
    const webPass = this.webPassList[i];
    try {
      await this.webLinkService.deleteWebPass(webPass._id);
      this.webPassList.splice(i, 1);
      this.hasChanged.emit(PageCodes.webPassPage);
    } catch (error) {
      console.log(error);
    }
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
        const id = this.webPassList[index]._id;
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