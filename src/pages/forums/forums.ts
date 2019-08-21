import { Component, OnInit } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  Events
} from "ionic-angular";
import { FcmControllingProvider } from "../../providers/fcm-controlling/fcm-controlling";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";

/**
 * Generated class for the ForumsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-forums",
  templateUrl: "forums.html"
})
export class ForumsPage implements OnInit {
  temp_type_refresh: any = "news";
  scroll_anim_flag = "";
  news: any = {};
  url: any = {};
  todo: any = {};
  attractions: any = {};
  restaurants: any = {};
  hotels: any = {};
  rootNavCtrl: NavController;
  comments: any = [];
  banner_collection = [];
  public view: string = "news";
  constructor(
    public my_events: Events,
    private fcmCtrl: FcmControllingProvider,
    private app: App,
    private navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    public settings: StaticSettings,
    public global_items: GlobalItemsProvider
  ) {
    this.news["next"] = 1;
    this.news["data"] = [];
    this.url = "news";
    // this.rootNavCtrl = navParams.get('rootNavCtrl');
    this.my_events.subscribe("user:search_in_forums", () => {
      setTimeout(() => {
        this.typeClick(this.global_items.tab_forum_head);
      }, 1000);
    });
  }
  ionViewWillEnter() {
    this.global_items.change_search_placeholder("Forums");
  }
  ngOnInit() {
    this.global_items.change_search_placeholder("Forums");
    this.fcmCtrl.fetchUserId();
    setTimeout(() => {
      this.getNews();
      this.getComments();
      this.get_banner();
    }, 1000);
  }
  get_banner() {
    this.banner_collection = [];
    this.apiService.get("banners", { page: "forum" }).subscribe(
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
  typeClick(type) {
    console.log("type:" + type);
    this.temp_type_refresh = type;
    console.log("temp_type:" + this.temp_type_refresh);
    this.view = type;
    this.global_items.tab_forum_head = type;
    if (type == "news") {
      this.filterResources();
      this.url = "news";
      this.getNews();
    }
    if (type == "advice") {
      this.filterResources();
      this.url = "advices-help";
      this.getNews();
    }
    if (type == "feeds") {
      this.filterResources();
      this.url = "feeds";
      this.getNews();
    }
    if (type == "muscut") {
      this.filterResources();
      this.url = "muscat-living";
      this.getNews();
    }
    if (type == "relax") {
      this.filterResources();
      this.url = "relax";
      this.getNews();
    }
    if (type == "tourism") {
      this.getToDo();
      this.getAttraction();
      this.getHotels();
      this.getRestaurants();
    }
  }

  filterResources() {
    this.news["next"] = 1;
    this.news["data"] = [];
  }

  getNews(event?) {
    this.apiService
      .get("forum/" + this.url, { page: this.news["next"] })
      .do(res => {
        this.filterData(res);
      })
      .subscribe(res => {
        if (event) event.complete();
      });
  }

  filterData(res) {
    // this.news["next"] = 1;
    // this.news["data"] = [];
    // this.url = "news";
    // this.news["display"] = "loading";
    if (res.status) {
      if (res.data.total > 0) {
        if (this.news["data"].length > 0) {
          this.news["data"] = this.news["data"].concat(res.data.data);
          console.log(this.news["data"]);
        } else {
          this.news["data"] = res.data.data;
        }
        this.news["next"] = res.data.current_page + 1;
        this.news["isPaginate"] = res.data.current_page < res.data.last_page;
        this.news["display"] = "show";
      } else {
        this.news["display"] = "empty";
      }
    } else {
      this.news["display"] = "empty";
    }
  }

  loadMore(infiniteScroll) {
    console.log(infiniteScroll);

    if (this.news["isPaginate"]) {
      this.getNews(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  getToDo() {
    this.apiService.get("tourism/todo").subscribe(
      res => {
        if (res.status) {
          if (res.data.total > 0) {
            this.todo["items"] = res.data.data;
            console.log(this.todo["rating"]);
            this.todo["link"] = "todo";
            this.todo["switch"] = "show";
          } else {
            this.todo["switch"] = "empty";
          }
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }

  getAttraction() {
    this.apiService.get("tourism/attractions").subscribe(
      res => {
        if (res.status) {
          if (res.data.total > 0) {
            this.attractions["items"] = res.data.data;
            this.attractions["link"] = "attractions";
            this.attractions["switch"] = "show";
          } else {
            this.attractions["switch"] = "empty";
          }
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }

  getRestaurants() {
    this.apiService.get("tourism/restaurants").subscribe(
      res => {
        if (res.status) {
          if (res.data.total > 0) {
            this.restaurants["items"] = res.data.data;
            this.restaurants["link"] = "restaurants";
            this.restaurants["switch"] = "show";
          } else {
            this.restaurants["switch"] = "empty";
          }
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }
  getHotels() {
    this.apiService.get("tourism/hotels").subscribe(
      res => {
        if (res.status) {
          if (res.data.total > 0) {
            this.hotels["items"] = res.data.data;
            this.hotels["link"] = "hotels";
            this.hotels["switch"] = "show";
          } else {
            this.hotels["switch"] = "empty";
          }
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
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

  viewAll(res) {
    this.app.getRootNav().push("TouristViewALlPage", {
      page: res
    });
  }

  moveIn(id, type, cat) {
    if (id == null || id == undefined) {
      id = "null_id";
    }
    if (type == null || type == undefined) {
      type = "null_type";
    }
    if (cat == null || cat == undefined) {
      cat = "null_cat";
    }

    console.log("id:-" + id + "\n type:" + type + "\ncat:-" + cat);
    // this.app.getRootNav().push(ForumInnerPage, {
    //   id: id,
    //   type: type,
    //   category: cat
    // });
    try {
      switch (type) {
        case "events":
          {
            this.app.getRootNav().push("EventsInnerPage", {
              id: id,
              type: type,
              category: cat
            });
          }
          break;
        default: {
          this.app.getRootNav().push("ForumInnerPage", {
            id: id,
            type: type,
            category: cat
          });
        }
      }
    } catch (e) {
      console.log(e);
      this.global_items.showToast("Something went wrong, Try again later");
    }
  }

  gotoInner(id, type) {
    this.app.getRootNav().push("ForumInnerPage", {
      id: id,
      type: type,
      category: false
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ForumsPage");
  }

  getComments() {
    this.comments = [];
    console.log("Gettting comments");
    this.apiService.get("forum/hot-topics", {}).subscribe(
      res => {
        console.log("getting forum/hot-topics");

        console.log(res);

        if (res.status) {
          this.comments = res.data.data;
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
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
  getProfilePic(data) {
    return this.settings.IMAGE_URL + data.profile_picture;
  }

  doRefresh(refresher) {
    this.news = {};
    this.todo = {};
    this.attractions = {};
    this.restaurants = {};
    this.hotels = {};
    console.log("Begin async operation", refresher);
    this.typeClick(this.temp_type_refresh);
    this.getComments();
    this.get_banner();
    // this.ngOnInit();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
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
