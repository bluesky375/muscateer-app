import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SavedEventsPage } from "./saved-events";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [SavedEventsPage],
  imports: [PipesModule, IonicPageModule.forChild(SavedEventsPage)]
})
export class SavedEventsPageModule {}
