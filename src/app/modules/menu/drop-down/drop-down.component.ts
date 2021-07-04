import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { LoginService } from 'src/app/services/login.service';
import { DropDown } from '../dropDown';
import { MenuItem } from '../menuItem';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html'
})
export class DropDownComponent implements OnInit {
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

}