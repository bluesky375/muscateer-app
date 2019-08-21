import { DatabasesService } from "./../../../services/databases.service";
import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  InfiniteScroll,
  Events
} from "ionic-angular";
import { GlobalItemsProvider } from "../../../providers/global-items/global-items";
import { CommonApiService } from "../../../services/common-api.service";
import { StaticSettings } from "../../../services/settings.service";

/**
 * Generated class for the TabJobJobWantedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-tab-job-job-wanted",
  templateUrl: "tab-job-job-wanted.html"
})
export class TabJobJobWantedPage implements OnInit {
  banner_collection = [];
  categories_list: any = {};
  class_style: any;
  set_style_value: any;
  wanted_jobs = {};
  selected_cat_id = "0";
  constructor(
    public db_service: DatabasesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global_items: GlobalItemsProvider,
    public apiService: CommonApiService,
    public setting: StaticSettings,
    public app: App,
    public my_events: Events
  ) {
    this.my_events.subscribe("user:search_in_jobs_wanted", () => {
      setTimeout(() => {
        this.category_sort(this.selected_cat_id);
      }, 1000);
    });
  }
  get_banner() {
    this.banner_collection = [];
    this.apiService.get("banners", { page: "jobs" }).subscribe(
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
  ngOnInit() {
    this.get_banner();
    this.wanted_jobs["next"] = 1;
    this.wanted_jobs["data"] = [];
    this.wanted_jobs["display"] = "loading";
    setTimeout(() => {
      this.get_categories();
      this.category_sort("0");
    }, 1000);
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad TabJobJobAvailablePage");
  }

  get_categories() {
    this.apiService
      .get("subcategories", {
        category_id: 75
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
  category_sort(cat_id) {
    console.log("cat_id:" + cat_id);
    this.selected_cat_id = cat_id;
    if (cat_id == "0") {
      this.class_style = "selected_category_item";
      this.set_style_value = "0";
      console.log("inside if cat_id==0");
      this.wanted_jobs["next"] = 1;
      this.wanted_jobs["data"] = [];
      this.getServices();
    } else {
      //this.showToast(cat_id);
      this.class_style = "not_selected_category_item";
      this.set_style_value = cat_id;
      this.wanted_jobs["next"] = 1;
      this.wanted_jobs["data"] = [];
      console.log("else case");
      this.getServices_byID(cat_id);
    }
  }

  getServices(event?) {
    console.log("this pag>>", this.wanted_jobs["next"]);
    // this.global_items.showLoading("Please wait...");
    this.apiService
      .get("jobs-wanted", { page: this.wanted_jobs["next"] })
      .subscribe(
        res => {
          console.log("get jobs-wanted wanted_jobs ...");
          console.dir(res);
          // this.global_items.loading.dismiss();
          if (res.data.data.length > 0) {
            this.wanted_jobs["data"] = this.wanted_jobs["data"].concat(
              res.data.data
            );
            this.wanted_jobs["next"] = res.data.current_page + 1;
            console.log("ispaginate doing:>>", this.wanted_jobs["isPaginate"]);
            this.wanted_jobs["isPaginate"] =
              res.data.current_page < res.data.last_page;
            this.wanted_jobs["display"] = "show";
            console.log("ispaginate did:>>", this.wanted_jobs["isPaginate"]);
          } else if (
            this.wanted_jobs["next"] == 1 ||
            this.wanted_jobs["next"] == 0 ||
            this.wanted_jobs["data"].length == 0
          ) {
            this.wanted_jobs["display"] = "empty";
            // this.global_items.loading.dismiss();
          } else {
            console.log(
              "this page ",
              this.wanted_jobs["next"],
              "have no values"
            );
          }
        },
        err => {
          console.log("promotion event error is ", err);
          // this.global_items.loading.dismiss();
          this.global_items.showToast("Something went wrong");
        }
      );
  }

  getServices_byID(cat_id) {
    console.log("this pag>>", this.wanted_jobs["next"]);
    // this.global_items.showLoading("Please wait...");
    this.apiService
      .get("jobs-wanted", { page: this.wanted_jobs["next"], id: cat_id })
      .subscribe(
        res => {
          console.log("get upcoming wanted_jobs ...");
          console.dir(res);
          // this.global_items.loading.dismiss();
          if (res.data.data.length > 0) {
            this.wanted_jobs["data"] = this.wanted_jobs["data"].concat(
              res.data.data
            );
            this.wanted_jobs["next"] = res.data.current_page + 1;
            console.log("ispaginate doing:>>", this.wanted_jobs["isPaginate"]);
            this.wanted_jobs["isPaginate"] =
              res.data.current_page < res.data.last_page;
            this.wanted_jobs["display"] = "show";
            console.log("ispaginate did:>>", this.wanted_jobs["isPaginate"]);
          } else if (
            this.wanted_jobs["next"] == 1 ||
            this.wanted_jobs["next"] == 0 ||
            this.wanted_jobs["data"].length == 0
          ) {
            this.wanted_jobs["display"] = "empty";
            // this.global_items.loading.dismiss();
          } else {
            console.log(
              "this page ",
              this.wanted_jobs["next"],
              "have no values"
            );
          }
        },
        err => {
          console.log("promotion event error is ", err);
          // this.global_items.loading.dismiss();
          this.global_items.showToast("Something went wrong");
        }
      );
  }
  loadMore(infiniteScroll: InfiniteScroll) {
    if (this.wanted_jobs["isPaginate"]) {
      this.getServices(infiniteScroll);
      console.log("loadmore...");
      // infiniteScroll.complete();
    }
    setTimeout(() => {
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 2000);
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
  moveIn(item_id, job_title) {
    console.log("item id:", item_id, "\n", "job title:", job_title);
    let source_value = {
      id: item_id,
      title: job_title
    };
    this.app.getRootNav().push("TabJobJobinnerPage", { source: source_value });
  }
  doRefresh(refresher) {
    this.ngOnInit();
    // this.global_items.loading.dismiss();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  suggest() {
    let token = this.db_service.accessToken();
    if (token.hasOwnProperty("access")) {
      this.app.getRootNav().push("JobWantedAddPage");
    } else {
      this.global_items.showToast("Please login first");
    }
  }
}
