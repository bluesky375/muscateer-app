import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { JobWantedEditPage } from "./job-wanted-edit";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [JobWantedEditPage],
  imports: [
    IonicPageModule.forChild(JobWantedEditPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class JobWantedEditPageModule {}
