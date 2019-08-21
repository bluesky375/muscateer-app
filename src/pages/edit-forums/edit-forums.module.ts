import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditForumsPage } from './edit-forums';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EditForumsPage,
  ],
  imports: [
    IonicPageModule.forChild(EditForumsPage),
    ComponentsModule
  ],
})
export class EditForumsPageModule {}
