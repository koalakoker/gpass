import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { WebPass } from '../../modules/webpass'
import { WebLinkService } from '../../services/api/web-link.service';
import { ResizeService as SizeService } from 'src/app/services/resize.service';
import { ScreenSize } from '../size-detector/screen-size.enum';
import { reject } from 'lodash';
@Component({
  selector: 'combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit {
  @Output() selected = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('myList') myList: ElementRef;
  myListTopPosition: number = 0;

  list: WebPass[];
  retrievedList: WebPass[];
  showDropDown: boolean;
  counter: number;
  textToSort: string = '';
  chipher_password: string;
  logged = false;
  listToBeUpdated = true;
  firstElementShowed: number = 0;
  maxElement: number = 0;
  screenSize: ScreenSize;

  constructor(
    private webLinkService: WebLinkService,
    private sizeService: SizeService) {
    this.reset();
    window.onresize = () => {
      if (this.showDropDown) {
        this.reset();
        this.textToSort = "";
      }
    }
    this.sizeService.onResize$.subscribe((size) => {
      this.screenSize = size;
    });
  }

  setFocus(): void {
    this.searchInput.nativeElement.focus();
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
      this.clearInput();
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
    const windowHeight = window.innerHeight;
    const margin = 5 + this.myListTopPosition;
    const elementSize = 49;
    let maxElements = (windowHeight - margin) / elementSize;
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

  updateMyListStyle(resolve: any, reject: any, fails: number) {
    if (this.myList !== undefined) {
      switch (this.screenSize) {
        case ScreenSize.XL:
            this.myList.nativeElement.className = 'myList_xl';
            this.myListTopPosition = 48;
          break;
        case ScreenSize.LG:
        case ScreenSize.MD:
        case ScreenSize.XS:
        case ScreenSize.SM:
            this.myList.nativeElement.className = 'myList_sm';
            this.myListTopPosition = 0;
          break;
      
        default:
          break;
      }
      console.log("Done after " + fails + " trials");
      resolve();
    } else {
      fails += 1;
      if (fails < 10) {
        setTimeout(() => {
          this.updateMyListStyle(resolve, reject, fails);
        }, 1);
      } else {
        reject('myList not created');
      }
    }
  }

  updateMyListElement(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      setTimeout(() => {
        this.updateMyListStyle(resolve, reject, 0);
      }, 1);

    })
  }

  async updateList(list: WebPass[]) {
    if (list) {
      this.showDropDown = true; // This start to create the myList element but is not ready now
      try {
        await this.updateMyListElement();
        
        // Manage here the length of the list to stay in the view
        this.maxElement = this.getMaxElementsFitWindowHeight(); // Here the myListTopPosition must be updated
        list = this.cutListBetweenBounds(list, this.firstElementShowed, this.maxElement); 
  
        this.list = list;
        this.listToBeUpdated = false;
        
      } catch (error) {
        console.log(error);
      }
    } else {
      this.list = [];
      this.showDropDown = false;
      this.listToBeUpdated = true;
    }
  }

  async onKeyDownAction(event: KeyboardEvent): Promise<void> {
    if (this.listToBeUpdated) {
      try {
        const list:Array<WebPass> = await this.getList(this.textToSort);
        this.retrievedList = list;
        this.updateList(list);
        this.changeSelected(event);
      } catch (error) {
        console.log(error); 
      }
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

  clearInput(): void {
    this.reset();
    this.textToSort = "";
  }

  reset(): void {
    this.showDropDown = false;
    this.listToBeUpdated = true;
    this.firstElementShowed = 0;
    this.maxElement = 0;
  }

  async textChange(value: string) {
    try {
      this.retrievedList = await this.getList(value);
      this.updateList(this.retrievedList);
    } catch (error) {
      console.log(error);
    }
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
