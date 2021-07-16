import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { LoginService } from 'src/app/services/api/login.service';
import { DropDown } from '../dropDown';
import { MenuItem } from '../menuItem';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html'
})
export class DropDownComponent implements OnInit {
  @ViewChild(NgbDropdownMenu) ngbDropdownMenu: NgbDropdownMenu;
  @Input() menuItem: MenuItem;
  @Input() parent: AppComponent;
  dropDown: DropDown;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.dropDown = this.menuItem as DropDown;
  }

  dropDownItemClick(item) {
    item.onClick.call(this.parent); // .call is used to pass the context
  }

  isItemVisible(menuItem: MenuItem): boolean {
    return this.checkRights(menuItem.minLevel) && menuItem.visible;
  }

  checkRights(minLevel: number) {
    return this.loginService.checkRights(minLevel);
  }

  onClick() {
    if (this.parent.lockDropDownOpen) {
      const ngbDropdown: NgbDropdown  = this.ngbDropdownMenu.dropdown;
      ngbDropdown.close();
      this.parent.lockDropDownOpen = false;
    }
  }

}
