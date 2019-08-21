import { ApplicationRef, Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation";
import { Toast } from "@ionic-native/toast";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AppError } from "../../Errors/app-error";
import { BadRequestError } from "../../Errors/bad-request-error";
import { ClassifiedsService } from "../../services/classifieds.service";
import { CommonApiService } from "../../services/common-api.service";
import { UploadService } from "../../services/file-upload.service";
import { ItemService } from "../../services/item.service";
import { StaticSettings } from "../../services/settings.service";
import { UrlUtils } from "../../services/url.service";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { AlertController } from "ionic-angular";

/**
 * Generated class for the PostClassifiedsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "PostClassifiedsPage" })
@Component({
  selector: "page-post-classifieds",
  templateUrl: "post-classifieds.html"
})
export class PostClassifiedsPage implements OnInit {
  showConfirm = false;
  disable = false;
  images: any = [];
  form: FormGroup;
  categroyArray: any = [];
  additionalFields: any = [];
  region: any = {};
  cityData: any = [];
  maxImagesAllowed: any[];
  errors: any = [];
  isShow_price = true;
  public down: boolean = false;
  location_address: "";
  location_lat: "";
  location_lng: "";
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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private cService: CommonApiService,
    private geolocation: Geolocation,
    // private diagnostic: Diagnostic,
    classService: ClassifiedsService,
    private itemService: ItemService,
    private _AppRef: ApplicationRef,
    private urlM: UrlUtils,
    private upload: UploadService,
    private settings: StaticSettings,
    private toast: Toast,
    public global_items: GlobalItemsProvider,
    public alertCtrl: AlertController
  ) {
    this.form = fb.group({
      category_id: ["", Validators.required],
      title: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(70)])
      ],
      price: ["", Validators.compose([Validators.required])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(10)])
      ],
      address: [""],
      region_id: [""],
      city_id: [""],
      // show_mail: [false],
      show_chat: [true],
      show_contact: [true],
      lat: [""],
      long: [""],
      additionalFields: fb.array([])
    });

    // const subscription = this.geolocation
    //   .watchPosition()
    //   .filter(p => p.coords !== undefined) //Filter Out Errors
    //   .subscribe(position => {
    //     console.log(position.coords.longitude + " " + position.coords.latitude);
    //     this.form.patchValue({
    //       lat: position.coords.latitude,
    //       long: position.coords.longitude
    //     });
    //   });
  }
  ngOnInit() {
    this.getCategories();
    this.getRegion();
    // this.location();
    this.getPreferences();
  }
  handleImageChange(arg) {
    console.log(arg);
    this.images = arg;
  }
  getCategories() {
    // categories
    this.cService.get("classifieds/categories").subscribe(res => {
      if (res.status && res.data) {
        this.pushSubcategoriesToArray(res.data);
      }
    });
  }

  getRegion() {
    this.cService.get("region").subscribe(res => {
      if (res.status && res.data) {
        this.region["data"] = res.data;
      }
    });
  }

  getCity(id) {
    console.log(id);
    this.cService.get("city/" + id).subscribe(res => {
      if (res.status && res.data) {
        this.cityData = res.data;
      }
    });
  }

  getPreferences() {
    this.cService.get("item/preferences").subscribe(res => {
      if (res.status) {
        this.maxImagesAllowed = Array(parseInt(res.data.images)).fill(0);
        if (res.data.recaptcha) {
          this.displayReCaptcha();
        } else {
          this.form.removeControl("captcha");
        }
      } else {
        this.maxImagesAllowed = [];
      }
    });
  }
  displayReCaptcha() {
    let doc = <HTMLDivElement>document.body;
    let script = document.createElement("script");
    script.innerHTML = "";
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    doc.appendChild(script);
    console.log(this.form.controls["captcha"]);
  }

  checkReCaptcha(response) {
    console.log(this.form.controls["captcha"]);
    if (response) {
      this.form.controls["captcha"].setValue(response);
    } else {
      this.form.controls["captcha"].reset();
    }

    this._AppRef.tick();
  }

  pushSubcategoriesToArray(data, key = 0, cat_id = null) {
    let temp: any = {};
    temp["data"] = data;
    temp["key"] = key;
    temp["category_id"] = cat_id;
    this.categroyArray.splice(key + 1);
    if (!this.isCategoryExists(cat_id) && data.length) {
      this.categroyArray.push(temp);
    }
  }

  isCategoryExists(id) {
    let found: boolean = false;
    this.categroyArray.forEach(element => {
      if (element.category_id == id) {
        found = true;
      }
    });
    return found;
  }

  chooseCategory(item, key) {
    if (item.s_name == "Jobs") {
      this.isShow_price = false;
    } else {
      this.isShow_price = true;
    }
    console.log(item);
    console.log(item.s_name);
    console.log(key);
    console.log("stuff");
    this.getSubCategories(item.pk_i_id, key);
  }

  getSubCategories(id, key) {
    this.additionalFields = [];
    this.cService.get("subcategory-afields/" + id).subscribe(res => {
      if (res.status && res.data) {
        if (res.data.categories && res.data.categories) {
          this.pushSubcategoriesToArray(res.data.categories, key, id);
        }
        let af = <FormArray>this.form.get("additionalFields");
        af.removeAt(0);
        if (res.data.additionl_fields && res.data.additionl_fields.length) {
          let group = {};
          this.additionalFields = res.data.additionl_fields;
          this.additionalFields.forEach(element => {
            group[element.slug] = element.required
              ? [false, Validators.required]
              : [false];
          });
          af.push(this.fb.group(group));
        }
      }
    });
  }
  private setImageInfo(index, data, status, error) {
    let image = {};
    image["isUploaded"] = status;
    image["isError"] = error;
    if (data && data.s_path) {
      image["path"] = data.s_path;
      image["display"] = this.urlM.getImagePath(data);
    }
    this.images[index] = image;
  }

  imageExists(index) {
    if (this.images[index]) {
      if (this.images[index]["isUploaded"]) {
        return this.images[index].display;
      }
    }
    return false;
  }

  isUploading(index) {
    if (this.images[index]) {
      if (this.images[index].isUploaded == 0) {
        return true;
      }
    }
    return false;
  }
  onImageChange(event, i) {
    let files = event.target.files;
    if (files) {
      this.setImageInfo(i, {}, 0, false);
      this.upload
        .makeFileRequest(
          this.settings.BASE_URL + "/api/v1/ajax-image",
          [],
          files
        )
        .subscribe(
          res => {
            if (res.status) {
              this.setImageInfo(i, res.data, 1, false);
            } else {
              this.setImageInfo(i, {}, 2, true);
            }
          },
          error => {
            this.setImageInfo(i, {}, 2, true);
          }
        );
    }
  }
  isError(index) {
    if (this.images[index]) {
      if (this.images[index].isError) {
        return true;
      }
    }
    return false;
  }

  removeImage(index) {
    this.images.splice(index, 1);
  }

  get aF() {
    return <FormArray>this.form.get("additionalFields");
  }
  postItem(form) {
    console.log(form);
    this.errors = [];
    if (!this.images.length) {
      this.doValidationMessage(["At least one image is required !"]);
    }
    if (this.errors.length < 1 && this.terms_isAccepted == true) {
      // this.loading = true;

      this.disable = true;
      let imageArray: any[] = [];
      this.images.forEach(element => {
        imageArray.push(element.path);
      });
      let data: any = {};
      data = this.form.value;
      Object.assign(data, { location: this.location_address });
      Object.assign(data, { latitude: this.location_lat });
      Object.assign(data, { longitude: this.location_lng });
      data["images"] = imageArray;
      if (data["additionalFields"][0]) {
        data["additionalFields"] = data["additionalFields"].pop();
      }
      this.cService.postData(data, "item/s").subscribe(
        res => {
          if (res.status) {
            this.form.reset();
            this.images = [];
            this.navCtrl.pop().then(() => {
              this.navCtrl.push("PremiumListPage", { data: res.data });
            });
          } else {
            this.global_items
              .showAlert("Failed", "Something went wrong", "error")
              .then(() => {});
            this.disable = false;
          }
        },
        (error: AppError) => {
          // this.loading = false;
          this.disable = false;
          // this.global_items.showToast("Something went wrong");
          this.global_items
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
          } else throw error;
        }
      );
    } else {
      this.global_items.showToast("Something went wrong");
    }
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

  addtionalFieldValidation(index, field) {
    let addT = this.aF;
    return addT.controls[index].get(field).invalid &&
      addT.controls[index].get(field).touched
      ? true
      : false;
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PostClassifiedsPage");
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
