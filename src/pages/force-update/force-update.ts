import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { MenuController } from "ionic-angular/components/app/menu-controller";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { Market } from "@ionic-native/market";
@IonicPage({
  name: "ForceUpdatePage"
})
@Component({
  selector: "page-force-update",
  templateUrl: "force-update.html"
})
export class ForceUpdatePage {
  public lottieConfig = {
    path: "assets/lottie_files/update.json",
    renderer: "canvas",
    autoplay: true,
    loop: true
  };
  constructor(
    public menu: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global_items: GlobalItemsProvider,
    public market: Market
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForceUpdatePage");
    this.menu.swipeEnable(false);
  }
  Go_to_market() {
    this.market.open(this.global_items.App_Package_name);
  }
}
