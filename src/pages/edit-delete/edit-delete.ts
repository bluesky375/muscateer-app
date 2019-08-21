import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { EditClassifiedsPage } from "../edit-classifieds/edit-classifieds";
import { EditForumsPage } from "../edit-forums/edit-forums";
import { EditEventsPage } from "../edit-events/edit-events";
import { AdsPostedPage } from "../ads-posted/ads-posted";
import { ItemService } from "../../services/item.service";
import { Toast } from "@ionic-native/toast";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the EditDeletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "EditDeletePage" })
@Component({
  selector: "page-edit-delete",
  templateUrl: "edit-delete.html"
})
export class EditDeletePage {
  id: any = {};
  type: any = {};
  url: any = {};
  constructor(
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemService: ItemService,
    public apiservice: CommonApiService,
    private toast: Toast
  ) {
    this.id = this.navParams.data.id;
    this.type = this.navParams.data.type;
    console.log(this.type);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EditDeletePage");
  }

  edit() {
    if (this.type == "items") {
      this.navCtrl.push("EditClassifiedsPage", {
        id: this.id,
        type: this.type
      });
    }
    if (this.type == "feeds") {
      this.navCtrl.push("EditForumsPage", {
        id: this.id,
        type: this.type
      });
    }
    if (this.type == "news") {
      this.navCtrl.push("EditForumsPage", {
        id: this.id,
        type: this.type
      });
    }
    if (this.type == "events") {
      this.navCtrl.push("EditEventsPage", {
        id: this.id,
        type: this.type
      });
    }
    if (this.type == "advices") {
      this.navCtrl.push("EditForumsPage", {
        id: this.id,
        type: this.type
      });
    }
    if (this.type == "muscat") {
      this.navCtrl.push("EditForumsPage", {
        id: this.id,
        type: this.type
      });
    }
  }

  delete() {
    if (this.type == "items") {
      this.deleteItem(this.id);
    }
    if (this.type == "feeds") {
      this.url = "feeds";
      this.deleteForum(this.id);
    }
    if (this.type == "news") {
      this.url = "news";
      this.deleteForum(this.id);
    }
    if (this.type == "events") {
      this.deleteEvents(this.id);
    }
    if (this.type == "advices") {
      this.url = "advices-help";
      this.deleteForum(this.id);
    }
    if (this.type == "muscat") {
      this.url = "muscat-living";
      this.deleteForum(this.id);
    }
  }

  deleteItem(id) {
    this.itemService.deleteData("d/" + id).subscribe(res => {
      if (res.status) {
        this.toast
          .show(` classified has been deleted Succesfully.`, "2000", "bottom")
          .subscribe(toast => {
            console.log(toast);
          });
        // setTimeout(() => {
        // this.navCtrl.push(AdsPostedPage);
        // }, 1500);
        this.navCtrl.pop();
      }
    });
  }

  deleteForum(id) {
    this.apiservice
      .deleteData("forum/" + this.url + "/d/" + id)
      .subscribe(res => {
        if (res.status) {
          this.toast
            .show(`  deleted Succesfully.`, "2000", "bottom")
            .subscribe(toast => {
              console.log(toast);
            });
          setTimeout(() => {
            this.navCtrl.push("AdsPostedPage");
          }, 1500);
        }
      });
  }
  deleteEvents(id) {
    this.apiservice.deleteData("forum/events/" + id).subscribe(res => {
      if (res.status) {
        this.toast
          .show(`  deleted Succesfully.`, "2000", "bottom")
          .subscribe(toast => {
            console.log(toast);
          });
        setTimeout(() => {
          this.navCtrl.push("AdsPostedPage");
        }, 1500);
      }
    });
  }
}
