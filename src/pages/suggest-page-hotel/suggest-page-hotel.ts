import { Component } from "@angular/core";
import { Http } from "@angular/http";
import { FCM } from "@ionic-native/fcm";
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
/**
 * Generated class for the SuggestPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { BadRequestError } from "../../Errors/bad-request-error";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { WebService } from "../../services/non-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
/**
 * Generated class for the SuggestPageHotelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "SuggestPageHotelPage" })
@Component({
  selector: "page-suggest-page-hotel",
  templateUrl: "suggest-page-hotel.html"
})
export class SuggestPageHotelPage {
  selected_categories: any[];
  terms_isAccepted: boolean = false;
  disable: boolean = false;
  sample_image = "/assets/images/dummy-image.jpg";
  errors: any = [];
  title: any;
  average_price: any;
  meals: any;
  good_for: any;
  location: any;
  venue: any = "";
  cuisine: any;
  features: any;
  contact_info: any;
  description: any;
  categories: any = [];
  categories_json_list: any = {};
  category_id_array: any = [];
  category_id: any;
  images: any[] = [];
  imagesArray: any[] = [];
  suggest_items: any = {};
  loading;
  location_address: "";
  location_lat: "";
  location_lng: "";
  public userSettings: any = {
    showRecentSearch: false,
    inputPlaceholderText: this.global_items.do_translation("Location"),
    showSearchButton: false,
    showCurrentLocation: false,
    geoCountryRestriction: "om"
    // geoCountryRestriction: ['in'],
    // searchIconUrl: 'http://downloadicons.net/sites/default/files/identification-search-magnifying-glass-icon-73159.png'
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public http: Http,
    public service: DatabasesService,
    public apiService_common: CommonApiService,
    private fcm: FCM,
    public global_items: GlobalItemsProvider,
    private apiservice_webservice: WebService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SuggestPopupPage");
    this.load_to_spinner();
    this.loading = this.loadingCtrl.create({
      spinner: "crescent",
      content: "Please Wait..."
    });
  }
  goback() {
    this.navCtrl.pop();
  }
  choose_categories(event) {
    console.log(event);
    this.selected_categories = [];
    this.selected_categories = event;
    console.log("category" + this.category_id);
  }
  load_to_spinner() {
    this.categories_json_list = {};
    this.apiService_common.get("tourism/hotel-categories").subscribe(res => {
      if (res) {
        this.categories_json_list = res;

        for (let i = 0; i < res.data.length; i++) {
          // console.log("id:" + res.data[i].id + "\n name:" + res.data[i].name);
          this.categories.push(res.data[i].name);
          this.category_id_array.push(res.data[i].id);
        }
        console.dir(this.category_id_array);
      } else {
        this.global_items.showToast("No categories found");
      }
    });
  }
  // showToast(msg: string) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 2000
  //   });
  //   toast.present(toast);
  // }
  submit() {
    this.check_login();
    //this.fetch_values();
  }
  check_login() {
    this.service.getToken().subscribe(
      res => {
        // this.global_items.showToast(res.data);
        if (res) {
          this.apiService_common.get("user/details").subscribe(res => {
            // this.global_items.showToast("done");
            let id = res.data.user.pk_i_id;
            let s_name = res.data.user.s_name;
            let email = res.data.user.pk_i_id;
            let s_phone_mobile = res.data.user.s_phone_mobile;
            this.fetch_values();
          });
          this.fcm.getToken().then(token => {
            if (token) {
              let postParams = {
                fcm_token: token
              };
              this.apiService_common
                .postData(postParams, "fcm")
                .subscribe(res => {
                  console.log(res);
                });
            }
            console.log(token);
          });
        } else {
          this.global_items.showToast("Login first");
        }
      },
      error => {
        this.global_items.showToast("Login first");
      }
    );
  }

  fetch_values() {
    if (
      this.images.length == 0 ||
      this.images.length == null ||
      this.images.length == undefined
    ) {
      this.global_items.showToast("Upload atleast one photo");
    } else {
      this.images.forEach((value, key) => {
        if (value.hasOwnProperty("path")) {
          this.imagesArray.push(value.path);
        } else {
          this.global_items.showToast("Upload atleast one photo");
        }
      });

      if (
        this.title == null ||
        this.title == undefined ||
        // this.average_price == null ||
        // this.average_price == undefined ||
        // this.meals == null ||
        // this.meals == undefined ||
        this.location == null ||
        location == undefined ||
        // this.venue == null ||
        // this.venue == undefined ||
        // this.features == null ||
        // this.features == undefined ||
        // this.contact_info == null ||
        // this.contact_info == undefined ||
        this.description == null ||
        this.description == undefined
        // this.terms_isAccepted == false
      ) {
        this.global_items.showToast("Carefully fill all fields");
      } else if (this.terms_isAccepted) {
        this.global_items.showToast("Please wait");
        // this.disable = true;
        this.json_file_creation();
      } else {
        this.global_items.showToast("Please accept terms and conditions");
      }
    }
    //this.json_file_creation();
  }

  // load_to_spinner() {
  //   this.categories_json_list = {}
  //   this.apiservice_webservice.get("/tourism/restaurant-categories").subscribe(res => {
  //     if (res) {

  //       this.categories_json_list = res;

  //       for (let i = 0; i < res.data.length; i++) {
  //         // console.log("id:" + res.data[i].id + "\n name:" + res.data[i].name);
  //         this.categories.push(res.data[i].name);
  //         this.category_id_array.push(res.data[i].id);
  //       }
  //       console.dir(this.category_id_array);
  //     } else {
  //       this.global_items.showToast("no categories found")
  //     }
  //   });

  // }
  // choose_categories(event) {
  //   console.log("category" + this.category_id);
  // }

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

  json_file_creation() {
    let key: any;
    let value: any;
    // let test_array: any[] = ["Aaa", "bbb", "ccc"]
    this.suggest_items = {
      title: this.title,
      venue: this.venue,
      min_price: this.average_price,
      // "cuisine": this.cuisine,
      breakfast: this.meals,
      features: this.features,
      // "good_for": this.good_for,
      contact_info: this.contact_info,
      location: this.location,
      latitude: this.location_lat,
      longitude: this.location_lng,
      description: this.description,
      images: {},
      categories: {}
    };
    for (let i = 0; i < this.imagesArray.length; i++) {
      key = i;
      value = this.imagesArray[i];
      this.suggest_items.images[key] = value;
    }
    this.selected_categories.forEach((element, index) => {
      this.suggest_items.categories[index] = element;
    });
    // console.log("selected_categories",this.selected_categories);

    console.log("final_array:\n" + this.suggest_items);
    console.dir(this.suggest_items);
    console.log("suggest_items-test");
    this.posting_suggest_values();
  }

  post_suggest(arg) {
    console.log(arg);
    this.images = arg;
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
      this.location = selectedData.data.formatted_address;
    } else {
      console.log("location NOt selected");
      this.location_lat = "";
      this.location_lng = "";
      this.location = "";
    }
  }
  posting_suggest_values() {
    console.log("inside posting method");
    this.loading.present();
    console.log("this.suggest_items", this.suggest_items);
    this.disable = true;
    this.apiService_common
      .postData(this.suggest_items, "tourism/hotels-store")
      .subscribe(
        res => {
          if (res.status) {
            console.log("inside res");
            console.log("suggestion posted successfully");
            this.global_items.showToast("Successfully suggested");
            this.global_items.showToast("Please wait for Admin Approval");
            this.goback();
            this.loading.dismiss();
          }
        },
        error => {
          console.log("inside error");
          this.loading.dismiss();
          this.global_items.showToast("Something went wrong");
          if (error instanceof BadRequestError) {
            if (error.originalError.error.error_message) {
              let errors = error.originalError.error.error_message;
              for (let error in errors) {
                this.doValidationMessage(errors[error]);
              }
            }
          } else {
            throw error;
          }
          this.disable = false;
        }
      );
  }
  doValidationMessage(message) {
    let val = {
      message: message[0],
      error: true
    };
    this.errors.push(val);
  }
}
