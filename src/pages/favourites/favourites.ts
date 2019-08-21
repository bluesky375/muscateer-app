import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { UrlUtils } from "../../services/url.service";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { InnerClassifiedsPage } from "../inner-classifieds/inner-classifieds";

/**
 * Generated class for the FavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "FavouritesPage" })
@Component({
  selector: "page-favourites",
  templateUrl: "favourites.html"
})
export class FavouritesPage implements OnInit {
  favItems: any = {};
  constructor(
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public urlService: UrlUtils,
    public apiservice: CommonApiService,
    public settings: StaticSettings
  ) {
    this.favItems["next"] = 1;
    this.favItems["loadMore"] = false;
    this.favItems["data"] = [];
  }

  ngOnInit() {
    this.getFav();
  }

  getFav(event?) {
    this.apiservice
      .get("favourites/", { page: this.favItems["next"] })
      .do(res => this.filterData(res))
      .subscribe(res => {
        if (event) event.complete();
      });
  }

  filterData(res) {
    this.favItems["display"] = "loading";
    if (res.status) {
      if (res.data.total > 0) {
        if (this.favItems["data"].length > 0) {
          this.favItems["data"] = this.favItems["data"].concat(res.data.data);
          console.log(this.favItems["data"]);
        } else {
          this.favItems["data"] = res.data.data;
        }
        this.favItems["next"] = res.data.current_page + 1;
        this.favItems["isPaginate"] =
          res.data.current_page < res.data.last_page;
        this.favItems["display"] = "show";
      } else {
        this.favItems["display"] = "empty";
      }
    } else {
      this.favItems["display"] = "empty";
    }
  }

  loadMore(infiniteScroll) {
    if (this.favItems["isPaginate"]) {
      this.getFav(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }
  getImagesPath(res) {
    console.log(res);
    let path: boolean;
    if (!res) return;
    path = res.s_path ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.s_path;
    } else {
      return this.settings.ITEM_DUMMY_IMAGE;
    }
  }
  getItemId(id) {
    this.navCtrl.push("InnerClassifiedsPage", {
      id: id
    });
    console.log(id);
  }

  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FavouritesPage");
  }
}
