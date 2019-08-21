import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { App, IonicPage, NavController, NavParams, Tab } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { EventPromotionPage } from "./event-promotion/event-promotion";
import { EventTodayPage } from "./event-today/event-today";
import { EventsUpcomingPage } from "./events-upcoming/events-upcoming";

/**
 * Generated class for the EventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-events",
  templateUrl: "events.html"
})
export class EventsPage implements OnInit {
  rootNavCtrl: NavController;
  events: any[] = [];
  current_date: any = {};
  date: any = {};
  clearpage: any = {};

  tab1Root = EventsUpcomingPage;
  tab2Root = EventTodayPage;
  tab3Root = EventPromotionPage;
  scroll_anim_flag: string;
  tabIndex = 0;
  constructor(
    private app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    public settings: StaticSettings,
    private datePipe: DatePipe,
    public global_items: GlobalItemsProvider
  ) {
    this.rootNavCtrl = navParams.get("rootNavCtrl");
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
  }
  tabSelected(tab: Tab) {
    this.tabIndex = tab.index;
    if (this.tabIndex == 0) {
      this.global_items.tab_events_head = "upcoming";
    } else if (this.tabIndex == 1) {
      this.global_items.tab_events_head = "todays";
    }
  }
  ionViewWillEnter() {
    this.global_items.change_search_placeholder("Events");
  }
  ngOnInit() {
    this.global_items.change_search_placeholder("Events");
    // this.getUpcomingEvents();
    // this.todaysDate();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EventsPage");
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

  getUpcomingEvents(event?) {
    this.apiService
      .get("events/upcoming", { page: this.events["next"] })
      .do(res => this.filterData(res))
      .subscribe(res => {
        if (event) event.complete();
      });
  }

  getEventsOfDate(date) {
    console.log("inside");
    this.apiService
      .postData({ page: this.events["next"], date: date }, "events/of-date")
      .do(res => this.filterData(res))
      .subscribe();
  }

  filterData(res) {
    console.log("filter data");
    console.log(res);

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
