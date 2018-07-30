import { Component, Input } from '@angular/core';

@Component({
    selector: 'tab',
    template: `
        <div>
        <ng-content *ngIf="!template"></ng-content>
        <ng-container
            *ngIf="template"
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="{data: dataContext}"
        ></ng-container>
        </div>
  `
  })
export class TabComponent implements Component
{
    @Input() template;
    @Input() dataContext;

    item: any;
}