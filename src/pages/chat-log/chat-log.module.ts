import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatLogPage } from './chat-log';

@NgModule({
  declarations: [
    ChatLogPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatLogPage),
  ],
})
export class ChatLogPageModule {}
