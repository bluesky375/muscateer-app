import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { UrlUtils } from "../../services/url.service";
import { UploadService } from "../../services/file-upload.service";
import { StaticSettings } from "../../services/settings.service";
import { CommonApiService } from "../../services/common-api.service";
import { BadRequestError } from "../../Errors/bad-request-error";
import { Toast } from "@ionic-native/toast";
import { AdsPostedPage } from "../ads-posted/ads-posted";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the EditForumsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "EditForumsPage" })
@Component({
  selector: "page-edit-forums",
  templateUrl: "edit-forums.html"
})
export class EditForumsPage {
  disable = false;
  type: string;
  categoryType: any = {};
  myForm: FormGroup;
  formData: any = {};
  formCheck;
  url: string;
  formStatus = false;
  images: any[] = [];
  brochureImages: any[] = [];
  item: any = {};
  errors: any = [];
  id: number;
  inputImageData: any[] = [];
  postCheck = false;

  constructor(
    private urlM: UrlUtils,
    private upload: UploadService,
    private settings: StaticSettings,
    private _fb: FormBuilder,
    private apiservice: CommonApiService,
    private toast: Toast,
    public toast_ctrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public globalItems: GlobalItemsProvider
  ) {
    this.categoryType["news"] = [
      { type: "TEXT", name: "title", required: true },
      { type: "TEXTAREA", name: "description", required: true }
    ];

    this.categoryType["feeds"] = [
      { type: "TEXT", name: "title", required: true },
      { type: "TEXTAREA", name: "description", required: true }
    ];
    this.categoryType["relax"] = [
      { type: "TEXT", name: "title", required: true },
      { type: "TEXTAREA", name: "description", required: true }
    ];
    this.categoryType["advices"] = [
      { type: "TEXT", name: "title", required: true },
      { type: "TEXTAREA", name: "description", required: true }
    ];

    this.categoryType["muscat"] = [
      { type: "TEXT", name: "title", required: true },
      { type: "TEXTAREA", name: "description", required: true }
    ];

    this.id = this.navParams.get("id");
    this.type = this.navParams.get("type");

    this.myForm = this._fb.group({
      fieldsArray: this._fb.array([])
    });
  }

  ngOnInit() {
    // window.scrollTo(0, 0);
    this.formType();
    this.getData();
  }

  formType() {
    this.clearFormArray();
    const arrayControl = <FormArray>this.myForm.controls["fieldsArray"];
    let items = {};
    this.categoryType[this.type].forEach(item => {
      items[item["name"]] = item.required ? ["", Validators.required] : [""];
    });
    arrayControl.push(this._fb.group(items));
  }

  clearFormArray() {
    this.myForm.controls["fieldsArray"] = this._fb.array([]);
  }

  postType() {
    switch (this.type) {
      case "news":
        this.url = "news";
        break;
      case "advices":
        this.url = "advices-help";
        break;
      case "feeds":
        this.url = "feeds"; // feed is muscateer pets
        break;
      case "muscat":
        this.url = "muscat-living";
        break;
      case "relax":
        this.url = "relax";
        break;
      case "events":
        this.url = "events";
        break;
    }
  }

  setData() {
    const arrayControl = <FormArray>this.myForm.controls["fieldsArray"];
    this.formCheck = arrayControl;
    this.formData = arrayControl.value[0];
    let imagesArray: any[] = [];
    let brochure: any[] = [];
    this.images.forEach((value, key) => {
      if (value.hasOwnProperty("path")) {
        imagesArray.push({ path: value.path, id: value.id ? value.id : "" });
      }
    });
    this.brochureImages.forEach((value, key) => {
      if (value.hasOwnProperty("path")) {
        brochure.push({ path: value.path, id: value.id ? value.id : "" });
      }
    });
    if (brochure) {
      this.formData["brochureImage"] = brochure;
    }
    if (imagesArray) {
      this.formData["image"] = imagesArray;
    }
    console.log(this.formData);
  }
  // showToast(msg: string) {
  //   let toast = this.toast_ctrl.create({
  //     message: msg,
  //     duration: 2000
  //   });
  //   toast.present(toast);
  // }
  postData() {
    this.disable = true;
    this.setData();
    this.postType();

    this.postCheck = true;
    if (this.formCheck.valid) {
      this.apiservice
        .updateData(this.formData, "forum/" + this.url + "/u/" + this.id)
        .subscribe(
          res => {
            if (res.status) {
              // this.toast
              //   .show(` updated Succesfully.`, "2000", "bottom")
              //   .subscribe(toast => {
              //     console.log(toast);
              //   });
              // setTimeout(() => {
              //   // this.navCtrl.push(AdsPostedPage);
              //   this.navCtrl.pop();
              // }, 1500);
              this.globalItems
                .showAlert(
                  "Success",
                  "Item has been posted Successfully",
                  "success"
                )
                .then(() => {
                  this.navCtrl.pop();
                });
              this.disable = false;
            } else {
              this.disable = false;
              if (res.hasOwnProperty("error")) {
                // this.openSnackBar(res.error);
                // this.showToast("Something went wrong");
                this.globalItems
                  .showAlert("Failed", "Something went wrong", "error")
                  .then(() => {
                    // this.navCtrl.pop();
                  });
              }
            }
            this.postCheck = false;
          },
          error => {
            // this.showToast("Something went wrong");
            this.globalItems
              .showAlert("Failed", "Something went wrong", "error")
              .then(() => {
                // this.navCtrl.pop();
              });
            this.disable = false;
            if (error instanceof BadRequestError) {
              this.postCheck = false;
              if (error.originalError.error.error_message) {
                let errors = error.originalError.error.error_message;
                for (let error in errors) {
                  this.doValidationMessage(errors[error]);
                }
              }
            } else {
              throw error;
            }
          }
        );
      this.formStatus = false;
    } else {
      this.formStatus = true;
    }
  }

  doValidationMessage(message) {
    let val = { message: message[0], error: true };
    this.errors.push(val);
  }

  getData() {
    const arrayControl = <FormArray>this.myForm.controls["fieldsArray"];
    const control = arrayControl["controls"][0]["controls"];
    this.postType();
    this.apiservice.get("forum/" + this.url + "/" + this.id).subscribe(
      res => {
        if (res.status) {
          let data = res.data;
          if (data.images) {
            this.inputImageData["imageInput"] = data.images;
            this.images = data.images;
          }
          if (data.brochure_images) {
            this.inputImageData["brochureImageInput"] = data.brochure_images;
            this.brochureImages = data.brochure_images;
          }
          this.item["s_path"] = res.data.image;
          let arrayFields = {};
          for (let item in data) {
            switch (item) {
              case "title":
                control[item].patchValue(data[item]);
                break;
              case "description":
                control[item].patchValue(data[item]);
                break;
              case "venue":
                control[item].patchValue(data[item]);
                break;
              case "promotion":
                control[item].patchValue(data[item]);
                break;
              case "location_url":
                control[item].patchValue(data[item]);
                break;
              case "event_date":
                control["date"].patchValue(data[item]);
                break;
              default:
                break;
            }
          }
        } else {
          this.globalItems.showToast("Something went wrong");
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }

  get fields() {
    return <FormArray>this.myForm.get("fieldsArray");
  }

  handleImageChange(arg) {
    this.images = arg;
  }

  handleBrochureImage(args) {
    this.brochureImages = args;
  }

  isPromotion() {
    let promo = this.fields.controls[0];
    return promo.get("promotion").value;
  }

  handleImageOnRemove(args) {
    this.deleteResourceOfItem(args);
  }

  deleteResourceOfItem(resource) {
    const params = {
      parent_id: this.id,
      resource_id: resource.id
    };
    this.apiservice
      .postData(params, "forum/" + this.url + "/" + "im-del")
      .subscribe(
        res => {
          if (!res.status) {
            let error = "Error While deleting image";
            if (res.error) {
              error = res.error;
            }
            // this.openSnackBar(error);
          }
        },
        error => {
          if (error instanceof BadRequestError) {
            this.postCheck = false;
            if (error.originalError.error.error_message) {
              let errors = error.originalError.error.error_message;
              // this.openSnackBar(error[0]);
            }
          } else {
            throw error;
          }
        }
      );
  }

  goback() {
    this.navCtrl.pop();
  }
}
