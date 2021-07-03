import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Action } from '../action';
import { MenuItem } from '../menuItem';
import { RouterLink } from '../routerLink';

@Component({
  selector: 'app-sub-item',
  templateUrl: './sub-item.component.html'
})
export class SubItemComponent implements OnInit {
  @Input() subItem: MenuItem;
  @Output() actionEvent = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onAction() {
    this.actionEvent.emit();
  }

  actionLabel(subItem: MenuItem): string {
    const action: Action = subItem as Action;
    return action.label;
  }

  routerLink(subItem: MenuItem): string {
    const routerLink: RouterLink = subItem as RouterLink;
    return routerLink.link;
  }

  routerLinkActivatedStyle(subItem: MenuItem) {
    const routerLink: RouterLink = subItem as RouterLink;
    return routerLink.getActivatedStyle()
  }

  routerLinkLabel(subItem: MenuItem) {
    const routerLink: RouterLink = subItem as RouterLink;
    return routerLink.label
  }

}
