import { NgModule } from "@angular/core";
import { Calendar } from "@ionic-native/calendar";
import { IonicPageModule } from "ionic-angular";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { EventsInnerPage } from "./events-inner";
import { PipesModule } from "../../pipes/pipes.module";
@NgModule({
  declarations: [EventsInnerPage],
  imports: [
    PipesModule,
    IonicPageModule.forChild(EventsInnerPage),
    IonicImageViewerModule
  ],
  // providers: [LaunchNavigatorOriginal, Calendar]
  providers: [Calendar]
})
export class EventsInnerPageModule {}
