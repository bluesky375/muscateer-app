import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyAndPolicyPage } from './privacy-and-policy';

@NgModule({
  declarations: [
    PrivacyAndPolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyAndPolicyPage),
  ],
})
export class PrivacyAndPolicyPageModule {}
