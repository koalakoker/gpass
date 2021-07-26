import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPassListComponent } from './modules/refreshable/web-pass-list/web-pass-list.component';
import { PassGeneratorComponent } from './modules/refreshable/pass-generator/pass-generator.component';
import { ChangePassComponent } from './modules/refreshable/change-pass/change-pass.component';
import { CategoryComponent } from './modules/refreshable/category/category.component';
import { UsersComponent } from './modules/refreshable/users/users.component';
import { NewUserComponent } from './modules/refreshable/new-user/new-user.component'
import { WaitForBackendComponent } from './modules/refreshable/wait-for-backend/wait-for-backend.component';
import { NotesComponent } from './modules/refreshable/notes/notes.component';

const routes: Routes = [
  { path: '', redirectTo: '/list/0', pathMatch: 'full' },
  { path: 'list/:cat', component: WebPassListComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'newPass', component: PassGeneratorComponent },
  { path: 'changePass', component: ChangePassComponent },
  { path: 'users', component: UsersComponent },
  { path: 'search/:str', component: WebPassListComponent},
  { path: 'newuser/:username/:userhash/:masterpassword', component: NewUserComponent},
  { path: 'waitForBackend', component: WaitForBackendComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
