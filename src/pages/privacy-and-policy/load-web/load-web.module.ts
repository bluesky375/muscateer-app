import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LoadWebPage } from "./load-web";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [LoadWebPage],
  imports: [PipesModule, IonicPageModule.forChild(LoadWebPage)]
})
export class LoadWebPageModule {}
