import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-element',
  template: `
    <div>
    <ng-content *ngIf="!template"></ng-content>
    <ng-container
        *ngIf="template"
        [ngTemplateOutlet]="template"
        [ngTemplateOutletContext]="{data: dataContext}"
    ></ng-container>
    </div>
  `,
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {

  @Input() template;
  @Input() dataContext;

  constructor() { }

  ngOnInit() {
  }

}
