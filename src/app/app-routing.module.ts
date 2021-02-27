import { DbCreateBackupTableComponent } from './db-create-backup-table/db-create-backup-table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPassListComponent } from './web-pass-list/web-pass-list.component';
import { PassGeneratorComponent } from './pass-generator/pass-generator.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { DbBackupComponent } from './db-backup/db-backup.component';
import { CategoryComponent } from './category/category.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/list/0', pathMatch: 'full' },
  { path: 'list/:cat', component: WebPassListComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'newPass', component: PassGeneratorComponent },
  { path: 'changePass', component: ChangePassComponent },
  { path: 'users', component: UsersComponent },
  { path: 'dbCreateTable', component: DbCreateBackupTableComponent },
  { path: 'dbBackup', component: DbBackupComponent },
  { path: 'search/:str', component: WebPassListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
