import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PremiumListPage } from './premium-list';

@NgModule({
  declarations: [
    PremiumListPage,
  ],
  imports: [
    IonicPageModule.forChild(PremiumListPage),
  ],
})
export class PremiumListPageModule {}
