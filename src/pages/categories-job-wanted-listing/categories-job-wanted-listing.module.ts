import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CategoriesJobWantedListingPage } from "./categories-job-wanted-listing";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [CategoriesJobWantedListingPage],
  imports: [
    IonicPageModule.forChild(CategoriesJobWantedListingPage),
    PipesModule
  ]
})
export class CategoriesJobWantedListingPageModule {}
