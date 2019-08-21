import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ChatInnerPage } from "./chat-inner";

@NgModule({
  declarations: [ChatInnerPage],
  imports: [IonicPageModule.forChild(ChatInnerPage)],
  entryComponents: [ChatInnerPage]
})
export class ChatInnerPageModule {}
