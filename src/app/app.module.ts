import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassEditComponent } from './web-pass-edit/web-pass-edit.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    WebPassEditComponent,
    WebPassListComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
