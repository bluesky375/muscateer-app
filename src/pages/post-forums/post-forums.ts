import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { StaticSettings } from "../../services/settings.service";
import { CommonApiService } from "../../services/common-api.service";
import { UploadService } from "../../services/file-upload.service";
import { BadRequestError } from "../../Errors/bad-request-error";
import { Toast } from "@ionic-native/toast";
import { ToastController } from "ionic-angular";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { Platform } from "ionic-angular/platform/platform";
/**
 * Generated class for the PostForumsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "PostForumsPage" })
@Component({
  selector: "page-post-forums",
  templateUrl: "post-forums.html"
})
export class PostForumsPage {
  terms_isAccepted: boolean = false;
  disabled = false;
  form: FormGroup;
  errors: any = [];
  images: any[] = [];
  category: any = {};
  formData: any = {};
  categoryOption: any = {};
  url: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _fb: FormBuilder,
    private settings: StaticSettings,
    private upload: UploadService,
    public apiService: CommonApiService,
    private toast: Toast,
    public toastctrl: ToastController,
    public globalItems: GlobalItemsProvider,
    public platform: Platform
  ) {
    this.form = _fb.group({
      title: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(70)])
      ],
      description: ["", Validators.compose([Validators.required])]
    });

    this.categoryOption = [
      {
        value: "0",
        name: "Muscateer Pets"
      },
      {
        value: "1",
        name: "News & Feeds"
      },
      {
        value: "2",
        name: "Advice & Help"
      },
      {
        value: "3",
        name: "Muscat Foodies"
      },
      {
        value: "4",
        name: "Relax Lounge"
      }
    ];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddEventsPage");
  }

  selectType(type) {
    let cat = type.value;
    if (cat == 0) {
      this.url = "feeds/s";
    }
    if (cat == 1) {
      this.url = "news/s";
    }
    if (cat == 2) {
      this.url = "advices-help/s";
    }
    if (cat == 3) {
      this.url = "muscat-living/s";
    }
    if (cat == 4) {
      this.url = "relax/s";
    }
  }

  setData(form) {
    this.formData = form;
    let imagesArray: any[] = [];
    this.images.forEach((value, key) => {
      if (value.hasOwnProperty("path")) {
        imagesArray.push(value.path);
      }
    });
    if (imagesArray) {
      this.formData["image"] = imagesArray;
    }
  }

  handleImageChange(arg) {
    console.log(arg);
    this.images = arg;
  }
  // showToast(msg: string) {
  //   let toast = this.toastctrl.create({
  //     message: msg,
  //     duration: 2000
  //   });
  //   toast.present(toast);
  // }
  postItem(form) {
    this.setData(form);
    // if (this.image['path']) {
    //   this.formData['image'] = this.image['path'];
    // }
    if (this.terms_isAccepted == true) {
      this.disabled = true;
      console.log("post/form data", this.formData);

      this.apiService.postData(this.formData, "forum/" + this.url).subscribe(
        res => {
          if (res.status) {
            // this.toast
            //   .show(` Item has been posted Succesfully..`, "2000", "center")
            //   .subscribe(toast => {
            //     console.log(toast);
            //   });
            // setTimeout(() => {
            //   // this.navCtrl.setRoot(ClassifiedsAddListPage);
            //   this.navCtrl.pop();
            // }, 2000);
            this.globalItems
              .showAlert(
                "Success",
                "Item has been posted Successfully",
                "success"
              )
              .then(() => {
                this.navCtrl.pop();
              });

            this.resetData();
          } else {
            this.globalItems
              .showAlert("Failed", "Something went wrong", "error")
              .then(() => {
                // this.navCtrl.pop();
              });
            // this.showToast("Something went wrong");
            this.disabled = false;
          }
        },
        error => {
          // this.showToast("Something went wrong");
          this.globalItems
            .showAlert("Failed", "Something went wrong", "error")
            .then(() => {
              // this.navCtrl.pop();
            });
          this.disabled = false;
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
    } else {
      this.globalItems.showToast("Please accept terms and conditions");
    }
  }

  resetData() {
    const arrayControl = <FormArray>this.form.controls["fieldsArray"];
    arrayControl.reset();
  }

  doValidationMessage(message) {
    let val = {
      message: message[0],
      error: true
    };
    this.errors.push(val);
  }

  isTouchedAndInvalid(name: string) {
    return this.form.get(name).invalid && this.form.get(name).touched
      ? true
      : false;
  }

  goback() {
    this.navCtrl.pop();
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
}
