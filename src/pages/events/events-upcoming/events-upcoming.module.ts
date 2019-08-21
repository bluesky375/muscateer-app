import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EventsUpcomingPage } from "./events-upcoming";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [EventsUpcomingPage],
  imports: [PipesModule, IonicPageModule.forChild(EventsUpcomingPage)],
  entryComponents: [EventsUpcomingPage]
})
export class EventsUpcomingPageModule {}
