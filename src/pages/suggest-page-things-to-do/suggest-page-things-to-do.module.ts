import { ComponentsModule } from "./../../components/components.module";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SuggestPageThingsToDoPage } from "./suggest-page-things-to-do";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [SuggestPageThingsToDoPage],
  imports: [
    IonicPageModule.forChild(SuggestPageThingsToDoPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class SuggestPageThingsToDoPageModule {}
