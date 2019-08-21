import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { LoginPage } from "../login/login";
import { AppError } from "../../Errors/app-error";
import { BadRequestError } from "../../Errors/bad-request-error";

/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "OtpPage" })
@Component({
  selector: "page-otp",
  templateUrl: "otp.html"
})
export class OtpPage {
  errors: any = [];
  public user_info;
  public number;
  show_resend_btn = false;
  // public otp_text: any = {};
  // OTP = "";

  constructor(
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: CommonApiService
  ) {
    this.user_info = navParams.get("user_info");
    this.number = navParams.get("number");
    // this.otp_text = navParams.get("otp");
    // console.log(this.otp_text);
    this.otp_timeout();
  }
  otp_timeout() {
    setTimeout(() => {
      this.show_resend_btn = true;
    }, 60000);
  }
  resendOtp() {
    let phnumber = this.number;
    this.global_items.showLoading("Otp resending...");
    console.log(phnumber);
    let postParams = {
      number: phnumber
      // user_id: this.user_info
    };
    this.service.postData(postParams, "resend").subscribe(
      res => {
        console.log("otp resend res");
        console.log(res);
        this.global_items.dismissLoading();
        this.show_resend_btn = false;
        this.otp_timeout();
      },
      err => {
        this.show_resend_btn = true;
        this.global_items.dismissLoading();
        console.log("otp resend error", err);
        this.global_items.showToast("Something went wrong");
      }
    );
  }
  otp(otp_) {
    this.global_items.showLoading("Please wait...");
    console.log("input otp" + otp_);
    let postParams = {
      number: this.number,
      user_id: this.user_info,
      otp: otp_
    };
    this.service.postData(postParams, "verify").subscribe(
      res => {
        console.log("otp response");
        console.log(res);
        if (res.status == true) {
          // this.global_items.showAlert("Success", res.data.message, "success");
          this.global_items.showAlert(
            "Success",
            "OTP has been send to registered mobile number",
            "success"
          );
          this.navCtrl.setRoot(LoginPage);
        } else {
          this.global_items.showToast("Invalid OTP");
        }
      },
      (error: AppError) => {
        if (error instanceof BadRequestError) {
          if (error.originalError.error.message) {
            this.errors = error.originalError.error.message;
            console.log(this.errors);
          }
        } else throw error;
      }
    );
    this.global_items.loading.dismiss();
  }

  doValidationMessage(message) {
    let val = { message: message[0], error: true };
    this.errors.push(val);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OtpPage");
  }
}
