import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SuggestPopupPage } from "./suggest-popup";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [SuggestPopupPage],
  imports: [
    IonicPageModule.forChild(SuggestPopupPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class SuggestPopupPageModule {}
