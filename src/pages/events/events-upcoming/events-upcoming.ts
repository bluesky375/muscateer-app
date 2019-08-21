import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import {
  App,
  InfiniteScroll,
  IonicPage,
  NavController,
  NavParams,
  Events
} from "ionic-angular";
import { GlobalItemsProvider } from "../../../providers/global-items/global-items";
import { CommonApiService } from "../../../services/common-api.service";
import { DatabasesService } from "../../../services/databases.service";
import { StaticSettings } from "../../../services/settings.service";
import { NoItemFoundPage } from "../../no-item-found/no-item-found";

/**
 * Generated class for the EventsUpcomingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-events-upcoming",
  templateUrl: "events-upcoming.html"
})
export class EventsUpcomingPage {
  show_loading = true;
  banner_collection = [];
  rootNavCtrl: NavController;
  events: any[] = [];
  current_date: any = {};
  date: any = {};
  clearpage: any = {};
  no_item_found: boolean = false;
  scroll_anim_flag: string;
  class_style: any;
  categories_list: any = {};
  set_style_value: any;
  catid = "0";
  constructor(
    public my_events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    public apiService: CommonApiService,
    public settings: StaticSettings,
    private datePipe: DatePipe,
    public global_item: GlobalItemsProvider,
    public db_service: DatabasesService
  ) {
    this.rootNavCtrl = navParams.get("rootNavCtrl");
    // this.events["next"] = 1;
    // this.events["data"] = [];
    // this.events["display"] = "loading";
    this.my_events.subscribe("user:search_in_events_upcoming", () => {
      setTimeout(() => {
        this.category_sort(this.catid);
      }, 1000);
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsUpcomingPage");
  }
  get_categories() {
    this.apiService.get("event-categories").subscribe(
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
  ngOnInit() {
    this.get_banner();
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
    // this.class_style = "selected_category_item";
    // this.getUpcomingEvents();
    // this.global_item.showLoading("please wait...");
    this.show_loading = true;
    this.db_service.getToken().subscribe(
      res => {
        console.log("upcoming events get token");
        console.log(res);
      },
      err => {
        console.log("upcoming events get token error");
        console.log(err);
      }
    );
    setTimeout(() => {
      this.get_categories();
      this.category_sort("0");
    }, 1000);
    // this.todaysDate();
  }

  moveForward(pk_i_id) {
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
    // this.global_item.loading.dismiss();
    this.show_loading = false;
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  getUpcomingEvents(event?) {
    console.log("this pag>>", this.events["next"]);
    this.apiService
      .get("events/upcoming", { page: this.events["next"] })
      .subscribe(
        res => {
          console.log("get upcoming events ...");
          console.dir(res);
          // this.global_item.loading.dismiss();
          this.show_loading = false;

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
            // this.global_item.loading.dismiss();
            this.show_loading = false;

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
          // this.global_item.loading.dismiss();
          this.show_loading = false;
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
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
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

  loadMore(infiniteScroll: InfiniteScroll) {
    if (this.events["isPaginate"]) {
      this.getUpcomingEvents(infiniteScroll);
      console.log("loadmore...");
      // infiniteScroll.complete();
    }
    setTimeout(() => {
      console.log("Async operation has ended");
      infiniteScroll.complete();
    }, 2000);
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

  category_sort(cat_id) {
    this.show_loading = true;
    console.log("cat_id:" + cat_id);
    this.catid = cat_id;
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
      this.getUpcomingEvents_byID(cat_id);
    }
  }

  getUpcomingEvents_byID(cat_id) {
    console.log("this pag>>", this.events["next"]);
    this.apiService
      .get("event-category-items", { page: this.events["next"], id: cat_id })
      .subscribe(
        res => {
          console.log("get upcoming events ...");
          console.dir(res);
          // this.global_item.loading.dismiss();
          this.show_loading = false;

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
            // this.global_item.loading.dismiss();
            this.show_loading = false;

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
          // this.global_item.loading.dismiss();
          this.navCtrl.push(NoItemFoundPage);
          // this.global_item.showToast("Tap on 'heading' and pull to refresh");
        }
      );
  }
  get_banner() {
    this.banner_collection = [];
    this.apiService.get("banners", { page: "events" }).subscribe(
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
}
