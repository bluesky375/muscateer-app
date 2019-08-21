import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CategoriesJobAvailableListingPage } from "./categories-job-available-listing";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [CategoriesJobAvailableListingPage],
  imports: [
    IonicPageModule.forChild(CategoriesJobAvailableListingPage),
    PipesModule
  ]
})
export class CategoriesJobAvailableListingPageModule {}
