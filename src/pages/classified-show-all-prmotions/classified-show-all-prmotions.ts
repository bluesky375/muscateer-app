import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { App, Refresher } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { DatePipe } from "@angular/common";
import { EventsInnerPage } from "../events-inner/events-inner";
import { AddEventsPage } from "../add-events/add-events";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { NoItemFoundPage } from "../no-item-found/no-item-found";

/**
 * Generated class for the ClassifiedShowAllPrmotionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ClassifiedShowAllPrmotionsPage" })
@Component({
  selector: "page-classified-show-all-prmotions",
  templateUrl: "classified-show-all-prmotions.html"
})
export class ClassifiedShowAllPrmotionsPage {
  rootNavCtrl: NavController;
  events: any[] = [];
  current_date: any = {};
  date: any = {};
  clearpage: any = {};
  class_style: any;
  categories_list: any = {};
  set_style_value: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    public apiService: CommonApiService,
    public settings: StaticSettings,
    private datePipe: DatePipe,
    public global_item: GlobalItemsProvider
  ) {
    this.rootNavCtrl = navParams.get("rootNavCtrl");
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsUpcomingPage");
  }

  ngOnInit() {
    this.category_sort("0");
    this.get_categories();
  }
  category_sort(cat_id) {
    this.global_item.showLoading("please wait...");
    console.log("cat_id:" + cat_id);
    if (cat_id == "0") {
      this.class_style = "selected_category_item";
      this.set_style_value = "0";
      console.log("inside if cat_id==0");
      this.events["next"] = 1;
      this.events["data"] = [];
      this.getUpcomingEvents();
    } else {
      //this.showToast(cat_id);
      this.class_style = "not_selected_category_item";
      this.set_style_value = cat_id;
      this.events["next"] = 1;
      this.events["data"] = [];
      console.log("else case");
      this.getUpcomingEvents_by_id(cat_id);
    }
  }

  moveForward(pk_i_id) {
    console.log("classifieds promotion -->", pk_i_id);
    this.app.getRootNav().push("EventsInnerPage", {
      id: pk_i_id
    });
  }

  // goToPromotions() {
  //   this.app.getRootNav().push(PromotionsPage);
  // }

  addEvents() {
    this.app.getRootNav().push("AddEventsPage");
  }
  doRefresh(refresher) {
    this.ngOnInit();
    this.global_item.loading.dismiss();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  // getUpcomingEvents(event?) {
  //   this.apiService
  //     .get("events/promotions", { page: this.events["next"] })
  //     .do(res => this.filterData(res))
  //     .subscribe(
  //       res => {
  //         if (event) event.complete();
  //         console.log("events");
  //         console.dir(res);
  //         console.log(res.data.data.length);
  //         if (res.data.data.length == 0 || res.data.data == undefined) {
  //           console.log("inside if");
  //           this.global_item.loading.dismiss();
  //           this.navCtrl.push(NoItemFoundPage);
  //         } else {
  //           this.global_item.loading.dismiss();
  //         }
  //       },
  //       err => {
  //         this.global_item.loading.dismiss();
  //         this.navCtrl.push(NoItemFoundPage);
  //         console.log(err);
  //       }
  //     );
  // }
  goback() {
    this.navCtrl.pop();
  }
  get_categories() {
    this.apiService.get("promotional-categories").subscribe(
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
  getUpcomingEvents(event?) {
    this.apiService.get("events/promotions").subscribe(
      res => {
        console.log("get promotion events ...");
        console.dir(res);
        this.global_item.loading.dismiss();

        if (res.data.total > 0) {
          if (this.events["data"].length > 0) {
            this.events["data"] = this.events["data"].concat(res.data.data);
          } else {
            this.events["data"] = res.data.data;
          }
          this.events["next"] = res.data.current_page + 1;
          this.events["isPaginate"] =
            res.data.current_page < res.data.last_page;
          this.events["display"] = "show";
        } else {
          this.events["display"] = "empty";
          this.global_item.loading.dismiss();
          this.navCtrl.push(NoItemFoundPage);
        }
      },
      err => {
        console.log("promotion event error is ", err);
        this.global_item.loading.dismiss();
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        } else {
          this.navCtrl.push(NoItemFoundPage);
        }
      }
    );
  }
  getUpcomingEvents_by_id(cat_id) {
    console.log("this pag>>", this.events["next"]);
    this.apiService
      .get("event-category-items", { page: this.events["next"], id: cat_id })
      .subscribe(
        res => {
          console.log("get promotions events ...");
          console.dir(res);
          this.global_item.loading.dismiss();
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
            this.global_item.loading.dismiss();
            // this.navCtrl.push(NoItemFoundPage);
            // this.global_item.showToast("Tap on 'heading' and pull to refresh");
          } else {
            console.log("this page ", this.events["next"], "have no values");
          }
        },
        err => {
          console.log("promotion event error is ", err);
          this.global_item.loading.dismiss();
          this.navCtrl.push(NoItemFoundPage);
          // this.global_item.showToast("Tap on 'heading' and pull to refresh");
        }
      );
  }
  getEventsOfDate(date) {
    console.log("inside");
    this.apiService
      .postData({ page: this.events["next"], date: date }, "events/of-date")
      .do(res => this.filterData(res))
      .subscribe();
  }

  filterData(res) {
    if (res.status) {
      if (res.data.total > 0) {
        if (this.events["data"].length > 0) {
          this.events["data"] = this.events["data"].concat(res.data.data);
        } else {
          this.events["data"] = res.data.data;
        }
        this.events["next"] = res.data.current_page + 1;
        this.events["isPaginate"] = res.data.current_page < res.data.last_page;
        this.events["display"] = "show";
      } else {
        this.events["display"] = "empty";
      }
    } else {
      this.events["display"] = "empty";
    }
  }

  loadMore(infiniteScroll) {
    if (this.events["isPaginate"]) {
      this.getUpcomingEvents(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  saveDate(res) {
    this.date = res;
    this.events["next"] = 1;
    this.events["data"] = [];
    this.clearpage["true"] = 1;
    this.getEventsOfDate(this.date);
  }

  clearFilter() {
    this.events["next"] = 1;
    this.events["data"] = [];
    this.getUpcomingEvents();
  }

  todaysDate() {
    this.current_date = new Date();
    this.current_date.setDate(this.current_date.getDate() - 1);
    this.current_date = this.datePipe.transform(this.current_date, "y-MM-dd");
    console.log(this.current_date);
  }

  getImagesPath(res) {
    // console.log(res);
    let path: boolean;
    if (!res) return;
    path = res.image ? true : false;
    if (path) {
      return this.settings.IMAGE_URL + res.image;
    } else {
      return this.settings.ITEM_DUMMY_IMAGE;
    }
  }

  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }
  getDate(date) {
    let event = new Date(date);
    let Data = event.toLocaleDateString();
    return Data;
  }
}
