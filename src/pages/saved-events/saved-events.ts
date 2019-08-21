import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { UrlUtils } from "../../services/url.service";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { EventsInnerPage } from "../events-inner/events-inner";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the SavedEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "SavedEventsPage" })
@Component({
  selector: "page-saved-events",
  templateUrl: "saved-events.html"
})
export class SavedEventsPage implements OnInit {
  savedItems: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public urlService: UrlUtils,
    public apiservice: CommonApiService,
    public settings: StaticSettings,
    public global_items: GlobalItemsProvider
  ) {
    this.savedItems["next"] = 1;
    this.savedItems["loadMore"] = false;
    this.savedItems["data"] = [];
  }

  ngOnInit() {
    this.getSavedEvents();
  }

  getSavedEvents(event?) {
    this.apiservice
      .get("events/save", { page: this.savedItems["next"] })
      .do(res => this.filterData(res))
      .subscribe(res => {
        if (event) event.complete();
      });
  }

  filterData(res) {
    this.savedItems["display"] = "loading";
    if (res.status) {
      if (res.data.total > 0) {
        if (this.savedItems["data"].length > 0) {
          this.savedItems["data"] = this.savedItems["data"].concat(
            res.data.data
          );
          console.log(this.savedItems["data"]);
        } else {
          this.savedItems["data"] = res.data.data;
        }
        this.savedItems["next"] = res.data.current_page + 1;
        this.savedItems["isPaginate"] =
          res.data.current_page < res.data.last_page;
        this.savedItems["display"] = "show";
      } else {
        this.savedItems["display"] = "empty";
      }
    } else {
      this.savedItems["display"] = "empty";
    }
  }
  loadMore(infiniteScroll) {
    if (this.savedItems["isPaginate"]) {
      this.getSavedEvents(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }
  getImagesPath(res) {
    // console.log(res);
    let path: boolean;
    if (!res) return;
    path = res.s_path ? true : false;
    if (path) {
      console.log("img path", this.settings.IMAGE_URL + res.s_path);

      return this.settings.IMAGE_URL + res.s_path;
    } else {
      console.log("img path", this.settings.ITEM_DUMMY_IMAGE);
      return this.settings.ITEM_DUMMY_IMAGE;
    }
  }
  getItemId(id) {
    this.navCtrl.push("EventsInnerPage", {
      id: id
    });
  }

  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SavedEventsPage");
  }
  moveForward(pk_i_id) {
    console.log("classifieds promotion -->", pk_i_id);
    this.navCtrl.push("EventsInnerPage", {
      id: pk_i_id
    });
  }
}
