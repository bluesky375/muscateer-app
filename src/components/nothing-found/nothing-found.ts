import { Component } from "@angular/core";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the NothingFoundComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "nothing-found",
  templateUrl: "nothing-found.html"
})
export class NothingFoundComponent {
  constructor(public global_items: GlobalItemsProvider) {
    console.log("Hello NothingFoundComponent Component");
  }
}
