import { TabsPage } from "./../tabs/tabs";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the ForNotForPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "ForNotForPage"
})
@Component({
  selector: "page-for-not-for",
  templateUrl: "for-not-for.html"
})
export class ForNotForPage {
  public lottieConfig = {
    path: "assets/lottie_files/for_not_for_anim.json",
    renderer: "canvas",
    autoplay: true,
    loop: true
  };
  constructor(
    public global: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForNotForPage");
  }
  go() {
    this.navCtrl.setRoot(TabsPage);
  }
}
