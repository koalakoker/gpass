import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './modules/refreshable/web-pass-list/web-pass-list.component';
import { WebService } from './services/web.service';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PassGeneratorComponent } from './modules/refreshable/pass-generator/pass-generator.component';

import { ClipboardModule } from 'ngx-clipboard'
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ChangePassComponent } from './modules/refreshable/change-pass/change-pass.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { CategoryComponent } from './modules/refreshable/category/category.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { UsersComponent } from './modules/refreshable/users/users.component';
import { NewUserComponent } from './modules/refreshable/new-user/new-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LevelDropdownComponent } from './bootstrap/dropdown/level-dropdown.component';

import { WebPassEditModalComponent } from './bootstrap/modal/webpass-edit-modal.component'
import { CategoryEditModalComponent } from './bootstrap/modal/category-edit-modal.component'
import { NewUserModalComponent } from './bootstrap/modal/new-user-modal.component';
import { UserEditModalComponent } from './bootstrap/modal/user-edit-modal.component';
import { LoginComponent } from './login/login.component';
import { DropDownComponent } from './modules/menu/drop-down/drop-down.component';
import { RouterLinkComponent } from './modules/menu/router-link/router-link.component';
import { SubItemComponent } from './modules/menu/sub-item/sub-item.component';
@NgModule({
  declarations: [
    AppComponent,
    WebPassListComponent,
    PassGeneratorComponent,
    ChangePassComponent,
    PopupMessageComponent,
    CategoryComponent,
    ComboBoxComponent,
    UsersComponent,
    NewUserComponent,

    LevelDropdownComponent,

    WebPassEditModalComponent,
    CategoryEditModalComponent,
    NewUserModalComponent,
    UserEditModalComponent,
    LoginComponent,
    DropDownComponent,
    RouterLinkComponent,
    SubItemComponent
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