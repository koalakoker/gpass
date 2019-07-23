import { DbCreateBackupTableComponent } from './app/db-create-backup-table/db-create-backup-table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPassListComponent } from './app/web-pass-list/web-pass-list.component';
import { PassGeneratorComponent } from './app/pass-generator/pass-generator.component';
import { ChangePassComponent } from './app/change-pass/change-pass.component';
import { DbBackupComponent } from './app/db-backup/db-backup.component';
import { CategoryComponent } from './app/category/category.component';

const routes: Routes = [
  { path: '', redirectTo: '/list/0', pathMatch: 'full' },
  { path: 'list/:cat', component: WebPassListComponent },
  { path: 'category', component: CategoryComponent},
  { path: 'newPass', component: PassGeneratorComponent},
  { path: 'changePass', component: ChangePassComponent },
  { path: 'dbCreateTable', component: DbCreateBackupTableComponent },
  { path: 'dbBackup', component: DbBackupComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
 }
