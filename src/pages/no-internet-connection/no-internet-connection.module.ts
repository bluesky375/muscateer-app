import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NoInternetConnectionPage } from "./no-internet-connection";
import { LottieAnimationViewModule } from "ng-lottie";
@NgModule({
  declarations: [NoInternetConnectionPage],
  imports: [
    IonicPageModule.forChild(NoInternetConnectionPage),
    LottieAnimationViewModule
  ]
})
export class NoInternetConnectionPageModule {}
