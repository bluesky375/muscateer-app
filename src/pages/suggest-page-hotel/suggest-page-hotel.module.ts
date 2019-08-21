import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SuggestPageHotelPage } from "./suggest-page-hotel";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [SuggestPageHotelPage],
  imports: [
    IonicPageModule.forChild(SuggestPageHotelPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class SuggestPageHotelPageModule {}
