import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { ListComponent } from './list/list.component';
import { WebPassService } from './services/web-pass.service';
import { AppRoutingModule } from '../app-routing.module';
import { PassGeneratorComponent } from './pass-generator/pass-generator.component';

import { ClipboardModule } from 'ngx-clipboard'

@NgModule({
  declarations: [
    AppComponent,
    WebPassListComponent,
    ListComponent,
    PassGeneratorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClipboardModule
  ],
  providers: [WebPassService],
  bootstrap: [AppComponent]
})
export class AppModule { }
