import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassEditComponent } from './web-pass-edit/web-pass-edit.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { ListComponent } from './list/list.component';
import { WebPassElementComponent } from './web-pass-element/web-pass-element.component';
import { ElementComponent } from './element/element.component';
import { EditComponent } from './edit/edit.component';
import { TListComponent } from './tlist.component'

@NgModule({
  declarations: [
    AppComponent,
    WebPassEditComponent,
    WebPassListComponent,
    ListComponent,
    WebPassElementComponent,
    ElementComponent,
    EditComponent,
    TListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
