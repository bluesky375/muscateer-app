import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the NewEditEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "NewEditEventPage"
})
@Component({
  selector: "page-new-edit-event",
  templateUrl: "new-edit-event.html"
})
export class NewEditEventPage {
  id: any;
  type: any;
  test_item = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiservice: CommonApiService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad NewEditEventPage");
    this.id = this.navParams.get("id");
    this.type = this.navParams.get("type");
    // this.fun_get(this.id, this.type);
    this.apiservice.get("forum/events/66").subscribe(
      res => {
        // this.test_item = res.data.description;
        this.test_item = "This is\n" + "a multiline\n" + "string";
      },
      err => {
        console.log("error");
        console.log(err);
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }
  fun_get(id, type) {
    try {
      this.apiservice.get("forum/events" + "/" + id).subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log("catch error is ");
      console.log(error);
    }
  }
}
