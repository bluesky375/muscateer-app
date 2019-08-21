import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  InfiniteScroll
} from "ionic-angular";
import { DatabasesService } from "../../services/databases.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { NoItemFoundPage } from "../no-item-found/no-item-found";

/**
 * Generated class for the CategoriesServiceListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "CategoriesServiceListingPage" })
@Component({
  selector: "page-categories-service-listing",
  templateUrl: "categories-service-listing.html"
})
export class CategoriesServiceListingPage implements OnInit {
  class_style: any;
  categories_list: any = {};
  set_style_value: any;
  events: any[] = [];
  scroll_anim_flag: string;
  id;
  head = "";
  constructor(
    public db_service: DatabasesService,
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global_items: GlobalItemsProvider,
    public apiService: CommonApiService,
    public setting: StaticSettings,
    public iab: InAppBrowser
  ) {}
  doRefresh(refresher) {
    this.ngOnInit();
    this.global_items.loading.dismiss();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  ionViewWillEnter() {
    this.global_items.change_search_placeholder("Services");
  }
  ngOnInit() {
    this.global_items.change_search_placeholder("Services");
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
    // this.class_style = "selected_category_item";
    // this.getUpcomingEvents();
    // this.get_categories();
    this.head = this.navParams.get("head");
    this.id = this.navParams.get("id");
    if (this.id == 0) {
      this.category_sort("0");
    } else {
      this.category_sort(this.id);
    }
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad TabServicesPage");
  }
  category_sort(cat_id) {
    console.log("cat_id:" + cat_id);
    if (cat_id == "0") {
      this.class_style = "selected_category_item";
      this.set_style_value = "0";
      console.log("inside if cat_id==0");
      this.events["next"] = 1;
      this.events["data"] = [];
      this.getServices();
    } else {
      //this.showToast(cat_id);
      this.class_style = "not_selected_category_item";
      this.set_style_value = cat_id;
      this.events["next"] = 1;
      this.events["data"] = [];
      console.log("else case");
      this.getServices_byID(cat_id);
    }
  }
  getServices(event?) {
    console.log("this pag>>", this.events["next"]);
    this.global_items.showLoading("Please wait...");
    this.apiService.get("services", { page: this.events["next"] }).subscribe(
      res => {
        console.log("get services events ...");
        console.dir(res);
        this.global_items.loading.dismiss();
        if (res.data.data.length > 0) {
          this.events["data"] = this.events["data"].concat(res.data.data);
          this.events["next"] = res.data.current_page + 1;
          console.log("ispaginate doing:>>", this.events["isPaginate"]);
          this.events["isPaginate"] =
            res.data.current_page < res.data.last_page;
          this.events["display"] = "show";
          console.log("ispaginate did:>>", this.events["isPaginate"]);
        } else if (
          this.events["next"] == 1 ||
          this.events["next"] == 0 ||
          this.events["data"].length == 0
        ) {
          this.events["display"] = "empty";
          this.global_items.loading.dismiss();
          // this.navCtrl.push(NoItemFoundPage);
          // this.global_item.showToast("Tap on 'heading' and pull to refresh");
        } else {
          console.log("this page ", this.events["next"], "have no values");
        }
        // if (res.data.total > 0) {
        //   if (this.events["data"].length > 0) {
        //     this.events["data"] = this.events["data"].concat(res.data.data);
        //   } else {
        //     this.events["data"] = res.data.data;
        //   }
        //   this.events["next"] = res.data.current_page + 1;
        //   this.events["isPaginate"] =
        //     res.data.current_page < res.data.last_page;
        //   this.events["display"] = "show";
        // } else {
        //   this.events["display"] = "empty";
        //   this.global_item.loading.dismiss();
        //   this.navCtrl.push(NoItemFoundPage);
        // }
      },
      err => {
        console.log("promotion event error is ", err);
        this.global_items.loading.dismiss();
        this.navCtrl.push(NoItemFoundPage);
        //this.global_items.showToast("Tap on 'heading' and pull to refresh");
      }
    );
  }

  getServices_byID(cat_id) {
    console.log("this pag>>", this.events["next"]);
    this.global_items.showLoading("Please wait...");
    this.apiService
      .get("services-items", { page: this.events["next"], id: cat_id })
      .subscribe(
        res => {
          console.log("get upcoming events ...");
          console.dir(res);
          this.global_items.loading.dismiss();
          if (res.data.data.length > 0) {
            this.events["data"] = this.events["data"].concat(res.data.data);
            this.events["next"] = res.data.current_page + 1;
            console.log("ispaginate doing:>>", this.events["isPaginate"]);
            this.events["isPaginate"] =
              res.data.current_page < res.data.last_page;
            this.events["display"] = "show";
            console.log("ispaginate did:>>", this.events["isPaginate"]);
          } else if (
            this.events["next"] == 1 ||
            this.events["next"] == 0 ||
            this.events["data"].length == 0
          ) {
            this.events["display"] = "empty";
            this.global_items.loading.dismiss();
            // this.navCtrl.push(NoItemFoundPage);
            // this.global_items.showToast("Tap on 'heading' and pull to refresh");
          } else {
            console.log("this page ", this.events["next"], "have no values");
          }
          // if (res.data.total > 0) {
          //   if (this.events["data"].length > 0) {
          //     this.events["data"] = this.events["data"].concat(res.data.data);
          //   } else {
          //     this.events["data"] = res.data.data;
          //   }
          //   this.events["next"] = res.data.current_page + 1;
          //   this.events["isPaginate"] =
          //     res.data.current_page < res.data.last_page;
          //   this.events["display"] = "show";
          // } else {
          //   this.events["display"] = "empty";
          //   this.global_items.loading.dismiss();
          //   this.navCtrl.push(NoItemFoundPage);
          // }
        },
        err => {
          console.log("promotion event error is ", err);
          this.global_items.loading.dismiss();
          this.navCtrl.push(NoItemFoundPage);
          // this.global_items.showToast("Tap on 'heading' and pull to refresh");
        }
      );
  }
  loadMore(infiniteScroll: InfiniteScroll) {
    if (this.events["isPaginate"]) {
      this.getServices(infiniteScroll);
      console.log("loadmore...");
      // infiniteScroll.complete();
    }
    setTimeout(() => {
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 2000);
  }
  hasRating(item) {
    try {
      let exist = item.rating.total_points ? true : false;
      if (exist) {
        return item.rating.total_points;
      } else {
        return -1;
      }
    } catch (e) {
      return -1;
    }
  }
  get_categories() {
    this.apiService
      .get("subcategories", {
        category_id: 5
      })
      .subscribe(
        res => {
          console.log("getting categories...");
          if (res.status == true) {
            this.categories_list = res;
            console.log(this.categories_list["data"]);
          }
          console.log(res);
        },
        err => {
          console.log("error getting categories");
          console.log(err);
        }
      );
  }
  getImagesPath(res) {
    // console.log(res);
    let path: boolean;
    if (!res) return;
    path = res.image ? true : false;
    if (path) {
      return this.setting.IMAGE_URL + res.image;
    } else {
      return this.setting.ITEM_DUMMY_IMAGE;
    }
  }

  updateImageUrl(event) {
    event.target.src = this.setting.ITEM_DUMMY_IMAGE;
  }
  scrollingFun(e) {
    if (e.directionY == "up") {
      if (this.scroll_anim_flag != "down") {
        let id = document.querySelector(".fab");
        // this.do_animation(id, "show");
        this.scroll_anim_flag = "down";
        console.log("once up animation done");
        document.querySelector(".fab")["style"].display = "flex";
        // document.querySelector(".fab")["style"].scale = 1;
      }
      //show
    } else if (e.directionY == "down") {
      if (this.scroll_anim_flag != "up") {
        let id = document.querySelector(".fab");
        // this.do_animation(id, "hide");
        this.scroll_anim_flag = "up";
        console.log("once down animation done");
        document.querySelector(".fab")["style"].display = "none";
        // document.querySelector(".fab")["style"].scale = 0;
      }
      //hide
    } else {
      console.log("error");
    }
  }
  Gotomap(latlong) {
    console.log(latlong);
    // this.launchNavigator.navigate([latitude, longitude]);
    if (latlong == null || latlong == undefined || latlong == "") {
      this.global_items.showToast("Something went wrong");
    } else {
      let url = "https://www.google.com/maps/search/?api=1&query=" + latlong;
      const browser = this.iab.create(url, "_system");
      browser.on("loadstop").subscribe(event => {});
    }
  }
  moveForward(id) {
    this.app.getRootNav().push("TabServicesInnerPage", { id: id });
  }
  suggest() {
    let token = this.db_service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.app.getRootNav().push("SuggestServicesPage");
    } else {
      this.global_items.showToast("Please login first");
    }
  }
  goback() {
    this.navCtrl.pop();
  }
}
