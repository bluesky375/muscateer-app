import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the JobWantedEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "JobWantedEditPage" })
@Component({
  selector: "page-job-wanted-edit",
  templateUrl: "job-wanted-edit.html"
})
export class JobWantedEditPage {
  selected_cv_name = this.globalItems.do_translation("No file chosen");
  selected_cv_type = "";
  file;
  user = {
    name: "",
    email: "",
    phone: "",
    gender: "",
    visa_status: "",
    nationality: "",
    title: "",
    description: "",
    category_id: "",
    career_level: "",
    employment_type: "",
    location: "",
    experience: "",
    salary: "",
    education: "",
    user_id: "",
    contact_info: "",
    latitude: "",
    longitude: "",
    images: {},
    is_accepted: 0
    // resume: ""
  };
  inputImageData: any[] = [];
  job_params = {};
  terms_isAccepted: boolean = false;
  location_address: "";
  location_lat: "";
  location_lng: "";
  disabled = false;
  errors: any = [];
  images: any[] = [];
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
    public globalItems: GlobalItemsProvider
  ) {
    storage.get("id").then(res => {
      console.log("user_id", res);
      this.user.user_id = res;
    });

    this.apiService.get(`job-wanted/${this.navParams.get("id")}`).subscribe(
      res => {
        if (res.status) {
          // Object.assign(this.userSettings, {
          //   inputString: res.data["location"]
          // });
          this.inputImageData["imageInput"] = res.data.images;
          this.images = res.data.images;
          this.user.nationality = res.data.nationality;
          this.user.gender = res.data.gender;
          this.user.visa_status = res.data.visa_status;
          this.user.title = res.data.title;
          this.user.description = res.data.description;
          this.user.email = res.data.email;
          this.user.contact_info = res.data.contact_info;
          this.user.phone = res.data.phone;
          this.user.name = res.data.name;
          this.user.location = res.data.location;
          this.user.latitude = res.data.latitude;
          this.user.longitude = res.data.longitude;
          this.user.category_id = res.data.category_id;
          this.user.career_level = res.data.career_level_id;
          this.user.employment_type = res.data.employment_type_id;
          this.user.experience = res.data.experience_id;
          this.user.education = res.data.education_id;
          this.user.salary = res.data.salary_id;
          console.log(this.userSettings);
        }
      },
      err => {}
    );
    console.log(this.inputImageData);

    // this.user.apply_method = this.edit_data["apply_method"];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad JobWantedAddPage");
    this.get_Job_params();
  }
  get_Job_params() {
    this.apiService.get("job-parameters").subscribe(res => {
      this.job_params = res.data;
      this.get_gender();
    });
  }
  get_gender() {
    this.job_params["gender"] = [
      { value: 1, name: this.globalItems.do_translation("Male") },
      { value: 2, name: this.globalItems.do_translation("Female") },
      { value: 3, name: this.globalItems.do_translation("Other") }
    ];
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
      case "visaStatus":
        {
          this.user.visa_status = value;
        }
        break;
      case "gender":
        {
          this.user.gender = value;
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

  // post(data) {
  //   console.log("done_after validation", data);
  //   this.globalItems.showLoading("Please wait...");
  //   if (
  //     this.selected_cv_type == "" ||
  //     this.selected_cv_type == null ||
  //     this.selected_cv_type == undefined
  //   ) {
  //     console.log("inside if");
  //     this.post_(data);
  //   } else {
  //     console.log("inside elese");

  //     //pdf to base64...'
  //     let reader = new FileReader();
  //     reader.readAsDataURL(this.file);
  //     reader.onloadend = () => {
  //       console.log("onloadend");
  //       let params = { file: reader.result, type: this.selected_cv_type };
  //       this.apiService.postData(params, "resume-file").subscribe(res => {
  //         this.user.resume = res.data.resume;
  //         this.post_(data);
  //       });
  //     };
  //     reader.onload = res => {
  //       // console.log(reader.result);
  //       console.log("onload", res);
  //     };
  //     reader.onerror = error => {
  //       console.log("Error: ", error);
  //       this.post_(data);
  //     };
  //     //-------------converted
  //   }
  // }

  post(data) {
    this.images.forEach((element, index) => {
      this.user.images[index] = element.path;
    });
    console.log("images", this.user.images);
    this.globalItems.showLoading("Please wait...");
    console.log(data);
    this.apiService
      .postData(data, `update/job-wanted/${this.navParams.get("id")}`)
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
  changeListener(event) {
    console.log("file fetched", event.target.files[0]);
    this.file = event.target.files[0];
    this.selected_cv_name = event.target.files[0].name;
    this.selected_cv_type = event.target.files[0].type;
    console.log("cv name", this.selected_cv_name);
    let temp: string = this.selected_cv_name;
    if (
      temp.includes(".pdf") ||
      temp.includes(".doc") ||
      temp.includes(".docx")
    ) {
      this.selected_cv_name = event.target.files[0].name;
      if (temp.includes(".pdf")) {
        this.selected_cv_type = "pdf";
      } else if (temp.includes(".doc")) {
        this.selected_cv_type = "doc";
      } else if (temp.includes(".docx")) {
        this.selected_cv_type = "docx";
      } else {
        this.selected_cv_type = "";
      }
      // this.selected_cv_type = event.target.files[0].type;
    } else {
      this.selected_cv_name = "";
      this.selected_cv_type = "";
      setTimeout(() => {
        this.globalItems.showToast(
          "Please select document file (pdf,doc or docx)"
        );
      }, 1000);
    }
  }
  handleImageOnRemove(args) {
    console.log(args);
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
