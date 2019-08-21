import { PipesModule } from "./../../pipes/pipes.module";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TouristViewALlPage } from "./tourist-view-a-ll";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [TouristViewALlPage],
  imports: [
    IonicPageModule.forChild(TouristViewALlPage),
    ComponentsModule,
    PipesModule
  ]
})
export class TouristViewALlPageModule {}
