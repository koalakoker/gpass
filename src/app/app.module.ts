import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { WebPassService } from './services/web-pass.service';
import { AppRoutingModule } from '../app-routing.module';
import { PassGeneratorComponent } from './pass-generator/pass-generator.component';

import { ClipboardModule } from 'ngx-clipboard'
import { StorageServiceModule } from 'ngx-webstorage-service';

@NgModule({
  declarations: [
    AppComponent,
    WebPassListComponent,
    PassGeneratorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClipboardModule,
    StorageServiceModule
  ],
  providers: [WebPassService],
  bootstrap: [AppComponent]
})
export class AppModule { }
