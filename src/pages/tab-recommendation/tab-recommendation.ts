import { Component, OnInit } from "@angular/core";
import {
  App,
  Events,
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { StaticSettings } from "../../services/settings.service";
import { LoginPage } from "../login/login";

/**
 * Generated class for the TabRecommendationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-tab-recommendation",
  templateUrl: "tab-recommendation.html"
})
export class TabRecommendationPage implements OnInit {
  banner_collection = [];
  selected_head = "hotel";
  show_categories_filter: boolean = false;
  myInput: "";
  page: any = {};
  tourism: any = {};
  url: any = {};
  head: any = {};
  categories_json_list: any = {};
  set_style_value: any;
  class_style: any = "";
  itemIsempty = false;
  recommendation_id = "0";
  constructor(
    public my_events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    public apiService_common: CommonApiService,
    private settings: StaticSettings,
    public toastCtrl: ToastController,
    public global_item_provider: GlobalItemsProvider,
    public database_service: DatabasesService
  ) {
    this.tourism["next"] = 1;
    this.tourism["data"] = [];
    my_events.subscribe("user:search_in_recommendations", () => {
      // this.switchPage(this.global_item_provider.tab_recommendation_head);
      console.log(
        this.recommendation_id,
        this.global_item_provider.tab_recommendation_head
      );
      setTimeout(() => {
        this.category_sort(
          this.recommendation_id,
          this.global_item_provider.tab_recommendation_head
        );
      }, 1000);
    });
  }
  ionViewWillEnter() {
    this.global_item_provider.change_search_placeholder("Recommendations");
    this.ngOnInit();
  }
  doRefresh(refresher) {
    this.switchPage(this.selected_head);
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  ngOnInit() {
    this.global_item_provider.change_search_placeholder("Recommendations");
    this.get_banner();
    let page_name = this.global_item_provider.tab_recommendation_head;
    if (page_name == null || page_name == undefined || page_name == "") {
      setTimeout(() => {
        this.switchPage("hotel");
      }, 1000);
    } else {
      setTimeout(() => {
        this.switchPage(page_name);
      }, 1000);
    }
    console.log(this.head);
  }

  onInput(value) {
    console.log("", value);
    this.tourism["next"] = 1;
    this.tourism["data"] = [];
    if (value == "" || value == null || value == undefined) {
      this.category_sort(0, this.head);
    } else {
      this.apiService_common
        .get("forum-search", {
          title: value,
          // type: "hotel/restaurant/todo/attractions/living/news/advices/relax"
          type: this.page
        })
        .subscribe(
          res => {
            console.log(res);
            this.tourism["data"] = res["data"];
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  switchPage(page) {
    this.page = page;
    this.global_item_provider.tab_recommendation_head = page;
    console.log(this.page);
    if (this.page == "todo") {
      this.selected_head = "todo";
      this.show_categories_filter = true;
      this.head["todo"] = 1;
      this.filterResources();
      this.url = "todo";
      // this.getTourism();
      this.get_categories("todo-categories");
      this.category_sort(0, this.selected_head);
    }
    if (this.page == "hotel") {
      this.selected_head = "hotel";
      this.show_categories_filter = true;
      this.head["hotel"] = 1;
      this.filterResources();
      this.url = "hotels";
      // this.getTourism();
      this.get_categories("hotel-categories");
      this.category_sort(0, this.selected_head);
    }
    if (this.page == "attraction") {
      this.selected_head = "attraction";
      this.show_categories_filter = false;
      this.head["attractions"] = 1;
      this.filterResources();
      this.url = "attractions";
      // this.getTourism();
      this.get_categories("");
      this.category_sort(0, this.selected_head);
    }
    if (this.page == "restaurant") {
      this.selected_head = "restaurant";
      this.show_categories_filter = true;
      this.class_style = "selected_category_item";
      this.head["restaurant"] = 1;
      this.filterResources();
      this.url = "restaurants";
      // this.getTourism();
      this.get_categories("restaurant-categories");
      this.category_sort(0, this.selected_head);
    }
  }

  filterResources() {
    this.tourism["next"] = 1;
    this.tourism["data"] = [];
  }

  getTourism(event?) {
    this.apiService_common
      .get("tourism/" + this.url, {
        page: this.tourism["next"]
      })
      .do(res => this.filterData(res))
      .subscribe(res => {
        if (event) event.complete();
        console.log("get tourism");
        console.dir(res);
      });
  }

  filterData(res) {
    console.log("inside filterdata");
    if (res.status) {
      if (res.data.total > 0) {
        if (this.tourism["data"].length > 0) {
          this.tourism["data"] = this.tourism["data"].concat(res.data.data);
          console.dir(this.tourism["data"]);
          console.log("value:\t" + this.tourism["data"]);
        } else {
          this.tourism["data"] = res.data.data;
          console.log("inside else1");
        }
        console.log(this.tourism["data"]);
        this.tourism["next"] = res.data.current_page + 1;
        this.tourism["isPaginate"] = res.data.current_page < res.data.last_page;
        this.tourism["display"] = "show";
      } else {
        this.tourism["display"] = "empty";
        console.log(this.tourism["display"]);
        this.itemIsempty = true;
        console.log("tourist category,");
        this.global_item_provider.showToast("No results found");
      }
    } else {
      this.tourism["display"] = "empty";
      console.log("empty");
      this.global_item_provider.showToast("No results found");
    }
  }

  loadMore(infiniteScroll) {
    if (this.tourism["isPaginate"]) {
      this.getTourism(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }
  goback() {
    this.navCtrl.pop();
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

  ionViewDidLoad() {
    console.log("ionViewDidLoad TouristViewALlPage");
  }
  get_categories(url?) {
    this.categories_json_list = {};
    if (url == "") {
    } else {
      this.apiService_common.get("tourism/" + url).subscribe(res => {
        if (res) {
          this.categories_json_list = res;
        } else {
          this.global_item_provider.showToast("No categories found");
        }
      });
    }
  }
  category_sort(cat_id, head?) {
    console.log("cat_id:" + cat_id);
    console.log("head:", head);
    this.recommendation_id = cat_id;
    if (cat_id == "0") {
      this.class_style = "selected_category_item";
      this.set_style_value = "0";
      console.log("inside if cat_id==0");
      this.tourism = {};
      this.tourism["data"] = [];
      this.getTourism();
    } else {
      //this.showToast(cat_id);
      this.class_style = "not_selected_category_item";
      this.set_style_value = cat_id;
      let url = "";
      if (head == "todo") {
        url = "todo-category-items";
        this.getData_by_category(cat_id, url);
      } else if (head == "restaurant") {
        url = "restaurant-category-items";
        this.getData_by_category(cat_id, url);
      } else if (head == "hotel") {
        url = "hotel-category-items";
        this.getData_by_category(cat_id, url);
      }
      // else {
      //   this.getData_by_category(cat_id, url);
      //   url = "";
      // }
    }
  }
  // category_sort(cat_id, head?) {
  //   console.log("cat_id:" + cat_id);
  //   console.log("head:", head);

  //   if (cat_id == "0") {
  //     this.class_style = "selected_category_item";
  //     this.set_style_value = "0";
  //     console.log("inside if cat_id==0");
  //     this.tourism = {};
  //     this.tourism["data"] = [];
  //     this.getTourism();
  //   } else {
  //     //this.showToast(cat_id);
  //     this.class_style = "not_selected_category_item";
  //     this.set_style_value = cat_id;
  //     let url = "";
  //     if (head.todo) {
  //       url = "todo-category-items";
  //       this.getData_by_category(cat_id, url);
  //     } else if (head.restaurant) {
  //       url = "restaurant-category-items";
  //       this.getData_by_category(cat_id, url);
  //     } else if (head.hotel) {
  //       url = "hotel-category-items";
  //       this.getData_by_category(cat_id, url);
  //     } else {
  //       this.getData_by_category(cat_id, url);
  //       url = "";
  //     }
  //   }
  // }
  getData_by_category(cat_id, url) {
    this.apiService_common
      .get("tourism/" + url, {
        id: cat_id
      })
      .subscribe(res => {
        console.log("fileter api response is:");
        console.log(res);
        console.dir(res);
        this.tourism = {};
        this.tourism["data"] = [];
        this.filterData(res);
      });
  }
  get_banner() {
    this.banner_collection = [];
    this.apiService_common
      .get("banners", { page: "recommendations" })
      .subscribe(
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
    this.app.getRootNav().push("ForumInnerPage", {
      id: id,
      type: type,
      category: cat
    });
  }
  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }
  suggest(category) {
    let token = this.database_service.accessToken();
    if (token.hasOwnProperty("access")) {
      switch (category) {
        case "todo":
          {
            console.log("pushing to suggest");
            this.app.getRootNav().push("SuggestPageThingsToDoPage");
          }
          break;
        case "hotel":
          {
            console.log("pushing to suggest");
            this.app.getRootNav().push("SuggestPageHotelPage");
          }
          break;
        case "restaurant":
          {
            console.log("pushing to suggest");
            this.app.getRootNav().push("SuggestPopupPage");
          }
          break;
        case "attraction":
          {
            console.log("pushing to suggest");
            this.app.getRootNav().push("SuggestPageAttractionPage");
          }
          break;
        default:
          {
            this.global_item_provider.showToast("Please login first");
          }
          break;
      }
    } else {
      this.app.getRootNav().push(LoginPage);
    }
  }
}
