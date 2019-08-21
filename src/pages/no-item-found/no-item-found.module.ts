import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NoItemFoundPage } from "./no-item-found";

@NgModule({
  // declarations: [NoItemFoundPage],
  imports: [IonicPageModule.forChild(NoItemFoundPage)],
  entryComponents: [NoItemFoundPage]
})
export class NoItemFoundPageModule {}
