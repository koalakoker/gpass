import { Component, Input } from '@angular/core';

@Component({
    selector: 'tlist',
    template: `
    <ul>
        <li *ngFor="let item of items">
            {{ item.title }}
        </li>
    </ul>
  `
})
export class TListComponent {

    @Input()
    items: any[] = [];

}