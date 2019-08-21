import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PostClassifiedsPage } from "./post-classifieds";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [PostClassifiedsPage],
  imports: [
    IonicPageModule.forChild(PostClassifiedsPage),
    Ng4GeoautocompleteModule,
    ComponentsModule
  ]
})
export class PostClassifiedsPageModule {}
