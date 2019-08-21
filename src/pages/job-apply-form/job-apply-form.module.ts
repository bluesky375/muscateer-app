import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobApplyFormPage } from './job-apply-form';

@NgModule({
  declarations: [
    JobApplyFormPage,
  ],
  imports: [
    IonicPageModule.forChild(JobApplyFormPage),
  ],
})
export class JobApplyFormPageModule {}
