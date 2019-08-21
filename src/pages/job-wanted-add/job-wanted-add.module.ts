import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { JobWantedAddPage } from "./job-wanted-add";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [JobWantedAddPage],
  imports: [
    IonicPageModule.forChild(JobWantedAddPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class JobWantedAddPageModule {}
