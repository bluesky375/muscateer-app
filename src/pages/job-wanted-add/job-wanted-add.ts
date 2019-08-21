import { IonicPage, NavController, NavParams } from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { Storage } from "@ionic/storage";
import { Component } from "@angular/core";
@IonicPage({
  name: "JobWantedAddPage"
})
@Component({
  selector: "page-job-wanted-add",
  templateUrl: "job-wanted-add.html"
})
export class JobWantedAddPage {
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
    is_accepted: 0,
    resume: ""
  };
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
    geoCountryRestriction: "om"
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

  post(data) {
    console.log("done_after validation", data);
    this.globalItems.showLoading("Please wait...");
    if (
      this.selected_cv_type == "" ||
      this.selected_cv_type == null ||
      this.selected_cv_type == undefined
    ) {
      console.log("inside if");
      this.post_(data);
    } else {
      console.log("inside elese");

      //pdf to base64...'
      let reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onloadend = () => {
        console.log("onloadend");
        let params = { file: reader.result, type: this.selected_cv_type };
        this.apiService.postData(params, "resume-file").subscribe(res => {
          this.user.resume = res.data.resume;
          this.post_(data);
        });
      };
      reader.onload = res => {
        // console.log(reader.result);
        console.log("onload", res);
      };
      reader.onerror = error => {
        console.log("Error: ", error);
        this.post_(data);
      };
      //-------------converted
    }
  }

  post_(data) {
    this.images.forEach((element, index) => {
      this.user.images[index] = element.path;
    });
    console.log("images", this.user.images);
    // this.globalItems.showLoading("Please wait...");
    console.log(data);
    this.apiService.postData(data, "job-wanted-store").subscribe(
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
}
