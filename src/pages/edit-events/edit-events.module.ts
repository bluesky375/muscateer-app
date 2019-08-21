import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditEventsPage } from './edit-events';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EditEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EditEventsPage),
    ComponentsModule
  ],
})
export class EditEventsPageModule {}
