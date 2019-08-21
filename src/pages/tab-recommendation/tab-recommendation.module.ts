import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TabRecommendationPage } from "./tab-recommendation";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [TabRecommendationPage],
  imports: [
    IonicPageModule.forChild(TabRecommendationPage),
    ComponentsModule,
    PipesModule
  ]
})
export class TabRecommendationPageModule {}
