import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { CommonApiService } from "../../services/common-api.service";

/**
 * Generated class for the JobApplyFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "JobApplyFormPage" })
@Component({
  selector: "page-job-apply-form",
  templateUrl: "job-apply-form.html"
})
export class JobApplyFormPage {
  selected_cv_name = this.do_translation("No file chosen");
  selected_cv_type = "";
  user = {
    name: "",
    gender: "",
    email: "",
    phone: "",
    nationality: "",
    visa_status: "",
    description: "",
    job_id: "",
    resume: ""
  };
  gender_category = [
    { value: 1, name: this.do_translation("Male") },
    { value: 2, name: this.do_translation("Female") },
    { value: 3, name: this.do_translation("Other") }
  ];
  visa_status = [];
  file;
  constructor(
    public global_items: GlobalItemsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public api_service: CommonApiService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad JobApplyFormPage");
    this.user.job_id = this.navParams.get("id");
    this.get_visa_status();
  }
  get_visa_status(): any {
    this.api_service.get("job-parameters").subscribe(
      res => {
        if (res.status) {
          this.visa_status = res.data.visaStatus;
        } else {
          this.global_items.showToast("Something went wrong");
          this.navCtrl.pop();
        }
      },
      err => {
        this.global_items.showToast("Something went wrong");
        this.navCtrl.pop();
        console.log("err>>", err);
      }
    );
  }
  do_translation(value: string) {
    return this.global_items.do_translation(value);
  }
  gender_select(selected_item) {
    console.log("selected:", selected_item);
    this.user.gender = selected_item;
  }
  visa_select(selected_item) {
    console.log("selected:", selected_item);
    this.user.visa_status = selected_item;
  }
  go(value) {
    console.log("value", value);
    if (value == "cancel") {
      this.navCtrl.pop();
    } else if (value == "done") {
      console.log("final data", this.user);
      this.job_apply(this.user);
    } else {
      this.global_items.showToast("Something went wrong");
      this.navCtrl.pop();
    }
  }
  job_apply(data) {
    console.log("done_after validation", data);
    this.global_items.showLoading("Please wait...");
    if (
      this.selected_cv_type == "" ||
      this.selected_cv_type == null ||
      this.selected_cv_type == undefined
    ) {
      this.apply();
    } else {
      //pdf to base64...
      let reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onloadend = () => {
        console.log("onload end");
        // if (this.selected_cv_type.search("/")) {
        //   let temp = this.selected_cv_type.split("/");
        //   this.selected_cv_type = temp[1];
        // }
        let params = { file: reader.result, type: this.selected_cv_type };
        this.api_service.postData(params, "resume-file").subscribe(res => {
          this.user.resume = res.data.resume;
          this.apply();
        });
      };
      reader.onload = () => {
        // console.log(reader.result);
      };
      reader.onerror = error => {
        console.log("Error: ", error);
        this.apply();
      };
      //-------------converted
    }
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
        this.global_items.showToast(
          "Please select document file (pdf,doc or docx)"
        );
      }, 1000);
    }
  }
  apply() {
    let url = "apply-job";
    this.api_service.postData(this.user, url).subscribe(
      res => {
        if (res.data) {
          this.global_items.dismissLoading();
          this.global_items
            .showAlert("Success", "You applied for this job", "success")
            .then(() => {
              this.navCtrl.pop();
            });
        } else {
          this.global_items.dismissLoading();
          this.global_items.showAlert("Oops", "Failed", "error").then(() => {
            this.navCtrl.pop();
          });
        }
      },
      err => {
        console.log("err", err);
        this.global_items.dismissLoading();
        this.global_items.showAlert("Oops", "Failed", "error").then(() => {
          this.navCtrl.pop();
        });
      }
    );
  }
}
