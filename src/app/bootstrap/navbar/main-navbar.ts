import { Component } from '@angular/core';

@Component({
  selector: 'main-navbar',
  templateUrl: './main-navbar.html'
})
export class MainNavbarComponent {
  
  collapsed = true;
  activeId = 2;

  isLoggedState(): boolean {
    return true;
  }

  onSearch(): void {
    console.log("onSearch() to be implemented");
  }

}