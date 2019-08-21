import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobAvailableEditPage } from './job-available-edit';
import { ComponentsModule } from '../../components/components.module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  declarations: [
    JobAvailableEditPage,
  ],
  imports: [
    IonicPageModule.forChild(JobAvailableEditPage),    ComponentsModule,
    Ng4GeoautocompleteModule
  ],
})
export class JobAvailableEditPageModule {}
