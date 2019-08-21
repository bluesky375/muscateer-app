import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SubCategoryInnerPage } from "./sub-category-inner";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [SubCategoryInnerPage],
  imports: [PipesModule, IonicPageModule.forChild(SubCategoryInnerPage)]
})
export class SubCategoryInnerPageModule {}
