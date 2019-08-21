import { NoItemFoundPage } from "./../no-item-found/no-item-found";
import { EventsUpcomingPageModule } from "./events-upcoming/events-upcoming.module";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EventsPage } from "./events";
import { EventPromotionPageModule } from "./event-promotion/event-promotion.module";
import { EventTodayPageModule } from "./event-today/event-today.module";

@NgModule({
  declarations: [EventsPage],
  imports: [
    IonicPageModule.forChild(EventsPage),
    EventPromotionPageModule,
    EventsUpcomingPageModule,
    EventTodayPageModule
  ]
})
export class EventsPageModule {}
