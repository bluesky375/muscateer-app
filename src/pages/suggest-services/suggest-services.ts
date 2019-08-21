import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CommonApiService } from "../../services/common-api.service";
import { BadRequestError } from "../../Errors/bad-request-error";
import { DatabasesService } from "../../services/databases.service";
import { FCM } from "@ionic-native/fcm";

/**
 * Generated class for the SuggestServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "SuggestServicesPage"
})
@Component({
  selector: "page-suggest-services",
  templateUrl: "suggest-services.html"
})
export class SuggestServicesPage {
  formData: any = {};
  errors: any = [];
  formCheck;
  images: any[] = [];
  disabled = true;
  form: FormGroup;
  categories_json_list = {};
  categories: any = [];
  category_id_array: any = [];
  category_id: any;
  selected_categories: any[];
  location_address: "";
  location_lat: "";
  location_lng: "";
  terms_isAccepted: boolean = false;
  public userSettings: any = {
    showRecentSearch: false,
    inputPlaceholderText: this.globalItems.do_translation("Location"),
    showSearchButton: false,
    showCurrentLocation: false,
    geoCountryRestriction: "om"
    // geoCountryRestriction: ['in'],
    // searchIconUrl: 'http://downloadicons.net/sites/default/files/identification-search-magnifying-glass-icon-73159.png'
  };
  constructor(
    public service: DatabasesService,
    public globalItems: GlobalItemsProvider,
    public apiService: CommonApiService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _fb: FormBuilder,
    private fcm: FCM
  ) {
    this.form = _fb.group({
      title: ["", Validators.required, Validators.maxLength(70)],
      email: [""],
      phone: [""],
      // alternate_mobile_no: [""],
      website: [""],
      facebook: [""],
      twitter: [""],
      instagram: [""],
      description: [""],
      contact_info: [""]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SuggestServicesPage");
    this.load_to_spinner();
  }

  load_to_spinner() {
    this.categories_json_list = {};
    this.apiService.get("subcategories", { category_id: 5 }).subscribe(res => {
      if (res) {
        this.categories_json_list = res;

        for (let i = 0; i < res.data.length; i++) {
          // console.log("id:" + res.data[i].id + "\n name:" + res.data[i].name);
          this.categories.push(res.data[i].name);
          this.category_id_array.push(res.data[i].pk_i_id);
        }
        console.dir(this.category_id_array);
        console.dir(this.categories_json_list);
      } else {
        this.globalItems.showToast("No categories found");
      }
    });
  }
  goback() {
    this.navCtrl.pop();
  }
  handleImageChange(arg) {
    console.log(arg);
    this.images = arg;
  }
  isTouchedAndInvalid(name: string) {
    return this.form.get(name).invalid && this.form.get(name).touched
      ? true
      : false;
  }
  choose_categories(event) {
    console.log(event);
    console.log(event.length);
    this.selected_categories = [];
    this.selected_categories = event;
    if (event.length == 0) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
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

  goTO_terms() {
    this.navCtrl.push("PrivacyAndPolicyPage");
  }
  postItem(form) {
    this.globalItems.showToast("Please wait...");
    this.setData(form);
    this.check_login();
  }
  check_login() {
    this.service.getToken().subscribe(
      res => {
        // this.global_items.showToast(res.data);
        if (res) {
          this.apiService.get("user/details").subscribe(res => {
            // this.global_items.showToast("done");
            let id = res.data.user.pk_i_id;
            let s_name = res.data.user.s_name;
            let email = res.data.user.pk_i_id;
            let s_phone_mobile = res.data.user.s_phone_mobile;
          });
          this.fcm.getToken().then(token => {
            if (token) {
              let postParams = {
                fcm_token: token
              };
              this.apiService.postData(postParams, "fcm").subscribe(res => {
                console.log(res);
              });
            }
            console.log(token);
            this.do_post();
          });
        } else {
          this.globalItems.showToast("Login first");
          this.globalItems.dismissLoading();
        }
      },
      error => {
        this.globalItems.dismissLoading();
        this.globalItems.showToast("Login first");
      }
    );
  }
  resetData() {
    const arrayControl = <FormArray>this.form.controls["fieldsArray"];
    arrayControl.reset();
  }
  do_post() {
    this.globalItems.showLoading("Please wait...");
    if (this.terms_isAccepted == true) {
      if (
        this.formData["title"] == "" ||
        this.formData["categories"].length == 0 ||
        this.formData["image"].length == 0
      ) {
        this.globalItems.showToast("Please fill all");
        this.globalItems.dismissLoading();
      } else {
        this.disabled = true;
        this.apiService.postData(this.formData, "services-store").subscribe(
          res => {
            if (res.status) {
              this.globalItems
                .showAlert(
                  "Success",
                  "Item has been posted Successfully",
                  "success"
                )
                .then(() => {
                  this.globalItems.dismissLoading();
                  this.navCtrl.pop();
                });
              this.resetData();
            } else if (res.status == false) {
              // this.showToast("Something went wrong");
              this.globalItems
                .showAlert("Failed", "Something went wrong", "error")
                .then(() => {
                  // this.navCtrl.pop();
                });
              this.disabled = false;
              this.globalItems.dismissLoading();
            }
          },
          error => {
            this.globalItems.dismissLoading();
            this.disabled = false;
            // this.showToast("Something went wrong");
            this.globalItems
              .showAlert("Failed", "Something went wrong", "error")
              .then(() => {
                // this.navCtrl.pop();
              });
            if (error instanceof BadRequestError) {
              if (error.originalError.error.error_message) {
                let errors = error.originalError.error.error_message;
                for (let error in errors) {
                  this.doValidationMessage(errors[error]);
                }
              }
            }
          }
        );
      }
    } else {
      this.globalItems.dismissLoading();
      this.globalItems.showToast("Please accept terms and conditions");
    }
  }
  doValidationMessage(message) {
    let val = {
      message: message[0],
      error: true
    };
    this.errors.push(val);
  }
  setData(form) {
    const arrayControl = form;
    this.formCheck = arrayControl;
    this.formData = arrayControl;
    let imagesArray: any[] = [];
    let categories_array: any[] = [];
    this.images.forEach((value, key) => {
      if (value.hasOwnProperty("path")) {
        imagesArray.push(value.path);
      }
    });
    this.selected_categories.forEach((element, index) => {
      categories_array.push(element);
    });
    if (categories_array.length > 0) {
      this.formData["categories"] = categories_array;
    } else {
      this.formData["categories"] = [];
    }
    if (imagesArray) {
      this.formData["image"] = imagesArray;
    } else {
      this.formData["image"] = [];
    }
    this.formData["location"] = this.location_address;
    this.formData["latitude"] = this.location_lat;
    this.formData["longitude"] = this.location_lng;
  }
}
