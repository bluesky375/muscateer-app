import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PostJobsPage } from "./post-jobs";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [PostJobsPage],
  imports: [
    IonicPageModule.forChild(PostJobsPage),
    Ng4GeoautocompleteModule,
    ComponentsModule
  ],
  entryComponents: [PostJobsPage]
})
export class PostJobsPageModule {}
