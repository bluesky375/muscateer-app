import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Http } from "@angular/http";
import { InAppBrowser } from "@ionic-native/in-app-browser";

/**
 * Generated class for the LoadWebPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "LoadWebPage"
})
@Component({
  selector: "page-load-web",
  templateUrl: "load-web.html"
})
export class LoadWebPage {
  constructor(
    private iab: InAppBrowser,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http
  ) {}
  result: any;
  title: "";
  ionViewDidLoad() {
    console.log("ionViewDidLoad LoadWebPage");
    this.Load_webPage(this.navParams.get("url_is"));
    this.title = this.navParams.get("title_is");
    console.log(this.title);
  }
  // Load_webPage(url) {
  //   this.http.get(url).subscribe(res => {
  //     console.log(res);
  //     this.result = res["_body"];
  //   });
  // }

  Load_webPage(url) {
    if (url == "" || url == undefined || url == null) {
      url = "http://google.com";
    }
    // window.open(url, "_system", "location=yes");
    const browser = this.iab.create(url);
    // browser.executeScript(...);
    // browser.insertCSS(...);
    browser.on("loadstop").subscribe(event => {
      // browser.insertCSS({ code: "body{color: red;" });
    });

    // browser.close();

    // Inject scripts, css and more with browser.X
  }
  goback() {
    this.navCtrl.pop();
  }
}
