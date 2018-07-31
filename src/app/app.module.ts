import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { ListComponent } from './list/list.component';
import { ConfigComponent } from './config/config.component';
import { ConfigService } from './config/config.service';

@NgModule({
  declarations: [
    AppComponent,
    WebPassListComponent,
    ListComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
