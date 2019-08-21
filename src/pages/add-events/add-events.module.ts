import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AddEventsPage } from "./add-events";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [AddEventsPage],
  imports: [
    IonicPageModule.forChild(AddEventsPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class AddEventsPageModule {}
