import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TabServicesPage } from "./tab-services";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [TabServicesPage],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TabServicesPage),
    ComponentsModule
  ]
})
export class TabServicesPageModule {}
