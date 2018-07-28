import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassComponent } from './web-pass/web-pass.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';

@NgModule({
  declarations: [
    AppComponent,
    WebPassComponent,
    WebPassListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
