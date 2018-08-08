import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPassListComponent } from './app/web-pass-list/web-pass-list.component';
import { PassGeneratorComponent } from './app/pass-generator/pass-generator.component';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'list', component: WebPassListComponent },
  { path: 'newPass', component: PassGeneratorComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
 }
