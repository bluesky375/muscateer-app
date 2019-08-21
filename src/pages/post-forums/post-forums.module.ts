import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostForumsPage } from './post-forums';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    PostForumsPage,
  ],
  imports: [
    IonicPageModule.forChild(PostForumsPage),
    ComponentsModule
  ],
})
export class PostForumsPageModule {}
