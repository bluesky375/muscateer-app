import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Http } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { StaticSettings } from "../../services/settings.service";

/**
 * Generated class for the PrivacyAndPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "PrivacyAndPolicyPage"
})
@Component({
  selector: "page-privacy-and-policy",
  templateUrl: "privacy-and-policy.html"
})
export class PrivacyAndPolicyPage {
  items: any[];
  constructor(
    private iab: InAppBrowser,
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public global_items: GlobalItemsProvider,
    public settings: StaticSettings
  ) {}
  privacy_and_policy_website_data;
  url_privacy_policy =
    this.settings.BASE_URL + this.endpoint() + "/privacy-policy";
  url_about = this.settings.BASE_URL + this.endpoint() + "/about";
  url_buyer_safety = this.settings.BASE_URL + this.endpoint() + "/buyer-safety";
  url_terms_of_use = this.settings.BASE_URL + this.endpoint() + "/terms-of-use";
  ionViewDidLoad() {
    console.log("ionViewDidLoad PrivacyAndPolicyPage");
    this.load_data();
  }
  goback() {
    this.navCtrl.pop();
  }
  endpoint() {
    if (this.global_items.App_direction == "rtl") {
      return "/ar";
    } else {
      return "/en";
    }
  }
  load_data() {
    this.items = [
      {
        name: this.global_items.do_translation("About"),
        icon: "ios-information-circle-outline",
        url: this.url_about,
        page_name: "LoadWebPage"
      },
      {
        name: this.global_items.do_translation("Buyer safety"),
        icon: "ios-key-outline",
        url: this.url_buyer_safety,
        page_name: "LoadWebPage"
      },
      {
        name: this.global_items.do_translation("Terms of use"),
        icon: "ios-paper-outline",
        url: this.url_terms_of_use,
        page_name: "LoadWebPage"
      },
      {
        name: this.global_items.do_translation("Privacy and policy"),
        icon: "ios-lock-outline",
        url: this.url_privacy_policy,
        page_name: "LoadWebPage"
      }
    ];
  }

  go_to_page(page_name: "", url, name) {
    console.log("clicked", page_name, url);
    // this.navCtrl.push(page_name, { url_is: url, title_is: name });
    if (url == "" || url == undefined || url == null) {
      url = "http://google.com";
    }
    // window.open(url, "_system", "location=yes");
    const browser = this.iab.create(url, "_system");
    // browser.executeScript(...);
    // browser.insertCSS(...);
    browser.on("loadstop").subscribe(event => {
      // browser.insertCSS({ code: "body{color: red;" });
    });

    // browser.close();

    // Inject scripts, css and more with browser.X
  }
}
