import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { StarRatingModule } from 'ionic3-star-rating';
import { MultipleImageUpload } from "./multiple-image/multiple-image";
import { RatingComponent } from "./rating/rating";
import { ReviewCommentsComponent } from './review-comments/review-comments';
import { ShowLoadingComponent } from './show-loading/show-loading';
import { NothingFoundComponent } from './nothing-found/nothing-found';
@NgModule({
  declarations: [MultipleImageUpload, RatingComponent,
    ReviewCommentsComponent,
    ShowLoadingComponent,
    NothingFoundComponent],
  imports: [CommonModule, IonicModule , StarRatingModule],
  exports: [MultipleImageUpload, RatingComponent,
    ReviewCommentsComponent,
    ShowLoadingComponent,
    NothingFoundComponent]
})
export class ComponentsModule {}
