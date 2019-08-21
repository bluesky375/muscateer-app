import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EventTodayPage } from "./event-today";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [EventTodayPage],
  imports: [PipesModule, IonicPageModule.forChild(EventTodayPage)],
  entryComponents: [EventTodayPage]
})
export class EventTodayPageModule {}
