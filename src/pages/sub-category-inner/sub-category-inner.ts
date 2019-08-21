import { Component } from "@angular/core";
import { Network } from "@ionic-native/network";
import {
  AlertController,
  App,
  IonicPage,
  NavController,
  NavParams,
  Keyboard
} from "ionic-angular";
import { SuperTabsController } from "ionic2-super-tabs";
import { ClassifiedsService } from "../../services/classifieds.service";
import { DatabasesService } from "../../services/databases.service";
import { UrlUtils } from "../../services/url.service";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { CommonApiService } from "./../../services/common-api.service";
import { StaticSettings } from "./../../services/settings.service";

/**
 * Generated class for the SubCategoryInnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SubCategoryInnerPage"
})
@Component({
  selector: "page-sub-category-inner",
  templateUrl: "sub-category-inner.html"
})
export class SubCategoryInnerPage {
  item_list_array = [];
  subcategories: any[];
  isShow_item_list = false;
  isShow_subcategory = false;
  isShow_no_data = false;
  fk_i_parent_id;
  catId;
  // contentHandle: Content;
  // pushMessage: string = "push message will be displayed here";
  // categories: any[];
  // subcategories: any[];
  // popularItems: any = {};
  // imageUrl: string;
  // newItems: any = {};
  // recentItems: any = {};
  // nearbyItems: any = {};
  // hotels: any = {};
  // popularLoading: string;
  // newlyAddedLoading: string;
  // scroll_anim_flag = "";
  // sample_json: any[];
  // events: any[] = [];

  // canShow_popularSearches: boolean = false;
  // canShow_newlyAdded: boolean = false;
  // canShow_recentlySearched: boolean = false;
  // canShow_adsNearBy: boolean = false;
  constructor(
    public keyboard: Keyboard,
    public navParams: NavParams,
    private itemService: ClassifiedsService,
    public atrCtrl: AlertController,
    public urlService: UrlUtils,
    private settings: StaticSettings,
    public superTabsCtrl: SuperTabsController,
    public dbservice: DatabasesService,
    private app: App,
    public network: Network,
    public apiService: CommonApiService,
    public navCtrl: NavController,
    public global_providers: GlobalItemsProvider
  ) {
    // this.imageUrl = settings.IMAGE_URL;
    // this.events["next"] = 1;
    // this.events["data"] = [];
    // this.events["display"] = "loading";
  }
  head;
  ionViewDidLoad() {
    console.log("ionViewDidLoad SubCategoryInnerPage");
    this.catId = this.navParams.get("pkid");
    this.head = this.navParams.get("head");
    this.fk_i_parent_id = this.navParams.get("parent_id");
    console.log("category catid", this.catId);

    // this.check_token(catId);

    this.get_list(this.catId);
  }
  goback() {
    this.navCtrl.pop();
  }
  get_list(id) {
    console.log("catID", id);
    console.log("head", this.head);
    console.log("parent id", this.fk_i_parent_id);

    // if (this.head === "Jobs Available") {
    if (this.fk_i_parent_id == 8 && id == 75) {
      this.apiService
        .get("subcategories", { category_id: id })
        .subscribe(res => {
          if (Object.keys(res.data).length > 0) {
            this.subcategories = res.data;
            console.log(this.subcategories);
            this.global_providers.loading.dismiss();
            this.isShow_subcategory = true;
            this.isShow_no_data = false;
          } else {
            this.isShow_no_data = true;
            this.isShow_subcategory = false;
            console.log("error");
            this.navCtrl.push("NoItemFoundPage");
            this.global_providers.loading.dismiss();
          }
        });
    } else {
      this.apiService.get("item/list?catId=" + id).subscribe(
        res => {
          if (res["data"]["data"].length > 0) {
            this.isShow_no_data = false;
            this.isShow_item_list = true;
            console.log(res);
            this.item_list_array = res["data"]["data"];
          } else {
            this.isShow_no_data = true;
          }
        },
        err => {
          this.isShow_no_data = true;
          this.isShow_item_list = false;
          console.log(err);
          if (err.originalError.status == 404) {
            this.navCtrl.push("ForNotForPage");
          }
        }
      );
    }
  }
  showall() {
    this.navCtrl.push("SubCategoryInnerPage", {
      pkid: this.navParams.get("pkid")
    });
  }
  check_token(title, position, id) {
    let token = this.dbservice.accessToken();
    this.navCtrl.push("InnerClassifiedsPage", {
      id: id
    });
  }
  // viewNearBy() {
  //   this.app.getRootNav().push(ViewAllClassifiedsPage, {
  //     type: "NEARBY"
  //   });
  // }
  // getItemId(id) {
  //   this.app.getRootNav().push(InnerClassifiedsPage, {
  //     id: id
  //   });
  //   console.log(id);
  // }
  // viewPopular() {
  //   this.app.getRootNav().push(ViewAllClassifiedsPage, {
  //     type: "POPULAR"
  //   });
  // }
  // viewRecent() {
  //   this.app.getRootNav().push(ViewAllClassifiedsPage, {
  //     type: "RECENT"
  //   });
  // }
  // viewNew() {
  //   console.log("2");
  //   this.app.getRootNav().push(ViewAllClassifiedsPage, {
  //     type: "NEW"
  //   });
  // }
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
  show_inner_sub_categories(pk_id, head) {
    console.log(pk_id);
    this.navCtrl.push("SubCategoryInnerPage", {
      pkid: pk_id,
      head: head
    });
  }

  show_inner_sub_jobs(id_name, name) {
    if (id_name == "All") {
      this.navCtrl.push("CategoriesJobAvailableListingPage", {
        head: this.global_providers.do_translation("All"),
        cat_id: 0
      });
    } else {
      this.navCtrl.push("CategoriesJobAvailableListingPage", {
        head: name,
        cat_id: id_name
      });
    }
  }
  do_search(input_value) {
    // this.global_items.App_global_search_input = input_value;
    console.log(input_value);
    this.keyboard.close();
    this.subcategories = [];
    this.get_list(this.catId);
  }
  ionViewDidLeave() {
    this.global_providers.App_global_search_input = "";
  }
}
