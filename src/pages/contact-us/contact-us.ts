import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ContactUsPage" })
@Component({
  selector: "page-contact-us",
  templateUrl: "contact-us.html"
})
export class ContactUsPage {
  isHide = false;
  input_name = "";
  input_email = "";
  input_phone_number = "";
  input_message = "";
  constructor(
    public globalitems: GlobalItemsProvider,
    public api_service: CommonApiService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ContactUsPage");
  }
  goback() {
    this.navCtrl.pop();
  }
  funClick() {
    if (
      this.iscontain_only_whitespace(this.input_name) ||
      this.iscontain_only_whitespace(this.input_email) ||
      this.iscontain_only_whitespace(this.input_phone_number) ||
      this.iscontain_only_whitespace(this.input_message)
    ) {
      this.globalitems.showToast("Please fill all fields");
    } else {
      this.isHide = true;
      this.globalitems.showLoading("Please wait...");
      let params = {
        name: this.input_name,
        email: this.input_email,
        number: this.input_phone_number,
        message: this.input_message
      };
      this.api_service.postData(params, "contact").subscribe(
        res => {
          console.log(res);
          this.globalitems.dismissLoading();
          // this.globalitems.showToast(res.data.message);
          this.globalitems.showAlert("Done", res.data.message, "success");
          this.isHide = false;
        },
        err => {
          console.log(err);
          this.globalitems.dismissLoading();
          // this.globalitems.showToast("Something went wrong");
          this.globalitems.showAlert("Oops", "Something went wrong", "error");
          this.isHide = false;
        }
      );
    }
  }
  iscontain_only_whitespace(string_val) {
    if (!string_val.replace(/\s/g, "").length) {
      console.log(
        "string only contains whitespace (ie. spaces, tabs or line breaks)"
      );
      return true;
    } else {
      console.log("not contain");
      return false;
    }
  }
}
