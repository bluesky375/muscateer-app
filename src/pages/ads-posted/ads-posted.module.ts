import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdsPostedPage } from './ads-posted';

@NgModule({
  declarations: [
    AdsPostedPage,
  ],

  imports: [
    IonicPageModule.forChild(AdsPostedPage),
    PipesModule
  ],
  entryComponents:[
  
  ]
})
export class AdsPostedPageModule {}
