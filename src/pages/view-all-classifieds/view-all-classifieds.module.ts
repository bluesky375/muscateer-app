import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ViewAllClassifiedsPage } from "./view-all-classifieds";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ViewAllClassifiedsPage],
  imports: [PipesModule, IonicPageModule.forChild(ViewAllClassifiedsPage)]
})
export class ViewAllClassifiedsPageModule {}
