import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ForNotForPage } from "./for-not-for";
import { LottieAnimationViewModule } from "ng-lottie";

@NgModule({
  declarations: [ForNotForPage],
  imports: [IonicPageModule.forChild(ForNotForPage), LottieAnimationViewModule]
})
export class ForNotForPageModule {}
