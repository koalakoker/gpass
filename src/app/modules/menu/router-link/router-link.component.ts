import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from '../menuItem';
import { RouterLink } from '../routerLink';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html'
})
export class RouterLinkComponent implements OnInit {
  @Input() menuItem: MenuItem;
  routerLink:RouterLink;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.routerLink = this.menuItem as RouterLink;
  }

  isItemVisible(menuItem: MenuItem): boolean {
    return this.checkRights(menuItem.minLevel) && menuItem.visible;
  }

  checkRights(minLevel: number) {
    return this.loginService.checkRights(minLevel);
  }

}
