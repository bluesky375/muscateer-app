import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PipesModule } from "../../pipes/pipes.module";
import { ClassifiedShowAllPrmotionsPage } from "./classified-show-all-prmotions";

@NgModule({
  declarations: [ClassifiedShowAllPrmotionsPage],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ClassifiedShowAllPrmotionsPage)
  ]
})
export class ClassifiedShowAllPrmotionsPageModule {}
