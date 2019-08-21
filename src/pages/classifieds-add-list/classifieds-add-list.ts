import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { AddEventsPage } from "../add-events/add-events";
import { PostClassifiedsPage } from "../post-classifieds/post-classifieds";
import { PostForumsPage } from "../post-forums/post-forums";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { DatabasesService } from "./../../services/databases.service";
import { TabsPage } from "./../tabs/tabs";

/**
 * Generated class for the ClassifiedsAddListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ClassifiedsAddListPage" })
@Component({
  selector: "page-classifieds-add-list",
  templateUrl: "classifieds-add-list.html"
})
export class ClassifiedsAddListPage {
  constructor(
    public global_items: GlobalItemsProvider,
    public service: DatabasesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform
  ) {
    // platform.registerBackButtonAction(()=> {
    //   this.navCtrl.setRoot(TabsPage);
    // })
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ClassifiedsAddListPage");
  }

  postClassifieds() {
    this.navCtrl.push("PostClassifiedsPage");
  }
  postEvents() {
    this.navCtrl.push("AddEventsPage");
  }
  postForums() {
    this.navCtrl.push("PostForumsPage");
  }
  postJobs() {
    this.navCtrl.push("PostJobsPage");
  }
  goback() {
    //this.navCtrl.pop();
    this.navCtrl.setRoot(TabsPage);
  }
}
