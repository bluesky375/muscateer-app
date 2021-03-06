import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CategoriesServiceListingPage } from "./categories-service-listing";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [CategoriesServiceListingPage],
  imports: [
    IonicPageModule.forChild(CategoriesServiceListingPage),
    PipesModule,
    ComponentsModule
  ]
})
export class CategoriesServiceListingPageModule {}
