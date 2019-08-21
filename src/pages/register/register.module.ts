import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { RegisterPage } from "./register";
@NgModule({
  declarations: [RegisterPage],
  imports: [Ng4GeoautocompleteModule, IonicPageModule.forChild(RegisterPage)]
})
export class RegisterPageModule {}
