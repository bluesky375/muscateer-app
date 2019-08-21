import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvatarListPage } from './avatar-list';

@NgModule({
  declarations: [
    AvatarListPage,
  ],
  imports: [
    IonicPageModule.forChild(AvatarListPage),
  ],
})
export class AvatarListPageModule {}
