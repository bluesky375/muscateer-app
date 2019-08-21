import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestPageAttractionPage } from './suggest-page-attraction';

@NgModule({
  declarations: [
    SuggestPageAttractionPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestPageAttractionPage),
    ComponentsModule
  ],
})
export class SuggestPageAttractionPageModule {}
