import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";

/**
 * Generated class for the PremiumListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "PremiumListPage"
})
@Component({
  selector: "page-premium-list",
  templateUrl: "premium-list.html"
})
export class PremiumListPage {
  data: any;
  constructor(
    public apiservice: CommonApiService,
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.data = this.navParams.get("data");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PremiumListPage");
  }

  goback() {
    this.navCtrl.pop();
  }
  buy(premiumId) {
    let payload = {
      item_id: this.data.item,
      premium_id: premiumId
    };
    this.apiservice.postData(payload, "item/premium-request").subscribe(
      res => {
        if (res) {
          this.global_items.showAlert("Done", "Success", "success").then(() => {
            this.navCtrl.pop();
          });
        } else {
          this.global_items.showToast("Something went wrong");
        }
      },
      err => {
        this.global_items.showToast("Something went wrong");
      }
    );
  }
}
