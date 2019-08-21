import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TabJobJobinnerPage } from "./tab-job-jobinner";
import { PipesModule } from "../../pipes/pipes.module";
import { IonicImageViewerModule } from "ionic-img-viewer";
@NgModule({
  declarations: [TabJobJobinnerPage],
  imports: [
    IonicPageModule.forChild(TabJobJobinnerPage),
    PipesModule,
    IonicImageViewerModule
  ]
})
export class TabJobJobinnerPageModule {}
