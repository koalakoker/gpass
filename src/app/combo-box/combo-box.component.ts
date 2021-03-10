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
  retrievedList: WebPass[];
  showDropDown: boolean;
  counter: number;
  textToSort: string;
  chipher_password: string;
  logged = false;
  listToBeUpdated = true;
  firstElementShowed: number = 0;

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
        if (this.list[this.counter].name === '...') {
          this.scrollUp();
          this.counter++;
        }
        this.textToSort = this.list[this.counter].name;
      } else {
        this.counter = -1;
      }
    } else if (event.key === 'ArrowDown') {
      this.counter = (this.counter === this.list.length - 1) ? this.counter : ++this.counter;
      if ((this.counter > -1) && (this.counter < this.list.length)) {
        if (this.list[this.counter].name === '...') {
          this.scrollDown();
          this.counter--;
        }
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

  getMaxElementsFitWindowHeight(): number {
    var windowHeight = window.innerHeight;
    var margin = 5;
    var elementSize = 49;
    var maxElements = (windowHeight - margin) / elementSize;
    maxElements = Math.floor(maxElements);
    return maxElements;
  }

  scrollDown() {
    var max = this.getMaxElementsFitWindowHeight();
    this.firstElementShowed += 1;
    if (this.firstElementShowed === 1) {
      this.firstElementShowed++;
    }
    this.list = this.cutListBetweenBounds(this.retrievedList, this.firstElementShowed, max);
  }

  scrollUp() {
    var max = this.getMaxElementsFitWindowHeight();
    this.firstElementShowed -= 1;
    this.list = this.cutListBetweenBounds(this.retrievedList, this.firstElementShowed, max);
  }

  cutListBetweenBounds(list: WebPass[], firstElement: number, nElement: number): WebPass[] {
    var listLenght = list.length;
    if (listLenght === 0) return list;
    if (nElement < 3) {
      var retList : WebPass[] = [];
      return retList;
    }

    var addHead: boolean = false;
    var addTail: boolean = false;

    var lastElement = firstElement + nElement;
    if (firstElement > 0) {
      lastElement -= 1;
      addHead = true;
    }
    if (lastElement < listLenght) {
      lastElement -= 1;
      addTail = true; 
    }

    list = list.slice(firstElement, lastElement);
    
    var element = new WebPass();
    element.name = "...";

    if (addTail) {
      list.push(element);
    }

    if (addHead) {
      list.unshift(element);
    }
    return list;
  }

  updateList(list: WebPass[]) {
    if (list) {

      // Manage here the length of the list to stay in the view
      var max = this.getMaxElementsFitWindowHeight();
      console.log(max);
      list = this.cutListBetweenBounds(list, this.firstElementShowed, max); 

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
        this.retrievedList = list;
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
      this.retrievedList = list;
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
      this.configService.getFromUser('gpass')
      .then((json: JSON) => {
        var data: Array<WebPass> = [];
        for (var i in json) {
          let elem: WebPass = Object.assign(new WebPass(), json[i]);
          data.push(elem);
        }
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
