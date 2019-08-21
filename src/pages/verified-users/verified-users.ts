import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { StaticSettings } from "../../services/settings.service";
import { InAppBrowser } from "@ionic-native/in-app-browser";

/**
 * Generated class for the VerifiedUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "VerifiedUsersPage"
})
@Component({
  selector: "page-verified-users",
  templateUrl: "verified-users.html"
})
export class VerifiedUsersPage {
  no_data = true;
  result = {};
  constructor(
    private iab: InAppBrowser,
    private cService: CommonApiService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global_items: GlobalItemsProvider,
    public static_service: StaticSettings
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad VerifiedUsersPage");
    this.funGetVerfied_users();
  }
  goback() {
    this.navCtrl.pop();
  }
  funGetVerfied_users() {
    this.cService.get("verified-users").subscribe(
      res => {
        console.log("verified useres res");
        console.log(res);
        this.result = res;
        if (res.status == true && res.data.length > 0) {
          this.no_data = false;
          this.result["data"].forEach((element, index) => {
            element.profile_picture =
              this.static_service.IMAGE_URL + element.profile_picture;

            if (
              element.about == "" ||
              element.about == undefined ||
              element.about == null
            ) {
            } else {
              let real_about = element.about;
              element.about = element.about.substring(0, 200) + "...";
              element["real_about"] = real_about;
              element["dotted_about"] = element.about;
              element["view_less"] = "View more";
            }
          });
          console.log(this.result);
        } else {
          this.no_data = true;
          this.global_items.showToast("Nothing found");
        }
      },
      err => {
        this.no_data = true;
        console.log("verified users res", err);
        this.global_items.showToast("Something wend wrong");
        console.log(err);
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }
  funGotto(url) {
    console.log("clicked", url);
    if (url == "" || url == undefined || url == null) {
      this.global_items.showToast("Nothing found");
    } else {
      const browser = this.iab.create(url);
      browser.on("loadstop").subscribe(event => {});
    }
  }
  public isShow(item: string) {
    if (item == null || item == undefined || item == "") {
      return false;
    } else {
      return true;
    }
  }
  Show(index, views) {
    console.log(index, views);

    if (views == "View more") {
      this.result["data"][index].view_less = "View less";
      this.result["data"][index].about = this.result["data"][index].real_about;
      console.log(this.result["data"][index].about);
    } else if (views == "View less") {
      this.result["data"][index].view_less = "View more";
      this.result["data"][index].about = this.result["data"][
        index
      ].dotted_about;
      console.log(this.result["data"][index].about);
    }
  }
}
