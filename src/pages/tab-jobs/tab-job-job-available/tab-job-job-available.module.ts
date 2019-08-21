import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PipesModule } from "../../../pipes/pipes.module";
import { TabJobJobAvailablePage } from "./tab-job-job-available";

@NgModule({
  declarations: [TabJobJobAvailablePage],
  imports: [IonicPageModule.forChild(TabJobJobAvailablePage), PipesModule],
  entryComponents: [TabJobJobAvailablePage]
})
export class TabJobJobAvailablePageModule {}
