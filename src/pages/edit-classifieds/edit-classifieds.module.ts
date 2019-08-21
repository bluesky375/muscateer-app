import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EditClassifiedsPage } from "./edit-classifieds";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [EditClassifiedsPage],
  imports: [
    IonicPageModule.forChild(EditClassifiedsPage),
    Ng4GeoautocompleteModule,
    ComponentsModule
  ]
})
export class EditClassifiedsPageModule {}
