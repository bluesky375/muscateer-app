import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Tab } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { TabJobJobAvailablePage } from "./tab-job-job-available/tab-job-job-available";
import { TabJobJobWantedPage } from "./tab-job-job-wanted/tab-job-job-wanted";

/**
 * Generated class for the TabJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-tab-jobs",
  templateUrl: "tab-jobs.html"
})
export class TabJobsPage {
  tab1Root = TabJobJobAvailablePage;
  tab2Root = TabJobJobWantedPage;
  constructor(
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}
  ionViewWillEnter() {
    this.global_items.change_search_placeholder("Jobs");
  }
  ionViewDidLoad() {
    this.global_items.change_search_placeholder("Jobs");
    console.log("ionViewDidLoad TabJobsPage");
  }
  tabselect(tab: Tab) {
    if (tab.index == 0) {
      this.global_items.tab_events_head = "jobs available";
    } else {
      this.global_items.tab_events_head = "jobs wanted";
    }
  }
}
