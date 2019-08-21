import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SuggestServicesPage } from "./suggest-services";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [SuggestServicesPage],
  imports: [
    IonicPageModule.forChild(SuggestServicesPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class SuggestServicesPageModule {}
