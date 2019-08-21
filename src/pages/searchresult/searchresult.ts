import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { InnerClassifiedsPage } from "../inner-classifieds/inner-classifieds";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";

/**
 * Generated class for the SearchresultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "SearchresultPage" })
@Component({
  selector: "page-searchresult",
  templateUrl: "searchresult.html"
})
export class SearchresultPage {
  query: any;
  result: any[] = [];

  constructor(
    public navCtrl: NavController,
    public global_items: GlobalItemsProvider,
    public navParams: NavParams,
    // public apiService: WebService,
    public apiService: CommonApiService,
    public settings: StaticSettings
  ) {
    this.query = this.navParams.get("val");
    this.result["next"] = 1;
    this.result["data"] = [];
    this.result["display"] = "loading";
  }

  ionViewDidLoad() {
    this.getSearchResult();
    this.global_items.showLoading("please wait");
  }

  getSearchResult() {
    console.log("inside");
    this.apiService
      .get("item/search", {
        // .get("/api/v1/item/search", {
        qS: this.query
      })
      .do(res => this.filterData(res))
      .subscribe(
        res => {},
        err => {
          this.global_items.loading.dismiss();
        }
      );
  }

  filterData(res) {
    console.log(res);
    this.global_items.loading.dismiss();
    if (res.status) {
      if (res.data.total > 0) {
        if (this.result["data"].length > 0) {
          this.result["data"] = this.result["data"].concat(res.data.data);
        } else {
          this.result["data"] = res.data.data;
        }
        this.result["next"] = res.data.current_page + 1;
        this.result["isPaginate"] = res.data.current_page < res.data.last_page;
        this.result["display"] = "show";
      } else {
        this.result["display"] = "empty";
        this.global_items.loading.dismiss();
        // this.navCtrl.push(NoItemFoundPage);
      }
    } else {
      this.result["display"] = "empty";
      this.global_items.loading.dismiss();
      // this.navCtrl.push(NoItemFoundPage);
    }
  }
  doRefresh(refresher) {
    this.ionViewDidLoad();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  // loadMore(infiniteScroll) {
  //   if (this.result['isPaginate']){
  //     this.getSearchResult(infiniteScroll);
  //   }else{
  //     infiniteScroll.complete();
  //   }
  // }
  getImagesPath(res) {
    // console.log(res);
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

  goback() {
    this.navCtrl.pop();
  }
}
