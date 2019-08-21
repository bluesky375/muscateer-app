import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LanguageTranslatePage } from './language-translate';

@NgModule({
  declarations: [
    LanguageTranslatePage,
  ],
  imports: [
    IonicPageModule.forChild(LanguageTranslatePage),
  ],
})
export class LanguageTranslatePageModule {}
