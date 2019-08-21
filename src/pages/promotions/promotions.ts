import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { StaticSettings } from "../../services/settings.service";
import { EventsInnerPage } from "../events-inner/events-inner";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the PromotionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-promotions",
  templateUrl: "promotions.html"
})
export class PromotionsPage implements OnInit {
  rootNavCtrl: NavController;
  promotions: any[] = [];

  constructor(
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    public settings: StaticSettings
  ) {
    this.rootNavCtrl = navParams.get("rootNavCtrl");
    this.promotions["next"] = 1;
    this.promotions["data"] = [];
    this.promotions["display"] = "loading";
  }

  ngOnInit() {
    this.getPromotions();
  }

  // getPromotions() {
  //     this.apiService.get("events/promotions", {})
  //         .subscribe(res=> {
  //             console.log("res : " ,res);
  //             if (res.status) {
  //                 if (res.data.total > 0) {
  //                     if (this.promotions['data'].length > 0) {
  //                         this.promotions['data'] = this.promotions['data'].concat(res.data.data);
  //                     } else {
  //                         this.promotions['data'] = res.data.data;
  //                     }
  //                     this.promotions['next'] = res.data.current_page + 1;
  //                     this.promotions['isPaginate'] = res.data.current_page < res.data.last_page;
  //                     this.promotions['display'] = 'show';
  //                 } else {
  //                     this.promotions['display'] = 'empty';
  //                 }
  //             } else {
  //                 this.promotions['display'] = 'empty';
  //             }
  //         });
  // }

  getPromotions(event?) {
    this.apiService
      .get("events/promotions", { page: this.promotions["next"] })
      .do(res => this.filterData(res))
      .subscribe(res => {
        if (event) event.complete();
      });
  }

  filterData(res) {
    this.promotions["display"] = "loading";
    if (res.status) {
      if (res.data.total > 0) {
        if (this.promotions["data"].length > 0) {
          this.promotions["data"] = this.promotions["data"].concat(
            res.data.data
          );
          console.log(this.promotions["data"]);
        } else {
          this.promotions["data"] = res.data.data;
        }
        this.promotions["next"] = res.data.current_page + 1;
        this.promotions["isPaginate"] =
          res.data.current_page < res.data.last_page;
        this.promotions["display"] = "show";
      } else {
        this.promotions["display"] = "empty";
      }
    } else {
      this.promotions["display"] = "empty";
    }
  }

  loadMore(infiniteScroll) {
    if (this.promotions["isPaginate"]) {
      this.getPromotions(infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
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

  moveForward(pk_i_id) {
    this.navCtrl.push("EventsInnerPage", {
      id: pk_i_id
    });
  }

  updateImageUrl(event) {
    event.target.src = this.settings.ITEM_DUMMY_IMAGE;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PromotionsPage");
  }
  getDate(date) {
    let event = new Date(date);
    let Data = event.toLocaleDateString();
    return Data;
  }

  goback() {
    this.navCtrl.pop();
  }
}
