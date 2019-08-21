import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PipesModule } from "../../../pipes/pipes.module";
import { TabJobJobWantedPage } from "./tab-job-job-wanted";

@NgModule({
  declarations: [TabJobJobWantedPage],
  imports: [IonicPageModule.forChild(TabJobJobWantedPage), PipesModule],
  entryComponents: [TabJobJobWantedPage]
})
export class TabJobJobWantedPageModule {}
