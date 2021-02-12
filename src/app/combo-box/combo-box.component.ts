import { Component, OnInit } from '@angular/core'
import { WebPass } from '../modules/webpass'
import { WebPassService } from '../services/web-pass.service';
import { SessionService } from '../services/session.service';

export enum KEY_CODE {
  TAB_KEY = 9
}
@Component({
  selector: 'combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {
  list: WebPass[];
  dummyDataList: WebPass[];
  showDropDown: boolean;
  counter: number;
  textToSort: string;
  chipher_password: string;
  logged = false;
  listToBeUpdated = true;

  constructor(
    private configService: WebPassService,
    private sessionService: SessionService) {
    this.reset();
  }

  onFocusEventAction(): void {
    this.counter = -1;
    console.log("Focus");
  }
  onBlurEventAction(): void {
    this.reset();
  }

  changeSelected(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.counter = (this.counter === 0) ? this.counter : --this.counter;
      if ((this.counter > -1) && (this.counter < this.dummyDataList.length)) {
        this.textToSort = this.dummyDataList[this.counter].name;
      } else {
        this.counter = -1;
      }
    } else if (event.key === 'ArrowDown') {
      this.counter = (this.counter === this.dummyDataList.length - 1) ? this.counter : ++this.counter;
      if ((this.counter > -1) && (this.counter < this.dummyDataList.length)) {
        this.textToSort = this.dummyDataList[this.counter].name;
      } else {
        this.counter = -1;
      }
    } else if (event.key === 'Escape') {
      this.reset();
    } else if (event.key === 'Enter') {
      this.reset();
    } else {
      // Other key pressed
      console.log(event.key);
    }
  }

  onKeyDownAction(event: KeyboardEvent): void {
    if (this.listToBeUpdated) {
      console.log("list to be updated");
      this.updateList(this.textToSort, () => {
         this.changeSelected(event);
         this.listToBeUpdated = false;
      });
    } else {
      console.log("list not updated");
      this.changeSelected(event);
    }
  }

  checkHighlight(currentItem: number): boolean {
    if (this.counter === currentItem) return true;
    else return false;
  }

  ngOnInit() {
    this.reset();
  }

  toogleDropDown(): void {
    this.showDropDown = !this.showDropDown;
  }

  reset(): void {
    this.showDropDown = false;
    this.listToBeUpdated = true;
  }

  textChange(value: string) {
    console.log("Text change value:" + value);
    this.updateList(value, () => {
      this.listToBeUpdated = false;
    });
  }
  
  updateTextBox(valueSelected) {
    this.textToSort = valueSelected;
    this.showDropDown = false;
  }

  updateList(searchStr: string = "", endClbk: () => void) {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
      this.getWebPassList(() => {
        this.dummyDataList = this.list;
        if (searchStr != "") {
          this.dummyDataList = this.list.filter((web: WebPass) => {
            return (web.name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()));
          });
        }
        if (this.dummyDataList) {
          this.showDropDown = true;
        }
        endClbk();
      });
    }
    else {
      this.chipher_password = '';
      this.logged = false;
      this.list = [];
    }
  }

  getWebPassList(webPassCbk: () => void) {
    // Get Webpass list
    this.configService.get("", 'gpass').subscribe((data: Array<WebPass>) => {
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
      webPassCbk();
    }, err => this.retry(err));
  }

  retry(err) {
    console.log(err);
  }
}
