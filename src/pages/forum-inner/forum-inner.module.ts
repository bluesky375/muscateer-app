import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ForumInnerPage } from "./forum-inner";
import { ComponentsModule } from "../../components/components.module";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { PipesModule } from "../../pipes/pipes.module";
import { StarRatingModule } from "ionic3-star-rating";
@NgModule({
  declarations: [ForumInnerPage],
  imports: [
    IonicPageModule.forChild(ForumInnerPage),
    ComponentsModule,
    IonicImageViewerModule,
    PipesModule,
    StarRatingModule
  ],
  entryComponents: [ForumInnerPage]
  // providers: [LaunchNavigatorOriginal]
})
export class ForumInnerPageModule {}
