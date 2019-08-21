import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { Storage } from "@ionic/storage";
import { StaticSettings } from "../../services/settings.service";

/**
 * Generated class for the JobAvailableEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "JobAvailableEditPage" })
@Component({
  selector: "page-job-available-edit",
  templateUrl: "job-available-edit.html"
})
export class JobAvailableEditPage {
  user = {
    title: "",
    description: "",
    category_id: "",
    career_level: "",
    employment_type: "",
    location: "",
    email: "",
    experience: "",
    salary: "",
    education: "",
    company_name: "",
    show_company: 1,
    show_contact: 1,
    apply_method: "",
    apply_url: "",
    user_id: "",
    phone: "",
    contact_info: "",
    latitude: "",
    longitude: "",
    images: {},
    is_accepted: 0
  };
  job_params = {};
  terms_isAccepted: boolean = false;
  location_address: "";
  location_lat: "";
  location_lng: "";
  disabled = false;
  errors: any = [];
  images: any[] = [];
  inputImageData: any[] = [];
  public userSettings: any = {
    showRecentSearch: false,
    inputPlaceholderText: this.globalItems.do_translation("Location"),
    showSearchButton: false,
    showCurrentLocation: false,
    geoCountryRestriction: "om",
    inputString: this.navParams.get("data").location
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public apiService: CommonApiService,
    public globalItems: GlobalItemsProvider,
    public settings: StaticSettings
  ) {
    storage.get("id").then(res => {
      console.log("user_id", res);
      this.user.user_id = res;
    });

    this.apiService.get(`job-available/${this.navParams.get("id")}`).subscribe(
      res => {
        if (res.status) {
          this.inputImageData["imageInput"] = res.data.images;
          this.images = res.data.images;
          this.user.title = res.data.title;
          this.user.description = res.data.description;
          this.user.company_name = res.data.company_name;
          this.user.email = res.data.email;
          this.user.contact_info = res.data.contact_info;
          this.user.phone = res.data.phone;
          this.user.apply_url = res.data.apply_url;
          this.user.location = res.data.location;
          this.user.latitude = res.data.latitude;
          this.user.longitude = res.data.longitude;
          this.user.category_id = res.data.category_id;
          this.user.career_level = res.data.career_level_id;
          this.user.employment_type = res.data.employment_type_id;
          this.user.experience = res.data.experience_id;
          this.user.education = res.data.education_id;
          this.user.salary = res.data.salary_id;
          this.user.apply_method = res.data.apply_method;
        }
      },
      err => {}
    );
    console.log(this.inputImageData);
    // this.edit_data = this.navParams.get("data");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad JobWantedAddPage");
    this.get_Job_params();
  }
  get_Job_params() {
    this.apiService.get("job-parameters").subscribe(res => {
      this.job_params = res.data;
      this.get_categories();
    });
  }
  get_categories() {
    this.apiService.get("subcategories", { category_id: "75" }).subscribe(
      res => {
        this.job_params["selectcategory"] = res.data;
      },
      err => {}
    );
  }
  goback() {
    this.navCtrl.pop();
  }
  postItem(data) {
    console.log(data);
  }
  selectType(type, value) {
    console.log("select type:", type, "value", value);
    switch (type) {
      case "selectcategory":
        {
          this.user.category_id = value;
        }

        break;
      case "careerlevel":
        {
          this.user.career_level = value;
        }

        break;
      case "employmentType":
        {
          this.user.employment_type = value;
        }

        break;
      case "workExperience":
        {
          this.user.experience = value;
        }
        break;
      case "educationLevel":
        {
          this.user.education = value;
        }
        break;
      case "monthlySalary":
        {
          this.user.salary = value;
        }
        break;
      case "applicationMethod":
        {
          this.user.apply_method = value;
        }
        break;
      default:
        {
          this.globalItems.showToast("Something went wrong");
          this.navCtrl.pop();
        }
        break;
    }
  }
  autoCompleteCallback1(selectedData: any) {
    //do any necessery stuff.
    if (selectedData.response === true) {
      console.log(selectedData);
      console.log("formatted address", selectedData.data.formatted_address);
      console.log("lat", selectedData.data.geometry.location.lat);
      console.log("lng", selectedData.data.geometry.location.lng);
      // this.location_lat = selectedData.data.geometry.location.lat;
      // this.location_lng = selectedData.data.geometry.location.lng;
      // this.location_address = selectedData.data.formatted_address;
      this.user.latitude = selectedData.data.geometry.location.lat;
      this.user.longitude = selectedData.data.geometry.location.lng;
      this.user.location = selectedData.data.formatted_address;
    } else {
      console.log("location NOt selected");
      this.user.latitude = "";
      this.user.longitude = "";
      this.user.location = "";
    }
  }
  handleImageChange(arg) {
    console.log(arg);
    this.images = arg;
    // this.user.images = arg;
  }
  isAccepted(type, event) {
    console.log(type, "\t", event.checked);
    switch (type) {
      case "show_contact":
        {
          if (event.checked == true) {
            this.user.show_contact = 1;
          } else {
            this.user.show_contact = 0;
          }
        }
        break;
      case "show_company":
        {
          if (event.checked == true) {
            this.user.show_company = 1;
          } else {
            this.user.show_company = 0;
          }
        }
        break;
      case "terms":
        {
          if (event.checked == true) {
            this.user.is_accepted = 1;
          } else {
            this.user.is_accepted = 0;
          }
        }
        break;
      default:
        {
        }
        break;
    }
  }
  goTO_terms() {
    this.navCtrl.push("PrivacyAndPolicyPage");
  }
  post(data) {
    this.images.forEach((element, index) => {
      this.user.images[index] = element.path;
    });
    this.globalItems.showLoading("Please wait...");
    console.log(data);
    this.apiService
      .postData(data, `update/job-available/${this.navParams.get("id")}`)
      .subscribe(
        res => {
          if (res.data) {
            this.globalItems.dismissLoading();
            this.globalItems
              .showAlert("Success", "Success", "success")
              .then(() => {
                this.navCtrl.pop();
              });
          } else {
            this.globalItems.dismissLoading();
            this.globalItems.showAlert("Error", "Failed", "error");
          }
        },
        err => {
          this.globalItems.dismissLoading();
          this.globalItems.showAlert("Error", "Failed", "error");
          console.log("error", err);
        }
      );
  }

  handleImageOnRemove(args) {
    this.delete_img(args);
    // this.deleteResourceOfItem(args);
  }
  delete_img(args) {
    console.log("before splice", this.images);
    let temp = this.images;
    temp.forEach((element, index) => {
      if (element.path == args.path) {
        this.images.splice(index, 1);
      }
    });
    console.log("after splice", this.images);
  }

  // deleteResourceOfItem(resource) {
  //   const params = {
  //     parent_id: this.id,
  //     resource_id: resource.id
  //   };
  //   this.apiservice
  //     .postData(params, "forum/" + this.url + "/" + "im-del")
  //     .subscribe(
  //       res => {
  //         if (!res.status) {
  //           let error = "Error While deleting image";
  //           if (res.error) {
  //             error = res.error;
  //           }
  //           // this.openSnackBar(error);
  //         }
  //       },
  //       error => {
  //         if (error instanceof BadRequestError) {
  //           this.postCheck = false;
  //           if (error.originalError.error.error_message) {
  //             let errors = error.originalError.error.error_message;
  //             // this.openSnackBar(error[0]);
  //           }
  //         } else {
  //           throw error;
  //         }
  //       }
  //     );
  // }
}
