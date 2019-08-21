import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EventPromotionPage } from "./event-promotion";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [EventPromotionPage],
  imports: [PipesModule, IonicPageModule.forChild(EventPromotionPage)],
  entryComponents: [EventPromotionPage]
})
export class EventPromotionPageModule {}
