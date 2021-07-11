import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { WebPass } from '../../modules/webpass'
import { WebLinkService } from '../../services/web-link.service';
import { LoginService } from '../../services/login.service';

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
  maxElement: number = 0;

  constructor(
    private webLinkService: WebLinkService,
    private loginService: LoginService) {
    this.reset();
    window.onresize = () => {
      if (this.showDropDown) {
        this.reset();
        this.textToSort = "";
      }
    }
  }

  onFocusEventAction(): void {
    this.counter = -1;
  }
  onBlurEventAction(): void {
  }

  changeSelected(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      if (this.maxElement > 2) {
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
      } else {
        this.scrollUp();
        this.textToSort = this.list[this.counter].name;
      }
    } else if (event.key === 'ArrowDown') {
      if (this.maxElement > 2) {
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
      } else {
        this.scrollDown();
        this.textToSort = this.list[this.counter].name;
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
    this.maxElement = this.getMaxElementsFitWindowHeight();
    if (this.firstElementShowed < this.retrievedList.length - 1) { 
      this.firstElementShowed += 1;
    }
    if ((this.firstElementShowed === 1) && (this.maxElement > 2)) {
      this.firstElementShowed++;
    }
    this.list = this.cutListBetweenBounds(this.retrievedList, this.firstElementShowed, this.maxElement);
  }

  scrollUp() {
    this.maxElement = this.getMaxElementsFitWindowHeight();
    if (this.firstElementShowed > 0) {
      this.firstElementShowed -= 1;
    }
    this.list = this.cutListBetweenBounds(this.retrievedList, this.firstElementShowed, this.maxElement);
  }

  cutListBetweenBounds(list: WebPass[], firstElement: number, nElement: number): WebPass[] {
    var listLenght = list.length;
    if (listLenght === 0) return list;
    if (nElement < 3) {
      var retList : WebPass[] = [];
      retList.push(list[this.firstElementShowed]);
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
      this.maxElement = this.getMaxElementsFitWindowHeight();
      list = this.cutListBetweenBounds(list, this.firstElementShowed, this.maxElement); 

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
    this.firstElementShowed = 0;
    this.maxElement = 0;
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
    this.textToSort = valueSelected;
    this.showDropDown = false;
    this.selected.emit(this.textToSort);
  }

  async getList(searchStr: string = "") {
    try {
      let list: Array<WebPass> = await this.webLinkService.getFromUserLinks();
      if (searchStr != "") {
        list = list.filter((web: WebPass) => {
          return (web.name.toLocaleLowerCase().includes(searchStr.toLocaleLowerCase()));
        });
      }
      return (list);
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
