import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SearchresultPage } from "./searchresult";
import { NoItemFoundPage } from "../no-item-found/no-item-found";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [SearchresultPage],
  imports: [PipesModule, IonicPageModule.forChild(SearchresultPage)]
})
export class SearchresultPageModule {}
