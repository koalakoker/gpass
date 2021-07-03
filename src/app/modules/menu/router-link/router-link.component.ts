import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from '../menuItem';
import { RouterLink } from '../routerLink';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html'
})
export class RouterLinkComponent implements OnInit {
  @Input() menuItem: MenuItem;
  routerLink:RouterLink;

  constructor() { }

  ngOnInit(): void {
    this.routerLink = this.menuItem as RouterLink;
  }

}
