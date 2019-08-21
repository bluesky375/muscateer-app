import { Component, OnInit, ViewChild } from "@angular/core";
// import { AlertController } from 'ionic-angular';
import { Network } from "@ionic-native/network";
// import { Component } from '@angular/core';
// import { NavController, Platform } from 'ionic-angular';
import {
  AlertController,
  App,
  Content,
  IonicPage,
  NavController,
  NavParams,
  Events
} from "ionic-angular";
import { SuperTabsController } from "ionic2-super-tabs";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { ClassifiedsService } from "../../services/classifieds.service";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { WebService } from "../../services/non-api.service";
import { StaticSettings } from "../../services/settings.service";
import { UrlUtils } from "../../services/url.service";
import { FcmControllingProvider } from "./../../providers/fcm-controlling/fcm-controlling";
@IonicPage()
@Component({
  selector: "page-classifieds",
  templateUrl: "classifieds.html"
})
export class ClassifiedsPage implements OnInit {
  @ViewChild("contentRef")
  contentHandle: Content;
  pushMessage: string = "push message will be displayed here";
  categories: any[];
  subcategories: any[];
  popularItems: any = {};
  imageUrl: string;
  newItems: any = {};
  recentItems: any = {};
  nearbyItems: any = {};
  hotels: any = {};

  public data: any = {};
  // navCtrl: NavController;
  popularLoading: string;
  newlyAddedLoading: string;
  private topOrBottom: string;
  private contentBox;
  scroll_anim_flag = "";
  sample_json: any[];
  can_show_promotions = false;
  can_show_ads_nearby = false;
  events: any[] = [];
  banner_collection = [];
  constructor(
    public my_events: Events,
    private fcmCtrl: FcmControllingProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ClassifiedsService,
    private service: CommonApiService,
    private _nonApi: WebService,
    public atrCtrl: AlertController,
    public urlService: UrlUtils,
    private settings: StaticSettings,
    public superTabsCtrl: SuperTabsController,
    public dbservice: DatabasesService,
    private app: App,
    public network: Network,
    public apiService: CommonApiService,
    public global_items: GlobalItemsProvider
  ) {
    this.imageUrl = settings.IMAGE_URL;
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";

    my_events.subscribe("user:search_in_classifieds", () => {
      setTimeout(() => {
        this.popularSearches();
        this.newlyAdded();
        this.adsNearBy();
        this.recentlySearched();
        this.getPromotions();
        this.get_banner();
      }, 1000);
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ClassifiedsPage");
  }
  ionViewWillEnter() {
    this.global_items.change_search_placeholder("classifieds");
  }
  ngOnInit() {
    this.global_items.change_search_placeholder("classifieds");
    setTimeout(() => {
      this.popularSearches();
      this.newlyAdded();
      this.getCategories();
      this.get_banner();
      let token = this.dbservice.accessToken();
      if (token.hasOwnProperty("access")) {
        this.adsNearBy();
        this.recentlySearched();
        this.fcmCtrl.fetchUserId();
        this.getPromotions();
      }
    }, 1000);
  }
  get_banner() {
    this.banner_collection = [];
    this.apiService.get("banners", { page: "home" }).subscribe(
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
  doRefresh(refresher?) {
    console.log("Begin async operation", refresher);
    this.ngOnInit();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }
  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }
  moveForward(pk_i_id) {
    console.log("classifieds promotion -->", pk_i_id);
    this.app.getRootNav().push("EventsInnerPage", {
      id: pk_i_id
    });
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
  getPromotions(event?) {
    this.can_show_promotions = false;
    this.events["next"] = 1;
    this.events["data"] = [];
    this.events["display"] = "loading";
    this.apiService.get("events/promotions").subscribe(
      res => {
        // this.global_item.loading.dismiss();

        if (res.data.total > 0) {
          this.can_show_promotions = true;
          console.log("get promotion events success ...");
          console.dir(res);
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
          console.log("get promotion events ...");
          console.log("empty");
          this.events["display"] = "empty";
          // this.global_item.loading.dismiss();
          // this.navCtrl.push(NoItemFoundPage);
        }
      },
      err => {
        console.log("promotion event error is ", err);
        // this.global_item.loading.dismiss();
        // this.navCtrl.push(NoItemFoundPage);
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );

    console.log("classifieds-get-promotion..");
    console.dir(this.events);
  }
  // ngAfterViewInit() {
  //   console.log('check here');
  //   // this.showToolbar();
  // }
  popularSearches(catId?: number, pageNo?: number) {
    this.popularItems = {};
    this.popularItems["switch"] = "loading";
    if (!catId) {
      if (this.popularItems.hasOwnProperty("active_category")) {
        catId = this.popularItems["active_category"];
      } else {
        catId = null;
      }
    }

    this.itemService
      .get("popular-search", {
        catId: catId,
        page: pageNo ? pageNo : 1,
        api: 6
      })
      .subscribe(res => {
        if (Object.keys(res.data.data).length > 0) {
          this.popularItems["current"] = res.data.current_page;
          this.popularItems["total"] = res.data.total;
          this.popularItems["last"] = res.data.last_page;
          this.popularItems["data"] = res.data.data;
          this.popularItems["next"] = res.data.current_page + 1;
          this.popularItems["previous"] = res.data.current_page - 1;
          this.popularItems["switch"] = "show";

          this.popularItems["active_category"] = catId;
          this.popularLoading = "loaded-ok";
          // if (this.popularItems.data.length > 5) {
          //   this.popularItems.data.splice(5, this.popularItems.data.length - 6);
          //   console.log("new items", this.popularItems.data.length);
          // }
        } else {
          this.popularItems["switch"] = "empty";
          this.popularItems["total"] = 0;
        }
      });
  }

  getCategories() {
    this.service.get("categories", { c: 6 }).subscribe(res => {
      if (res.status) {
        this.categories = [];
        this.categories = res.data;
        console.log("classified categories");
        console.dir("classified", this.categories);
        console.dir(this.categories);
      }
    });
  }

  categoryClick(id) {
    console.log(id);
    this.service.get("subcategories", { category_id: id }).subscribe(res => {
      if (Object.keys(res.data).length > 0) {
        this.subcategories = res.data;
        // console.log(this.subcategories);
        let alert = this.atrCtrl.create();
        alert.setCssClass("main-alert");
        alert.setTitle(
          this.global_items.do_translation("Select SubCategories")
        );
        for (var category in this.subcategories) {
          var temp = this.subcategories[category];
          alert.addInput({
            type: "radio",
            label: temp["name"],
            value: temp["pk_i_id"],
            checked: false
          });
        }

        alert.addButton("Cancel");
        alert.addButton({
          text: "OK",
          handler: data => {
            var catId = data;
            this.popularItems["data"] = [];
            this.newItems["data"] = [];
            this.recentItems["data"] = [];
            this.nearbyItems["data"] = [];
            this.popularSearches(catId);
            this.newlyAdded(catId);
            this.recentlySearched(catId);
            this.adsNearBy(catId);
          }
        });
        alert.present();
      } else {
        let alert = this.atrCtrl.create({
          title: this.global_items.do_translation("Empty"),
          subTitle: this.global_items.do_translation("No Categories found"),
          buttons: ["Dismiss"]
        });
        alert.present();
      }
    });
  }

  showRadioAlert(id) {
    let cat_id = id;
    console.log(cat_id);
    this.categoryClick(cat_id);
  }

  newlyAdded(catId?: number, pageNo?: number) {
    this.newItems = {};
    this.newItems["switch"] = "loading";
    if (!catId) {
      if (this.newItems.hasOwnProperty("active_category")) {
        catId = this.newItems["active_category"];
      } else {
        catId = null;
      }
    }

    this.itemService
      .get("newly-added", {
        catId: catId,
        page: pageNo ? pageNo : 1,
        api: 6
      })
      .subscribe(res => {
        if (Object.keys(res.data.data).length > 0) {
          this.newItems["current"] = res.data.current_page;
          this.newItems["total"] = res.data.total;
          this.newItems["last"] = res.data.last_page;
          this.newItems["data"] = res.data.data;
          this.newItems["next"] = res.data.current_page + 1;
          this.newItems["previous"] = res.data.current_page - 1;
          this.newItems["switch"] = "show";
          this.newItems["active_category"] = catId;
          this.newlyAddedLoading = "loaded-ok";
          // console.log(this.newItems);
          if (this.newItems.data.length > 5) {
            this.newItems.data.splice(5, this.newItems.data.length - 6);
            console.log("new items", this.newItems.data.length);
          }
        } else {
          this.newItems["switch"] = "empty";
          this.newItems["total"] = 0;
        }
      });
  }

  recentlySearched(catId?: number, pageNo?: number) {
    this.recentItems = {};
    this.recentItems["switch"] = "loading";
    if (!catId) {
      if (this.recentItems.hasOwnProperty("active_category")) {
        catId = this.recentItems["active_category"];
      } else {
        catId = null;
      }
    }

    this.itemService
      .get("recent-search", {
        catId: catId,
        page: pageNo ? pageNo : 1,
        api: 6
      })

      .subscribe(res => {
        if (Object.keys(res.data.data).length > 0) {
          this.recentItems["data"] = res.data.data;
          console.log(this.recentItems);
          this.recentItems["active_category"] = catId;
          this.recentItems["switch"] = "show";

          if (this.recentItems.data.length > 5) {
            this.recentItems.data.splice(5, this.recentItems.data.length - 6);
            console.log("new items", this.recentItems.data.length);
          }
        } else {
          this.recentItems["switch"] = "empty";
          this.recentItems["total"] = 0;
        }
      });
  }

  adsNearBy(catId?: number, pageNo?: number) {
    this.recentItems = {};
    this.recentItems["switch"] = "loading";
    if (!catId) {
      if (this.nearbyItems.hasOwnProperty("active_category")) {
        catId = this.nearbyItems["active_category"];
      } else {
        catId = null;
      }
    }
    this.itemService
      .get("ads-nearby", {
        catId: catId,
        api: 6,
        page: pageNo ? pageNo : 1
      })
      .subscribe(res => {
        if (Object.keys(res.data.data).length > 0) {
          this.can_show_ads_nearby = true;
          this.nearbyItems["data"] = res.data.data;
          console.log(this.nearbyItems);
          this.nearbyItems["switch"] = "show";
          this.nearbyItems["active_category"] = catId;

          if (this.nearbyItems.data.length > 5) {
            this.nearbyItems.data.splice(5, this.nearbyItems.data.length - 6);
            console.log("new items", this.nearbyItems.data.length);
          }
        } else {
          this.nearbyItems["switch"] = "empty";
          this.nearbyItems["total"] = 0;
        }
      });
  }

  // showToolbar() {
  //   console.log('called inner cl');
  //   this.superTabsCtrl.showToolbar(true);
  // }

  getItemId(id) {
    this.app.getRootNav().push("InnerClassifiedsPage", {
      id: id
    });
    console.log(id);
  }
  viewall_promotions() {
    this.app.getRootNav().push("ClassifiedShowAllPrmotionsPage");
  }
  viewPopular() {
    this.app.getRootNav().push("ViewAllClassifiedsPage", {
      type: "POPULAR"
    });
  }
  viewNew() {
    console.log("2");
    this.app.getRootNav().push("ViewAllClassifiedsPage", {
      type: "NEW"
    });
  }
  viewNearBy() {
    this.app.getRootNav().push("ViewAllClassifiedsPage", {
      type: "NEARBY"
    });
  }
  viewRecent() {
    this.app.getRootNav().push("ViewAllClassifiedsPage", {
      type: "RECENT"
    });
  }

  //push notification
  //-----------------

  viewAll(res) {
    // this.app.getRootNav().push("TouristViewALlPage", {
    //   page: res
    // });
    this.global_items.tab_recommendation_head = res;
    this.navCtrl.parent.select(3);
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

  move_to_category_page(cat_id) {
    // this.app.getRootNav().push("SubCategoryPage", { cat_id: cat_id });

    if (cat_id == 5) {
      this.navCtrl.parent.select(4);
    } else if (cat_id == 8) {
      this.navCtrl.parent.select(5);
    } else {
      this.app.getRootNav().push("SubCategoryPage", { cat_id: cat_id });
    }
  }
}
