import { NgModule } from "@angular/core";
import { IonicPageModule, IonicModule } from "ionic-angular";
import { InnerClassifiedsPage } from "./inner-classifieds";
import { MyApp } from "../../app/app.component";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [InnerClassifiedsPage],
  imports: [
    IonicImageViewerModule,
    PipesModule,
    IonicPageModule.forChild(InnerClassifiedsPage)
    // IonicModule.forRoot(MyApp, {
    //   // Configs for your app
    //   tabsHideOnSubPages: true
    //   // ...
    // })
  ]
})
export class InnerClassifiedsPageModule {}
