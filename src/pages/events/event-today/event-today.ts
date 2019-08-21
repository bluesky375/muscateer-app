import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  Events
} from "ionic-angular";
import { GlobalItemsProvider } from "../../../providers/global-items/global-items";
import { CommonApiService } from "../../../services/common-api.service";
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
  selector: "page-event-today",
  templateUrl: "event-today.html"
})
export class EventTodayPage {
  show_loading = true;
  banner_collection = [];
  rootNavCtrl: NavController;
  events: any[] = [];
  current_date: any = {};
  date: any = {};
  clearpage: any = {};
  scroll_anim_flag: string;
  constructor(
    public my_events: Events,
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
    this.my_events.subscribe("user:search_in_events_todays", () => {
      this.events = [];
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsUpcomingPage");
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
  ngOnInit() {
    this.get_banner();
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
    // this.global_item.showLoading("please wait...");
    this.show_loading = true;

    setTimeout(() => {
      this.getUpcomingEvents();
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

  // getUpcomingEvents(event?) {
  //   this.apiService.get("events/today").subscribe(
  //     res => {
  //       console.log("get promotion events ...");
  //       console.dir(res);
  //       this.global_item.loading.dismiss();

  //       if (res.data.total > 0) {
  //         if (this.events["data"].length > 0) {
  //           this.events["data"] = this.events["data"].concat(res.data.data);
  //         } else {
  //           this.events["data"] = res.data.data;
  //         }
  //         this.events["next"] = res.data.current_page + 1;
  //         this.events["isPaginate"] =
  //           res.data.current_page < res.data.last_page;
  //         this.events["display"] = "show";
  //       } else {
  //         this.events["display"] = "empty";
  //         this.global_item.loading.dismiss();
  //         this.navCtrl.push(NoItemFoundPage);
  //         this.global_item.showToast("Tap on 'heading' and pull to refresh");
  //       }
  //     },
  //     err => {
  //       console.log("promotion event error is ", err);
  //       this.global_item.loading.dismiss();
  //       this.navCtrl.push(NoItemFoundPage);
  //       this.global_item.showToast("Tap on 'heading' and pull to refresh");
  //     }
  //   );
  // }

  getUpcomingEvents(event?) {
    console.log("this pag>>", this.events["next"]);
    this.apiService
      .get("events/today", { page: this.events["next"] })
      .subscribe(
        res => {
          console.log("get today events ...");
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
            this.global_item.loading.dismiss();
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
}
