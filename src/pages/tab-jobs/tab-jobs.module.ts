import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TabJobJobAvailablePageModule } from "./tab-job-job-available/tab-job-job-available.module";
import { TabJobJobWantedPageModule } from "./tab-job-job-wanted/tab-job-job-wanted.module";
import { TabJobsPage } from "./tab-jobs";

@NgModule({
  declarations: [TabJobsPage],
  imports: [
    IonicPageModule.forChild(TabJobsPage),
    TabJobJobAvailablePageModule,
    TabJobJobWantedPageModule
  ]
})
export class TabJobsPageModule {}
