import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ForceUpdatePage } from "./force-update";
import { LottieAnimationViewModule } from "ng-lottie";
import { Market } from "@ionic-native/market";

@NgModule({
  declarations: [ForceUpdatePage],
  imports: [
    LottieAnimationViewModule,
    IonicPageModule.forChild(ForceUpdatePage)
  ],
  providers: [Market]
})
export class ForceUpdatePageModule {}
