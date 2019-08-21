import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifiedUsersPage } from './verified-users';

@NgModule({
  declarations: [
    VerifiedUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifiedUsersPage),
  ],
})
export class VerifiedUsersPageModule {}
