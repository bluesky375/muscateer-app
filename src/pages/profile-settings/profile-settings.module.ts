import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProfileSettingsPage } from "./profile-settings";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

@NgModule({
  declarations: [ProfileSettingsPage],
  imports: [
    IonicPageModule.forChild(ProfileSettingsPage),
    Ng4GeoautocompleteModule
  ]
})
export class ProfileSettingsPageModule {}
