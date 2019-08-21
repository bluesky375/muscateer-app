import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NewEditEventPage } from "./new-edit-event";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [NewEditEventPage],
  imports: [IonicPageModule.forChild(NewEditEventPage), PipesModule]
})
export class NewEditEventPageModule {}
