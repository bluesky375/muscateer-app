import { ViewController } from "ionic-angular/navigation/view-controller";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { Platform } from "ionic-angular/platform/platform";

/**
 * Generated class for the LanguageTranslatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "LanguageTranslatePage"
})
@Component({
  selector: "page-language-translate",
  templateUrl: "language-translate.html"
})
export class LanguageTranslatePage {
  direction = "ltr";
  constructor(
    public platform: Platform,
    public global_items: GlobalItemsProvider,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LanguageTranslatePage");
  }
  dismiss(direction) {
    // Returning data from the modal:
    this.direction = direction;
    console.log(this.direction);
    this.viewCtrl.dismiss({
      language_dir: this.direction
    });
  }
}
