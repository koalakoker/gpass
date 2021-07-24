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

  getParameterFromUrl(str: string): string | undefined {
    const param = this.route.snapshot.paramMap.get(str);
    if (param === null) return undefined;
    return param;
  }

  ngOnInit() {
    this.catID     = this.getParameterFromUrl('cat');
    this.searchStr = this.getParameterFromUrl('str');
  }
  
  async refresh(cmd: string): Promise<RefreshReturnData> {
    
    var ret: RefreshReturnData = new RefreshReturnData;
    ret.pageCode = PageCodes.webPassPage;
    
    if (cmd == InputCodes.Refresh) {
      this.catID     = this.getParameterFromUrl('cat');
      this.searchStr = this.getParameterFromUrl('str');
      if (this.loginService.checklogged())
      {
        try {
          await this.getWebPassList();
          ret.childInject = ReturnCodes.ButtonInsertWebPass;
          return(ret);
        } catch (error) {
          this.webPassList = [];
          throw(error);
        }
      } else {
        this.webPassList = [];
        throw("web-pass-list(refresh)->User not logged");
      }
    } else if (cmd == InputCodes.NewBtnPress) {
      this.onNew();
      ret.childInject = ReturnCodes.None;
      return(ret);
    } else if (cmd == InputCodes.SrcPress) {
      this.catID = '0';
      this.searchStr = this.getParameterFromUrl('str');
      if (this.loginService.checklogged())
      {
        this.getWebPassList();
        ret.childInject = ReturnCodes.None;
        return(ret);
      } else {
        this.webPassList = [];
        throw('User not logged');
      }
    } else if (cmd == InputCodes.PlusOneYearAll) {
      this.webPassList.forEach((web) => {
        web.plusOneYear();
      })
      ret.childInject = ReturnCodes.None;
      return(ret);
    } else if (cmd == InputCodes.Import) {
      this.import();
      ret.childInject = ReturnCodes.None;
    } else if (cmd == InputCodes.Export) {
      this.export();
      ret.childInject = ReturnCodes.None;
      return(ret);
    } else if (cmd == InputCodes.DeleteAll) {
      this.deleteAll();
      ret.childInject = ReturnCodes.None;
    }
  }

  afterLoad(webPassListRaw: Array<WebPass>) {
    // Select only by cat (0 = all)
    if ((this.catID !== '0') && (this.catID !== undefined)) {
      this.relWebCat = this.relWebCat.filter((x) => {
        return ((x.id_cat == this.catID) && (x.enabled == 1));
      });
      var filtWebId: string[] = [];
      this.relWebCat.forEach((rel) => {
        filtWebId.push(rel.id_web);
      });
      webPassListRaw = webPassListRaw.filter((web) => {
        return this.include(filtWebId, web._id);
      });
    } else {
      if ((this.searchStr !== '') && (this.searchStr !== undefined)) {
        webPassListRaw = webPassListRaw.filter((web) => {
          return (web.name.toLocaleLowerCase().includes(this.searchStr.toLocaleLowerCase()));
        });
      }
    }
    this.webPassList = webPassListRaw;
  }

  async getWebPassList() {    
    try {
      const webPassListRaw = _.cloneDeep(await this.webLinkService.getFromUserLinks());
      this.category = _.cloneDeep(await this.categoryService.getFromUserCategory());
      this.relWebCat = _.cloneDeep(await this.relWebCatService.getWebCatRel());
      this.afterLoad(webPassListRaw);
    } catch (error) {
      console.log(error);
      throw new Error("Back end not reachable");
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

  upload() {
    return new Promise<any>((resolve, reject) => {
      try {
        var input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.addEventListener('input', (event) => {
          console.log('file selected');
          var reader = new FileReader();
          reader.onload = () => {
            console.log("file read");
            var obj = JSON.parse(reader.result.toString());
            resolve(obj);
          };
          reader.readAsText(input.files[0]);
        });
      } catch (error) {
        reject('error selecting file');
      }
    })
  }

  async import() {
    console.log('Start import');
    let json;
    try {
      json = await this.upload();
    } catch (error) {
      console.log(error);
    }
    try {
      let itemProcessed = 0;
      await json.forEach(async webPass => {
        const newWP = new WebPass(webPass);
        await this.webLinkService.createWebPass(newWP);
        itemProcessed += 1;
        console.log(itemProcessed + ' - ' + json.length);
        if (itemProcessed == json.length) {
          this.hasChanged.emit(PageCodes.forceRefresh);
          console.log('End of import');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    console.log('Start delete');
    let itemProcessed = 0;
    this.webPassList.forEach(async webPass => {
      await this.webLinkService.deleteWebPass(webPass._id);
      itemProcessed += 1;
      console.log(itemProcessed + ' - ' + this.webPassList.length);
      if (itemProcessed == this.webPassList.length) {
        this.webPassList = [];
        this.hasChanged.emit(PageCodes.webPassPage);
        console.log('End of delete');
      }
    });
  }
}