import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AppError } from "../../Errors/app-error";
import { BadRequestError } from "../../Errors/bad-request-error";
import { CommonApiService } from "../../services/common-api.service";
import { OtpPage } from "../otp/otp";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "RegisterPage" })
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage implements OnInit {
  terms_isAccepted: boolean = false;
  public userSettings: any = {
    showRecentSearch: false,
    inputPlaceholderText: this.global_items.do_translation("Location"),
    showSearchButton: false,
    showCurrentLocation: false,
    geoCountryRestriction: "om"
    // geoCountryRestriction: ['in'],
    // searchIconUrl: 'http://downloadicons.net/sites/default/files/identification-search-magnifying-glass-icon-73159.png'
  };
  form: FormGroup;
  region: any = {};
  pass_miss: boolean = false;
  errors: any = [];
  location_address: "";
  location_lat: "";
  location_lng: "";
  loading = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _fb: FormBuilder,
    private cService: CommonApiService,
    public global_items: GlobalItemsProvider
  ) {
    this.form = _fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(70)])
      ],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required],
      password_confirmation: ["", Validators.required],
      number: ["", Validators.required]
      // region_id: [0]
    });
  }

  ngOnInit() {
    // this.getRegion();
  }

  getRegion() {
    this.cService.get("region").subscribe(res => {
      if (res.status) {
        this.region["data"] = res.data;
        this.region["selectedRegion"] = "Choose region";
      }
    });
  }
  postItem_() {
    this.navCtrl.push("OtpPage", {
      otp: 1233,
      user_info: "saacsdcsdc",
      number: "12345678"
    });
  }
  autoCompleteCallback1(selectedData: any) {
    //do any necessery stuff.
    if (selectedData.response === true) {
      console.log(selectedData);
      console.log("formatted address", selectedData.data.formatted_address);
      console.log("lat", selectedData.data.geometry.location.lat);
      console.log("lng", selectedData.data.geometry.location.lng);
      this.location_lat = selectedData.data.geometry.location.lat;
      this.location_lng = selectedData.data.geometry.location.lng;
      this.location_address = selectedData.data.formatted_address;
    } else {
      console.log("location NOt selected");
      this.location_lat = "";
      this.location_lng = "";
      this.location_address = "";
    }
  }
  isAccepted(event) {
    console.log(event);
    console.log(event.checked);
    if (event.checked == true) {
      this.terms_isAccepted = true;
    } else {
      this.terms_isAccepted = false;
    }
  }
  postItem(form) {
    let data: any = {};
    data = this.form.value;
    var pass = this.form.value.password;
    var conf = this.form.value.password_confirmation;
    console.log(pass);
    console.log(conf);
    var number = this.form.value.number;
    if (this.terms_isAccepted == true) {
      if (pass === conf && this.location_address != "") {
        this.global_items.showLoading("Please wait...");
        this.loading = true;
        Object.assign(data, { address: this.location_address });
        Object.assign(data, { latitude: this.location_lat });
        Object.assign(data, { longitude: this.location_lng });
        console.log(data);

        this.cService.postData(data, "register").subscribe(
          res => {
            console.log("api response is");

            console.log(res);
            if (res.status == true) {
              console.log("otp");
              let user_info = res.data.user_info;
              let otp = res.data.otp;
              console.log(otp);
              console.log(user_info);
              console.log(number);
              this.global_items.loading.dismiss();
              this.loading = true;
              this.global_items
                .showAlert("Success", res.data.message, "success")
                .then(() => {
                  this.navCtrl.push("OtpPage", {
                    otp: otp,
                    user_info: user_info,
                    number: number
                  });
                });
            } else {
              this.global_items.loading.dismiss();
              this.loading = false;
              this.global_items.showAlert(
                "Error",
                "Something went wrong",
                "error"
              );
            }
          },
          (error: AppError) => {
            this.global_items.loading.dismiss();
            this.loading = false;
            let error_msg = "";
            this.errors = [];
            if (error instanceof BadRequestError) {
              if (error.originalError.error.error_message) {
                let errors = error.originalError.error.error_message;
                for (let error in errors) {
                  this.doValidationMessage(errors[error]);
                  console.log(errors);
                  // error_msg=error_msg+"\n"+errors+"\n"
                }
                // this.global_items.showToast(error_msg)
              }
            } else throw error;
          }
        );
      } else {
        console.log("false");
        this.pass_miss = true;
        this.global_items.showToast("Something went wrong");
      }
    } else {
      this.global_items.showToast("Please accept the agreement");
    }
  }

  doValidationMessage(message) {
    let val = { message: message[0], error: true };
    this.errors.push(val);
  }

  isvalid(name: string) {
    return this.form.get(name).invalid && this.form.get(name).touched;
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }
  goTO_terms() {
    this.navCtrl.push("PrivacyAndPolicyPage");
  }
}
