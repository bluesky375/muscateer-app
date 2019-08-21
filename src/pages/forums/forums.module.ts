import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ForumsPage } from "./forums";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ForumsPage],
  imports: [IonicPageModule.forChild(ForumsPage), ComponentsModule, PipesModule]
})
export class ForumsPageModule {}
