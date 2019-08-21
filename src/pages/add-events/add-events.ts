import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Toast } from "@ionic-native/toast";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { BadRequestError } from "../../Errors/bad-request-error";
import { CommonApiService } from "../../services/common-api.service";
import { UploadService } from "../../services/file-upload.service";
import { StaticSettings } from "../../services/settings.service";
import { FileChooser } from "@ionic-native/file-chooser";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";
import { IOSFilePicker } from "@ionic-native/file-picker";
@IonicPage({ name: "AddEventsPage" })
@Component({
  selector: "page-add-events",
  templateUrl: "add-events.html"
})
export class AddEventsPage {
  disabled = false;
  form: FormGroup;
  errors: any = [];
  image: any = {};
  images: any[] = [];
  formData: any = {};
  brochureImages: any;
  formCheck;
  pdf_url = "pdf url";
  location_address: "";
  location_lat: "";
  location_lng: "";
  terms_isAccepted: boolean = false;
  categories_json_list: any = {};
  category_id: any;
  selected_categories: any[];
  categories: any = [];
  category_id_array: any = [];
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
    public globalItems: GlobalItemsProvider,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _fb: FormBuilder,
    private settings: StaticSettings,
    private upload: UploadService,
    public apiService: CommonApiService,
    private toast: Toast,
    private fileChooser: FileChooser,
    private filePicker: IOSFilePicker,
    private global_items: GlobalItemsProvider
  ) {
    this.form = _fb.group({
      title: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(70)])
      ],
      description: ["", Validators.compose([Validators.required])],
      venue: ["", Validators.required],
      // date: ["", Validators.required],
      // end_date: ["", Validators.required],
      start_date: ["", Validators.required],
      end_date: ["", Validators.required],
      brochureImage: [""],
      promotion: [false]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddEventsPage");
    this.load_to_spinner();
  }
  choose_categories(event) {
    console.log(event);
    this.selected_categories = [];
    this.selected_categories = event;
  }
  load_to_spinner() {
    this.categories_json_list = {};
    this.apiService.get("event-categories").subscribe(res => {
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
  setData(form) {
    const arrayControl = form;
    this.formCheck = arrayControl;
    this.formData = arrayControl;
    this.formData["brochureImage"] = this.pdf_url;
    let imagesArray: any[] = [];
    let categories_array: any[] = [];
    let brochure: any[] = [];
    this.images.forEach((value, key) => {
      if (value.hasOwnProperty("path")) {
        imagesArray.push(value.path);
      }
    });
    this.selected_categories.forEach((element, index) => {
      // this.suggest_items.categories[index] = element;
      categories_array.push(element);
    });
    if (categories_array.length > 0) {
      this.formData["categories"] = categories_array;
    }
    if (imagesArray) {
      this.formData["image"] = imagesArray;
    } else {
      this.formData["image"] = "no_image";
    }
    this.formData["location"] = this.location_address;
    this.formData["latitude"] = this.location_lat;
    this.formData["longitude"] = this.location_lng;
    // this.brochureImages.forEach((value, key) => {
    //   if (value.hasOwnProperty("path")) {
    //     brochure.push(value.path);
    //   }
    // });
    // if (brochure) {
    //   this.formData["brochureImage"] = brochure;
    // }
    // if (imagesArray) {
    //   this.formData["image"] = imagesArray;
    // }
  }

  postItem(form) {
    console.log("form_values");

    console.log(form);
    this.setData(form);
    if (this.terms_isAccepted == true) {
      this.disabled = true;
      this.apiService.postData(this.formData, "events/store").subscribe(
        res => {
          if (res.status) {
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
          } else if (res.status == false) {
            // this.showToast("Something went wrong");
            this.globalItems
              .showAlert("Failed", "Something went wrong", "error")
              .then(() => {
                // this.navCtrl.pop();
              });
            this.disabled = false;
          }
        },
        error => {
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
    } else {
      this.globalItems.showToast("Please accept terms and conditions");
    }
  }

  getImage(event) {
    let files = event.srcElement.files;
    this.setImage(0, false);
    if (files) {
      this.upload
        .makeFileRequest(
          this.settings.BASE_URL + "/api/v1/ajax-image",
          [],
          files
        )
        .subscribe(
          res => {
            if (res.status) {
              this.setImage(1, false, res.data);
            } else {
              this.setImage(2, true);
            }
          },
          error => {
            this.setImage(2, true);
            this.globalItems.showToast("Something went wrong");
          }
        );
    }
  }

  setImage(status, error, data?) {
    this.image["isUploaded"] = status;
    this.image["isError"] = error;
    if (data && data.s_path) {
      this.image["path"] = data.s_path;
      this.image["display"] = this.settings.IMAGE_URL + data.s_path;
    } else {
      this.globalItems.showToast("Something went wrong");
    }
  }
  handleImageChange(arg) {
    console.log(arg);
    this.images = arg;
  }

  handleBrochureImage(args) {
    console.log(args);
    this.brochureImages = args;
  }

  resetData() {
    const arrayControl = <FormArray>this.form.controls["fieldsArray"];
    arrayControl.reset();
  }

  imageExists() {
    if (this.image["isUploaded"] == 1) {
      return this.image["display"];
    }
    return (this.image["display"] = this.settings.ITEM_DUMMY_IMAGE);
  }

  isUploading() {
    if (this.image["isUploaded"] == 0) {
      return true;
    }
    return false;
  }

  isError() {
    if (this.image["isError"]) {
      return true;
    }
    return false;
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

  isPromotion() {
    let val = this.form.controls["promotion"].value;
    return val;
  }

  goback() {
    this.navCtrl.pop();
  }
  // showToast(msg: string) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 2000
  //   });
  //   toast.present(toast);
  // }
  upload_pdf() {
    try {
      this.fileChooser
        .open()
        .then(uri => {
          console.log(uri);
          this.pdf_url = uri;
        })
        .catch(e => console.log("error file chooser android:->", e));
    } catch (e) {
      console.log(e);
    }
    try {
      this.filePicker
        .pickFile()
        .then(uri => {
          console.log(uri);
          this.pdf_url = uri;
        })
        .catch(err => console.log("Error file picker ios:->", err));
    } catch (error) {
      console.log(error);
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
}
