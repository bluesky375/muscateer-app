import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ClassifiedsPage } from "./classifieds";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ClassifiedsPage],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ClassifiedsPage),
    ComponentsModule
  ]
})
export class ClassifiedsPageModule {}
