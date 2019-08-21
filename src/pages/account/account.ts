import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { ProfileSettingsPage } from "../profile-settings/profile-settings";
import { AdsPostedPage } from "../ads-posted/ads-posted";
import { FavouritesPage } from "../favourites/favourites";
import { SavedEventsPage } from "../saved-events/saved-events";

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "AccountPage" })
@Component({
  selector: "page-account",
  templateUrl: "account.html"
})
export class AccountPage implements OnInit {
  public favCount: any = {};
  public itemCount: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    public global_items: GlobalItemsProvider
  ) {}

  ngOnInit() {
    this.accountCount();
  }

  accountCount() {
    this.favCount = 0;
    this.itemCount = 0;
    this.apiService.get("user/ac-count").subscribe(res => {
      if (res) {
        console.log("user/ac");

        console.log(res);

        this.favCount = res.data.favCount;
        this.itemCount = res.data.itemCount;
      }
    });
  }

  moveToSettings() {
    this.navCtrl.push("ProfileSettingsPage");
  }

  adsPosted() {
    this.navCtrl.push("AdsPostedPage");
  }

  favourites() {
    this.navCtrl.push("FavouritesPage");
  }

  moveToSavedEvents() {
    this.navCtrl.push("SavedEventsPage");
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AccountPage");
  }
}
