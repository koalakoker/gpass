import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { WebPass } from '../modules/webpass'
import { WebService } from '../services/web.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {
  @Output() selected = new EventEmitter<string>();

  list: WebPass[];
  showDropDown: boolean;
  counter: number;
  textToSort: string;
  chipher_password: string;
  logged = false;
  listToBeUpdated = true;

  constructor(
    private configService: WebService,
    private sessionService: SessionService) {
    this.reset();
  }

  onFocusEventAction(): void {
    this.counter = -1;
  }
  onBlurEventAction(): void {
  }

  changeSelected(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.counter = (this.counter === 0) ? this.counter : --this.counter;
      if ((this.counter > -1) && (this.counter < this.list.length)) {
        this.textToSort = this.list[this.counter].name;
      } else {
        this.counter = -1;
      }
    } else if (event.key === 'ArrowDown') {
      this.counter = (this.counter === this.list.length - 1) ? this.counter : ++this.counter;
      if ((this.counter > -1) && (this.counter < this.list.length)) {
        this.textToSort = this.list[this.counter].name;
      } else {
        this.counter = -1;
      }
    } else if (event.key === 'Escape') {
      this.reset();
      this.textToSort = "";
    } else if (event.key === 'Enter') {
      this.reset();
      this.selected.emit(this.textToSort);
    } else if (event.key === 'Tab') {
      this.reset();
    } 
    else {
      // Other key pressed
    }
  }

  updateList(list: WebPass[]) {
    if (list) {
      this.list = list;
      this.showDropDown = true;
      this.listToBeUpdated = false;
    } else {
      this.list = [];
      this.showDropDown = false;
      this.listToBeUpdated = true;
    }
  }

  onKeyDownAction(event: KeyboardEvent): void {
    if (this.listToBeUpdated) {
      this.getList(this.textToSort)
      .then((list: WebPass[]) => {
        this.updateList(list);
        this.changeSelected(event);
      })
      .catch((error) => {
        console.log("getList rejected with " + JSON.stringify(error));
      });
    } else {
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

  reset(): void {
    this.showDropDown = false;
    this.listToBeUpdated = true;
  }

  textChange(value: string) {
    this.getList(value)
    .then((list: WebPass[]) => {
      this.updateList(list);
    })
    .catch((error) => {
      console.log("getList rejected with " + JSON.stringify(error));
    });
  }
  
  clickOnElement(valueSelected: string) {
    console.log(valueSelected);
    this.textToSort = valueSelected;
    this.showDropDown = false;
    this.selected.emit(this.textToSort);
  }

  getList(searchStr: string = "") {
    return new Promise((resolve,reject) => {
      this.configService.get("", 'gpass')
      .then((json: JSON) => {
        var data: Array<WebPass>;
        // Decode and create a new WebPass list
        var list: WebPass[] = data.map((x) => {
          const w = new WebPass(x);
          w.decrypt(this.sessionService.getKey('ChipherPassword'));
          return w;
        });
        // Sort WebPass list
        list.sort((a, b) => {
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
        // Filter
        if (searchStr != "") {
          list = list.filter((web: WebPass) => {
            return (web.name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()));
          });
        }
        resolve(list);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}
