import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { NetworkManagerProvider } from "../../providers/network-manager/network-manager";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the NoInternetConnectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-no-internet-connection",
  templateUrl: "no-internet-connection.html"
})
export class NoInternetConnectionPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  constructor(
    public global_items: GlobalItemsProvider,
    public network_manager: NetworkManagerProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.lottieConfig = {
      path: "assets/lottie_files/no_connection.json",
      renderer: "canvas",
      autoplay: true,
      loop: false
    };
  }
  handleAnimation(anim: any) {
    this.anim = anim;
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad NoInternetConnectionPage");
  }
  retry() {
    if (this.network_manager.is_internet_connection_enabled()) {
      this.navCtrl.pop();
    } else {
      this.global_items.showToast("Check your mobile data or wifi");
    }
  }
}
