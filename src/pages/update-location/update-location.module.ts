import { LottieAnimationViewModule } from "ng-lottie";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UpdateLocationPage } from "./update-location";
import { NativeGeocoder } from "@ionic-native/native-geocoder";
@NgModule({
  declarations: [UpdateLocationPage],
  imports: [
    IonicPageModule.forChild(UpdateLocationPage),
    Ng4GeoautocompleteModule,
    LottieAnimationViewModule
  ],
  providers: [NativeGeocoder]
})
export class UpdateLocationPageModule {}
