import { DbCreateBackupTableComponent } from './app/db-create-backup-table/db-create-backup-table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPassListComponent } from './app/web-pass-list/web-pass-list.component';
import { PassGeneratorComponent } from './app/pass-generator/pass-generator.component';
import { ChangePassComponent } from './app/change-pass/change-pass.component';
import { DbBackupComponent } from './app/db-backup/db-backup.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: WebPassListComponent },
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
