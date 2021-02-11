import { Component, OnInit } from '@angular/core'
import { WebPass } from '../modules/webpass'
import { WebPassService } from '../services/web-pass.service';
import { SessionService } from '../services/session.service';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
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

  constructor(
    private configService: WebPassService,
    private sessionService: SessionService) {
    this.reset();
  }

  onFocusEventAction(): void {
    this.counter = -1;
  }
  onBlurEventAction(): void {
    this.showDropDown = false;
  }
  onKeyDownAction(event: KeyboardEvent): void {
    this.updateList(() => {
      this.showDropDown = true;
      if (event.keyCode === KEY_CODE.UP_ARROW) {
        this.counter = (this.counter === 0) ? this.counter : --this.counter;
        this.checkHighlight(this.counter);
        this.textToSort = this.list[this.counter].name;
      }
      if (event.keyCode === KEY_CODE.DOWN_ARROW) {
        this.counter = (this.counter === this.list.length - 1) ? this.counter : ++this.counter;
        this.checkHighlight(this.counter);
        this.textToSort = this.list[this.counter].name;
      }
    });
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
  }

  textChange(value) {
    this.dummyDataList = [];
    if (value.length > 0) {
      this.dummyDataList = this.list.filter((web: WebPass) => {
        return (web.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
      });
      if (this.dummyDataList) { this.showDropDown = true; }
    } else {
      this.reset();
    }
  }
  updateTextBox(valueSelected) {
    this.textToSort = valueSelected;
    this.showDropDown = false;
  }

  updateList(endClbk:() => void) {
    this.checklogged(() => endClbk());
    this.dummyDataList = this.list;
  }

  checklogged(endClbk: () => void) {
    const storedPass = this.sessionService.getKey('ChipherPassword');
    if ((storedPass != undefined) && (storedPass != '')) {
      this.chipher_password = storedPass;
      this.logged = true;
      this.enter(() => endClbk());
    }
    else {
      this.chipher_password = '';
      this.logged = false;
      this.list = [];
      endClbk();
    }
  }

  enter(endClbk: () => void) {
    this.getWebPassList(() => endClbk());
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
