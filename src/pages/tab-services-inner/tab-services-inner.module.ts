import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TabServicesInnerPage } from "./tab-services-inner";
import { PipesModule } from "../../pipes/pipes.module";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { ComponentsModule } from "../../components/components.module";
import { StarRatingModule } from "ionic3-star-rating";

@NgModule({
  declarations: [TabServicesInnerPage],
  imports: [
    IonicPageModule.forChild(TabServicesInnerPage),
    PipesModule,
    IonicImageViewerModule,
    ComponentsModule,
    StarRatingModule
  ]
})
export class TabServicesInnerPageModule {}
