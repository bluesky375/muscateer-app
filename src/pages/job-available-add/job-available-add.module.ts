import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { JobAvailableAddPage } from "./job-available-add";
import { ComponentsModule } from "../../components/components.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [JobAvailableAddPage],
  imports: [
    IonicPageModule.forChild(JobAvailableAddPage),
    ComponentsModule,
    Ng4GeoautocompleteModule
  ]
})
export class JobAvailableAddPageModule {}
