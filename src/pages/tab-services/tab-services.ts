import { Component, OnInit, ViewChild } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import {
  App,
  Events,
  InfiniteScroll,
  IonicPage,
  NavController,
  NavParams,
  Content
} from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { NoItemFoundPage } from "../no-item-found/no-item-found";
import { DatabasesService } from "./../../services/databases.service";
import { StaticSettings } from "./../../services/settings.service";

/**
 * Generated class for the TabServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-tab-services",
  templateUrl: "tab-services.html"
})
export class TabServicesPage implements OnInit {
  @ViewChild(Content) content: Content;
  is_all_activated = true;
  is_store_id = 0;
  sub_category_is_active = false;
  temp_category_list: any = {};
  temp_id = 0;
  is_parent_category_item_clicked = false;
  class_style: any;
  subclass_style: any;
  categories_list: any = {};
  set_style_value: any;
  set_sub_style_value: any;
  events: any[] = [];
  scroll_anim_flag: string;
  selected_cat_id = "0";
  banner_collection = [];
  constructor(
    public db_service: DatabasesService,
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global_items: GlobalItemsProvider,
    public apiService: CommonApiService,
    public setting: StaticSettings,
    public iab: InAppBrowser,
    public my_events: Events
  ) {
    this.my_events.subscribe("user:search_in_services", () => {
      setTimeout(() => {
        this.category_sort(this.selected_cat_id);
      }, 1000);
    });
  }
  doRefresh(refresher) {
    // this.ngOnInit();
    // this.global_items.loading.dismiss();
    // if (this.sub_category_is_active == true) {
    //   this.subcategory_sort(0);
    // } else {
    //   this.get_categories(5);
    //   this.category_sort("0");
    // }
    this.ngOnInit();
    setTimeout(() => {
      console.log("Async operation has ended");
      if (this.sub_category_is_active == true) {
        this.sub_category_is_active = false;
        this.set_sub_style_value = "0";
      }
      refresher.complete();
    }, 3000);
  }
  ionViewWillEnter() {
    this.global_items.change_search_placeholder("Services");
  }
  ngOnInit() {
    this.get_banner();
    this.global_items.change_search_placeholder("Services");
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
    // this.class_style = "selected_category_item";
    // this.getUpcomingEvents();
    // this.todaysDate();
    setTimeout(() => {
      this.get_categories(5);
      this.category_sort("0");
    }, 100);
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad TabServicesPage");
  }
  category_sort(cat_id) {
    this.events["display"] = "loading";
    console.log("cat_id:" + cat_id);
    this.selected_cat_id = cat_id;
    if (cat_id == "0") {
      this.is_all_activated = true;
      this.is_store_id = 0;
      this.class_style = "selected_category_item";
      this.set_style_value = "0";
      console.log("inside if cat_id==0");
      this.events["next"] = 1;
      this.events["data"] = [];
      this.getServices("services", 0);
    } else {
      //this.showToast(cat_id);
      this.is_all_activated = false;
      this.is_store_id = cat_id;
      this.class_style = "not_selected_category_item";
      this.set_style_value = cat_id;
      this.events["next"] = 1;
      this.events["data"] = [];
      console.log("else case");
      // this.temp_id = cat_id;
      // this.getServices_byID(cat_id);
      this.getServices("services", cat_id);
      this.sub_category_is_active = true;
      this.check_and_show(cat_id);
    }
  }

  subcategory_sort(cat_id) {
    this.events["display"] = "loading";
    console.log("cat_id:" + cat_id);
    // this.selected_cat_id = cat_id;
    if (cat_id == "0") {
      this.is_all_activated = true;
      this.is_store_id = this.temp_id;
      this.subclass_style = "selected_category_item";
      this.set_sub_style_value = "0";
      console.log("inside if cat_id==0");
      this.events["next"] = 1;
      this.events["data"] = [];
      // this.getServices_byID(this.temp_id);
      this.getServices("services", this.temp_id);
    } else {
      this.is_all_activated = false;
      this.is_store_id = cat_id;
      this.subclass_style = "not_selected_category_item";
      this.set_sub_style_value = cat_id;
      this.events["next"] = 1;
      this.events["data"] = [];
      console.log("else case");
      // this.getServices_byID(cat_id);
      this.getServices("services-items", cat_id);
    }
  }
  check_and_show(id) {
    if (this.sub_category_is_active == true) {
      this.subclass_style = "selected_category_item";
      this.temp_id = id;
      this.get_subcategories(id);
    }
  }
  getServices(url, cat_id?) {
    // this.events["display"] = "loading";
    let param = {};
    if (cat_id == null || cat_id == undefined || cat_id == "" || cat_id == 0) {
      param = { page: this.events["next"] };
    } else {
      param = { page: this.events["next"], id: cat_id };
    }
    console.log("this pag>>", this.events["next"]);
    this.apiService.get(url, param).subscribe(
      res => {
        console.log("get services events ...");
        console.dir(res);
        // this.global_items.loading.dismiss();
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
          // this.global_items.loading.dismiss();
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
        this.content.resize();
      },
      err => {
        console.log("promotion event error is ", err);
        // this.global_items.loading.dismiss();
        this.events["display"] = "empty";
        // this.navCtrl.push(NoItemFoundPage);
        // this.global_items.showToast("Tap on 'heading' and pull to refresh");
      }
    );

    this.content.resize();
  }

  // getServices_byID(cat_id) {
  //   console.log("this pag>>", this.events["next"]);
  //   // this.global_items.showLoading("Please wait...");
  //   this.apiService
  //     .get("services-items", { page: this.events["next"], id: cat_id })
  //     .subscribe(
  //       res => {
  //         console.log("get upcoming events ...");
  //         console.dir(res);
  //         // this.global_items.loading.dismiss();
  //         if (res.data.data.length > 0) {
  //           this.events["data"] = this.events["data"].concat(res.data.data);
  //           this.events["next"] = res.data.current_page + 1;
  //           console.log("ispaginate doing:>>", this.events["isPaginate"]);
  //           this.events["isPaginate"] =
  //             res.data.current_page < res.data.last_page;
  //           this.events["display"] = "show";
  //           console.log("ispaginate did:>>", this.events["isPaginate"]);
  //         } else if (
  //           this.events["next"] == 1 ||
  //           this.events["next"] == 0 ||
  //           this.events["data"].length == 0
  //         ) {
  //           this.events["display"] = "empty";
  //           // this.global_items.loading.dismiss();
  //           // this.navCtrl.push(NoItemFoundPage);
  //           // this.global_items.showToast("Tap on 'heading' and pull to refresh");
  //         } else {
  //           console.log("this page ", this.events["next"], "have no values");
  //         }
  //         // if (res.data.total > 0) {
  //         //   if (this.events["data"].length > 0) {
  //         //     this.events["data"] = this.events["data"].concat(res.data.data);
  //         //   } else {
  //         //     this.events["data"] = res.data.data;
  //         //   }
  //         //   this.events["next"] = res.data.current_page + 1;
  //         //   this.events["isPaginate"] =
  //         //     res.data.current_page < res.data.last_page;
  //         //   this.events["display"] = "show";
  //         // } else {
  //         //   this.events["display"] = "empty";
  //         //   this.global_items.loading.dismiss();
  //         //   this.navCtrl.push(NoItemFoundPage);
  //         // }
  //       },
  //       err => {
  //         console.log("promotion event error is ", err);
  //         // this.global_items.loading.dismiss();
  //         this.navCtrl.push(NoItemFoundPage);
  //         this.global_items.showToast("Tap on 'heading' and pull to refresh");
  //       }
  //     );
  // }
  loadMore(infiniteScroll: InfiniteScroll) {
    console.log("infinite", infiniteScroll);
    if (this.events["isPaginate"]) {
      // this.getServices(infiniteScroll);
      if (
        this.is_all_activated == true &&
        this.sub_category_is_active == true
      ) {
        this.getServices("services", this.is_store_id);
      } else if (
        this.is_all_activated == false &&
        this.sub_category_is_active == true
      ) {
        this.getServices("services-items", this.is_store_id);
      } else if (
        this.is_all_activated == true &&
        this.sub_category_is_active == false
      ) {
        this.getServices("services");
      } else if (
        this.is_all_activated == false &&
        this.sub_category_is_active == false
      ) {
        this.getServices("services", this.is_store_id);
      }
      setTimeout(() => {
        console.log("Async operation has ended");
        infiniteScroll.complete();
        this.content.resize();
      }, 10000);
    } else {
      infiniteScroll.complete();
    }
    this.content.resize();
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
  get_categories(category_id) {
    this.apiService
      .get("subcategories", {
        category_id: category_id
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
  get_subcategories(category_id) {
    this.apiService
      .get("subcategories", {
        category_id: category_id
      })
      .subscribe(
        res => {
          console.log("getting categories...");
          if (res.status == true) {
            this.temp_category_list = res;
            console.log(this.temp_category_list["data"]);
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
  get_banner() {
    this.banner_collection = [];
    this.apiService.get("banners", { page: "services" }).subscribe(
      res => {
        if (res.status) {
          this.banner_collection = res.data;
          this.banner_collection.forEach((element, index) => {
            this.banner_collection[index].image =
              this.setting.IMAGE_URL + element.image;
          });
        }
      },
      err => {}
    );
  }
  getBack() {
    this.sub_category_is_active = false;

    this.events["display"] = "loading";
    this.set_sub_style_value = "0";
    this.get_categories(5);
    this.category_sort(0);
    // this.getServices_byID(this.temp_id);
    // this.getServices("services", this.temp_id);
  }
}
