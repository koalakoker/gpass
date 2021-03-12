import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { WebService } from './services/web.service';
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
import { UsersComponent } from './users/users.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainNavbarComponent} from './bootstrap/navbar/main-navbar';
import { BasicModalComponent } from './bootstrap/basic/basic-modal/basic-modal.component';

import { BasicDropdownComponent } from './bootstrap/basic/basic-dropdown/basic-dropdown';
import { WebPassDropdownComponent } from './bootstrap/dropdown/webpass-dropdown';
import { CategoryDropdownComponent } from './bootstrap/dropdown/category-dropdown';
import { UsersDropdownComponent } from './bootstrap/dropdown/users-dropdown';
import { AdminDropdownComponent } from './bootstrap/dropdown/admin-dropdown';
import { LevelDropdownComponent } from './bootstrap/dropdown/level-dropdown.component';

import { WebPassEditModalComponent } from './bootstrap/modal/webpass-edit-modal.component'
import { CategoryEditModalComponent } from './bootstrap/modal/category-edit-modal.component'
import { NewUserModalComponent } from './bootstrap/modal/new-user-modal.component';
import { UserEditModalComponent } from './bootstrap/modal/user-edit-modal.component';

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
    ComboBoxComponent,
    UsersComponent,
    NewUserComponent,
    MainNavbarComponent,
    BasicModalComponent,

    BasicDropdownComponent,
    WebPassDropdownComponent,
    CategoryDropdownComponent,
    UsersDropdownComponent,
    AdminDropdownComponent,
    LevelDropdownComponent,

    WebPassEditModalComponent,
    CategoryEditModalComponent,
    NewUserModalComponent,
    UserEditModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClipboardModule,
    StorageServiceModule,
    RouterModule,
    NgbModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }