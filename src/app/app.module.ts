import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { WebPassService } from './services/web-pass.service';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PassGeneratorComponent } from './pass-generator/pass-generator.component';

import { ClipboardModule } from 'ngx-clipboard'
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { DbCreateBackupTableComponent } from './db-create-backup-table/db-create-backup-table.component';
import { DbBackupComponent } from './db-backup/db-backup.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { CategoryComponent } from './category/category.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';

@NgModule({
  declarations: [
    AppComponent,
    WebPassListComponent,
    PassGeneratorComponent,
    ChangePassComponent,
    DbCreateBackupTableComponent,
    DbBackupComponent,
    PopupMessageComponent,
    CategoryComponent,
    ComboBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClipboardModule,
    StorageServiceModule,
    RouterModule
  ],
  providers: [WebPassService],
  bootstrap: [AppComponent]
})
export class AppModule { }