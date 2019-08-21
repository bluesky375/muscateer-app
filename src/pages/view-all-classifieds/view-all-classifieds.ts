import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { StaticSettings } from "../../services/settings.service";
import { UrlUtils } from "../../services/url.service";
import { WebService } from "../../services/non-api.service";
import { CommonApiService } from "../../services/common-api.service";
import { ClassifiedsService } from "../../services/classifieds.service";
import { SuperTabsController } from "ionic2-super-tabs/dist/index";
import { InnerClassifiedsPage } from "../inner-classifieds/inner-classifieds";
import { NoItemFoundPage } from "../no-item-found/no-item-found";

/**
 * Generated class for the ViewAllClassifiedsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ViewAllClassifiedsPage" })
@Component({
  selector: "page-view-all-classifieds",
  templateUrl: "view-all-classifieds.html"
})
export class ViewAllClassifiedsPage {
  banner_collection = [];
  public type;
  categories: any[];
  subcategories: any[];
  popularItems: any = {};
  imageUrl: string;
  newItems: any = {};
  recentItems: any = {};
  nearbyItems: any = {};
  loadnew: boolean;
  PageNo: number;
  head: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ClassifiedsService,
    private service: CommonApiService,
    private _nonApi: WebService,
    public urlService: UrlUtils,
    private settings: StaticSettings,
    public superTabsCtrl: SuperTabsController,
    public global_provier: GlobalItemsProvider
  ) {
    this.type = navParams.get("type");
    console.log(this.type);
    this.newItems["data"] = [];
    this.popularItems["data"] = [];
    this.nearbyItems["data"] = [];
    this.recentItems["data"] = [];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ViewAllClassifiedsPage");
  }

  ngOnInit() {
    this.categoryCheck();
    this.get_banner();
  }

  categoryCheck() {
    // if (this.type === "POPULAR") {
    //   this.head["popular"] = 1;
    //   this.popularSearches(null, 1);
    // } else if (this.type === "NEW") {
    //   this.head["newlyAdded"] = 1;
    //   this.newlyAdded(null, 1);
    // } else if (this.type === "NEARBY") {
    //   this.head["NEARBY"] = 1;
    //   this.adsNearBy(null, 1);
    // } else if (this.type === "RECENT") {
    //   this.head["RECENT"] = 1;
    //   this.recentlySearched(null, 1);
    // }

    switch (this.type) {
      case "POPULAR":
        {
          this.global_provier.showLoading("please wait");
          this.head["popular"] = 1;
          this.popularSearches(null, 1);
        }
        break;
      case "NEW":
        {
          this.global_provier.showLoading("please wait");
          this.head["newlyAdded"] = 1;
          this.newlyAdded(null, 1);
        }
        break;
      case "NEARBY":
        {
          this.global_provier.showLoading("please wait");
          this.head["NEARBY"] = 1;
          this.adsNearBy(null, 1);
        }
        break;
      case "RECENT":
        {
          this.global_provier.showLoading("please wait");
          this.head["RECENT"] = 1;
          this.recentlySearched(null, 1);
        }
        break;
      default: {
        console.log("error");
      }
    }
  }
  get_banner() {
    this.banner_collection = [];
    this.service.get("banners", { page: "home" }).subscribe(
      res => {
        if (res.status) {
          this.banner_collection = res.data;
          this.banner_collection.forEach((element, index) => {
            this.banner_collection[index].image =
              this.settings.IMAGE_URL + element.image;
          });
        }
      },
      err => {}
    );
  }
  loadInfinite(infiniteScroll, type) {
    if (this.type === "POPULAR") {
      if (this.loadnew) {
        console.log(this.PageNo);
        this.popularSearches(infiniteScroll, this.PageNo);
      } else {
        infiniteScroll.enable(false);
      }
    } else if (this.type === "NEW") {
      if (this.loadnew) {
        console.log(this.PageNo);
        this.newlyAdded(infiniteScroll, this.PageNo);
      } else {
        infiniteScroll.enable(false);
      }
    } else if (this.type === "NEARBY") {
      if (this.loadnew) {
        console.log(this.PageNo);
        this.adsNearBy(infiniteScroll, this.PageNo);
      } else {
        infiniteScroll.enable(false);
      }
    } else if (this.type === "RECENT") {
      if (this.loadnew) {
        console.log(this.PageNo);
        this.recentlySearched(infiniteScroll, this.PageNo);
      } else {
        infiniteScroll.enable(false);
      }
    }
  }

  popularSearches(infiniteScroll, pageNo?: number) {
    this.itemService
      .get("popular-search", {
        page: pageNo ? pageNo : 1
      })
      .subscribe(
        res => {
          if (Object.keys(res.data.data).length > 0) {
            this.popularItems["current"] = res.data.current_page;
            this.popularItems["last"] = res.data.last_page;
            let data: any[];
            data = res.data.data;
            this.popularItems["data"] = this.popularItems["data"].concat(data);
            this.popularItems["next"] = res.data.current_page + 1;
            if (this.popularItems["next"] <= this.popularItems["last"]) {
              this.loadnew = true;
              this.PageNo = this.popularItems["next"];
            } else {
              this.loadnew = false;
              infiniteScroll.complete();
            }
            this.popularItems["switch"] = "show";
            this.global_provier.dismissLoading();
          } else {
            this.popularItems["switch"] = "empty";
            this.popularItems["total"] = 0;
            this.global_provier.dismissLoading();
            this.navCtrl.push(NoItemFoundPage);
          }
        },
        err => {
          this.global_provier.showToast("Something went wrong");
          this.global_provier.dismissLoading();
        }
      );
  }

  newlyAdded(infiniteScroll, pageNo?: number) {
    this.itemService
      .get("newly-added", {
        page: pageNo ? pageNo : 1
      })
      .subscribe(
        res => {
          if (Object.keys(res.data.data).length > 0) {
            this.newItems["current"] = res.data.current_page;
            this.newItems["last"] = res.data.last_page;
            let data: any[];
            data = res.data.data;
            this.newItems["data"] = this.newItems["data"].concat(data);
            this.newItems["next"] = res.data.current_page + 1;
            if (this.newItems["next"] <= this.newItems["last"]) {
              this.loadnew = true;
              this.PageNo = this.newItems["next"];
            } else {
              this.loadnew = false;
              infiniteScroll.complete();
            }
            this.global_provier.dismissLoading();
          } else {
            this.global_provier.dismissLoading();
            console.log("no item found");
            this.newItems["switch"] = "empty";
            this.newItems["total"] = 0;
            this.global_provier.dismissLoading();
            this.navCtrl.push(NoItemFoundPage);
          }
        },
        err => {
          this.global_provier.showToast("Something went wrong");
          this.global_provier.dismissLoading();
        }
      );
  }

  adsNearBy(infiniteScroll, pageNo?: number) {
    this.itemService
      .get("ads-nearby", {
        page: pageNo ? pageNo : 1
      })
      .subscribe(
        res => {
          if (Object.keys(res.data.data).length > 0) {
            this.nearbyItems["current"] = res.data.current_page;
            this.nearbyItems["last"] = res.data.last_page;
            let data: any[];
            data = res.data.data;
            this.nearbyItems["data"] = this.nearbyItems["data"].concat(data);
            this.nearbyItems["next"] = res.data.current_page + 1;
            console.log(this.nearbyItems);
            if (this.nearbyItems["next"] <= this.nearbyItems["last"]) {
              this.loadnew = true;
              this.PageNo = this.nearbyItems["next"];
            } else {
              this.loadnew = false;
              infiniteScroll.complete();
            }
            this.nearbyItems["switch"] = "show";
            this.global_provier.dismissLoading();
          } else {
            this.nearbyItems["switch"] = "empty";
            this.nearbyItems["total"] = 0;
            this.global_provier.dismissLoading();
            this.navCtrl.push(NoItemFoundPage);
          }
        },
        err => {
          this.global_provier.showToast("Something went wrong");
          this.global_provier.dismissLoading();
        }
      );
  }

  recentlySearched(infiniteScroll, pageNo?: number) {
    this.itemService
      .get("recent-search", {
        page: pageNo ? pageNo : 1
      })
      .subscribe(
        res => {
          if (Object.keys(res.data.data).length > 0) {
            this.recentItems["current"] = res.data.current_page;
            this.recentItems["last"] = res.data.last_page;
            let data: any[];
            data = res.data.data;
            this.recentItems["data"] = this.recentItems["data"].concat(data);
            this.recentItems["next"] = res.data.current_page + 1;
            console.log(this.recentItems);
            if (this.recentItems["next"] <= this.recentItems["last"]) {
              this.loadnew = true;
              this.PageNo = this.recentItems["next"];
            } else {
              this.loadnew = false;
              infiniteScroll.complete();
            }
            this.global_provier.dismissLoading();
            this.recentItems["switch"] = "show";
          } else {
            this.recentItems["switch"] = "empty";
            this.recentItems["total"] = 0;
            this.global_provier.dismissLoading();
            this.navCtrl.push(NoItemFoundPage);
          }
        },
        err => {
          this.global_provier.showToast("Something went wrong");
          this.global_provier.dismissLoading();
        }
      );
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
