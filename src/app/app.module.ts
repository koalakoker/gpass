import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WebPassListComponent } from './modules/refreshable/web-pass-list/web-pass-list.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { PassGeneratorComponent } from './modules/refreshable/pass-generator/pass-generator.component';

import { ClipboardModule } from 'ngx-clipboard'
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ChangePassComponent } from './modules/refreshable/change-pass/change-pass.component';
import { PopupMessageComponent } from './components/popup-message/popup-message.component';
import { CategoryComponent } from './modules/refreshable/category/category.component';
import { ComboBoxComponent } from './components/combo-box/combo-box.component';
import { UsersComponent } from './modules/refreshable/users/users.component';
import { NewUserComponent } from './modules/refreshable/new-user/new-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LevelDropdownComponent } from './bootstrap/dropdown/level-dropdown.component';

import { WebPassEditModalComponent } from './bootstrap/modal/webpass-edit-modal.component'
import { CategoryEditModalComponent } from './bootstrap/modal/category-edit-modal.component'
import { NewUserModalComponent } from './bootstrap/modal/new-user-modal.component';
import { UserEditModalComponent } from './bootstrap/modal/user-edit-modal.component';
import { MessageBoxComponent } from './bootstrap/modal/message-box.component';

import { LoginComponent } from './components/login/login.component';
import { DropDownComponent } from './modules/menu/drop-down/drop-down.component';
import { RouterLinkComponent } from './modules/menu/router-link/router-link.component';
import { SubItemComponent } from './modules/menu/sub-item/sub-item.component';
import { WaitForBackendComponent } from './modules/refreshable/wait-for-backend/wait-for-backend.component';
import { AboutModalComponent } from './bootstrap/modal/about-modal/about-modal.component';
import { QuestionModalComponent } from './bootstrap/modal/question-modal/question-modal.component';
import { ProgressBarComponent } from './bootstrap/progress-bar/progress-bar.component';
import { PasswordModalComponent } from './bootstrap/modal/password-modal/password-modal.component';
import { NotesComponent } from './modules/refreshable/notes/notes.component';
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
    SubItemComponent,
    MessageBoxComponent,
    WaitForBackendComponent,
    AboutModalComponent,
    QuestionModalComponent,
    ProgressBarComponent,
    PasswordModalComponent,
    NotesComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }