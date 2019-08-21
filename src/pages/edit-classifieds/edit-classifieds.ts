import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Validators, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { BadRequestError } from "../../Errors/bad-request-error";
import { AppError } from "../../Errors/app-error";
import { UploadService } from "../../services/file-upload.service";
import { StaticSettings } from "../../services/settings.service";
import { UrlUtils } from "../../services/url.service";
import { CommonApiService } from "../../services/common-api.service";
import { ItemService } from "../../services/item.service";
import { Toast } from "@ionic-native/toast";
import { AdsPostedPage } from "../ads-posted/ads-posted";

/**
 * Generated class for the EditClassifiedsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "EditClassifiedsPage" })
@Component({
  selector: "page-edit-classifieds",
  templateUrl: "edit-classifieds.html"
})
export class EditClassifiedsPage implements OnInit {
  disable = false;
  images: any = [];
  formFields: any = {};
  maxImagesAllowed: any = [];
  categroyArray: any = [];
  region: any = {};
  form: FormGroup;
  additionalFields: any = [];
  selectedCategory: number = 0;
  cityData: any[];
  errors: any = [];
  itemId: number;
  delete: any = {};
  loading: boolean = false;
  location_address: "";
  location_lat: "";
  location_lng: "";
  terms_isAccepted: boolean = false;
  //image
  inputImageData: any[] = [];

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
    private itemService: ItemService,
    private upload: UploadService,
    private settings: StaticSettings,
    private urlM: UrlUtils,
    private cService: CommonApiService,
    private _fb: FormBuilder,
    public global_items: GlobalItemsProvider,
    private toast: Toast
  ) {
    this.itemId = this.navParams.get("id");
    this.delete = this.navParams.get("delete");

    console.log("id");
    this.initializeFormControls();
  }

  ngOnInit() {
    // if(this.delete == 'delete'){
    //   this.deleteItem();
    // }
    this.getFullDetailsOfItem(this.itemId);
    this.getPreferences();
  }

  get categoryIds() {
    return <FormArray>this.form.get("category_ids");
  }
  get aF() {
    return <FormArray>this.form.get("additionalFields");
  }
  goTO_terms() {
    this.navCtrl.push("PrivacyAndPolicyPage");
  }
  getFullDetailsOfItem(id) {
    this.itemService.get(id + "/edit").subscribe(
      res => {
        if (res.status) {
          let resData = res.data;
          let catList = {};
          console.log("resdata", resData);
          let temp = res.data.resources;
          temp.forEach((element, index) => {
            Object.assign(res.data.resources[index], { path: element.s_path });
          });
          this.inputImageData["imageInput"] = res.data.resources;
          this.form.patchValue({
            price: resData.i_price,
            title: resData.description.title,
            description: resData.description.description,
            address: resData.location.address,
            region_id: resData.location.fk_i_region_id,
            city_id: resData.location.fk_i_city_id,
            show_mail: resData.b_show_email,
            show_chat: resData.b_show_chat,
            show_contact: resData.b_show_contact
          });
          resData.resources.forEach((element, index) => {
            this.setImageInfo(index, element, 1, false);
          });
          resData.category_list.forEach((data, key) => {
            let elem = {};
            elem["data"] = data.hasOwnProperty("data") ? data.data : data;
            elem["selected"] = data.hasOwnProperty("selected_id")
              ? data.selected_id
              : "";
            elem["key"] = key;
            elem["category_id"] = key == 0 ? "" : data.selected_id;
            this.categroyArray.push(elem);
            catList["category_id"] = [
              data.hasOwnProperty("selected_id") ? data.selected_id : ""
              // Validators.required
            ];
            this.categoryIds.push(this._fb.group(catList));
          });
          this.cityData = resData.city_list.data;
          this.region["data"] = resData.region_list.data;
          this.additionalFields = resData.additional_fields;
          this.initializeAdditionalFields();
        } else {
          if (res.error.code == 401) {
            // window.location.href = '/classifieds/' + id;
          }
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }

  getCategories() {
    this.cService.get("categories").subscribe(res => {
      if (res.status && res.data) {
        this.pushSubcategoriesToArray(res.data);
      }
    });
  }
  getRegion() {
    this.cService.get("region").subscribe(res => {
      if (res.status) {
        this.region["data"] = res.data;
      }
    });
  }
  getCity(id) {
    this.cService.get("city/" + id).subscribe(res => {
      if (res.status) {
        this.cityData = res.data;
      }
    });
  }
  chooseCategory(category, key) {
    console.log("edit-classified-chosse_category", category, key);
    this.getSubCategories(category.pk_i_id, key);
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
  getSubCategories(id, key) {
    console.log("edit-classified-getSub_category", id, key);
    this.additionalFields = [];
    this.cService.get("subcategory-afields/" + id).subscribe(res => {
      if (res.status && res.data) {
        if (res.data.categories && res.data.categories) {
          this.pushSubcategoriesToArray(res.data.categories, key, id);
          console.log("edit-classified-getSub_category", res.data.categories);
        }
        if (res.data.additionl_fields && res.data.additionl_fields.length) {
          this.additionalFields = res.data.additionl_fields;
          this.initializeAdditionalFields();
        }
      }
    });
  }

  initializeAdditionalFields() {
    let group = {};
    this.additionalFields.forEach(element => {
      let value = element.hasOwnProperty("value") ? element.value : "";
      group[element.slug] = element.required
        ? [value, Validators.required]
        : [value];
    });
    let af = <FormArray>this.form.get("additionalFields");
    af.removeAt(0);
    af.push(this._fb.group(group));
  }

  addtionalFieldValidation(index, field) {
    let addT = this.aF;
    return addT.controls[index].get(field).invalid &&
      addT.controls[index].get(field).touched
      ? true
      : false;
  }

  private pushSubcategoriesToArray(data, key = 0, cat_id = null) {
    let temp: any = {};
    temp["data"] = data.hasOwnProperty("data") ? data.data : data;
    temp["selected"] = data.hasOwnProperty("selected_id")
      ? data.selected_id
      : "";
    temp["key"] = key;
    temp["category_id"] = cat_id;
    this.categroyArray.forEach((element, index) => {
      if (index > key) {
        this.categoryIds.removeAt(index);
      }
    });
    this.categroyArray.splice(key + 1);
    if (!this.isCategoryExists(cat_id) && data.length) {
      this.categroyArray.push(temp);
      let fieldData = {};
      fieldData["category_id"] = ["", Validators.required];
      this.categoryIds.push(this._fb.group(fieldData));
    }
  }

  initializeFormControls() {
    this.form = this._fb.group({
      category_ids: this._fb.array([]),
      title: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(70)])
      ],
      price: ["", Validators.compose([Validators.minLength(0)])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(10)])
      ],
      address: ["", Validators.required],
      region_id: ["", Validators.required],
      city_id: ["", Validators.required],
      show_mail: [""],
      show_chat: [""],
      show_contact: [""],
      additionalFields: this._fb.array([])
    });
  }
  getPreferences() {
    this.itemService.get("preferences").subscribe(res => {
      if (res.status) {
        this.maxImagesAllowed = Array(parseInt(res.data.images)).fill(0);
      }
    });
  }
  handleImageChange(arg) {
    console.log(arg);
    this.images = arg;
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
  isAccepted(event) {
    console.log(event);
    console.log(event.checked);
    if (event.checked == true) {
      this.terms_isAccepted = true;
    } else {
      this.terms_isAccepted = false;
    }
  }
  postItem(form) {
    this.errors = [];
    if (!this.images.length) {
      this.doValidationMessage(["At least one image is required !"]);
    }
    if (this.errors.length < 1 && this.terms_isAccepted == true) {
      this.disable = true;
      let data: any = {};
      this.loading = true;
      data = this.form.value;
      // data["images"] = this.images;
      // if (data["additionalFields"][0]) {
      //   data["additionalFields"] = data["additionalFields"].pop();
      // }
      let imageArray: any[] = [];
      this.images.forEach(element => {
        imageArray.push(element.path);
      });
      data["images"] = imageArray;
      let category = data["category_ids"][data["category_ids"].length - 1];
      data["category_id"] = category.category_id;
      Object.assign(data, { location: this.location_address });
      Object.assign(data, { latitude: this.location_lat });
      Object.assign(data, { longitude: this.location_lng });
      this.itemService.updateData(data, "u/" + this.itemId).subscribe(
        res => {
          if (res.status) {
            this.loading = false;
            this.global_items
              .showAlert(
                "Success",
                "Item has been posted Successfully",
                "success"
              )
              .then(() => {
                this.navCtrl.pop();
              });
            // this.toast
            //   .show(
            //     ` classified has been updated Succesfully.`,
            //     "2000",
            //     "bottom"
            //   )
            //   .subscribe(toast => {
            //     console.log(toast);
            //   });
            // setTimeout(() => {
            //   // this.navCtrl.push(AdsPostedPage);
            //   this.navCtrl.pop();
            // }, 1500);
            this.disable = false;
          } else {
            this.disable = false;
            // this.global_items.showToast("Something went wrong");
            this.global_items
              .showAlert("Failed", "Something went wrong", "error")
              .then(() => {
                // this.navCtrl.pop();
              });
          }
        },
        (error: AppError) => {
          this.disable = false;
          // this.global_items.showToast("Something went wrong");
          this.global_items
            .showAlert("Failed", "Something went wrong", "error")
            .then(() => {
              // this.navCtrl.pop();
            });
          if (error instanceof BadRequestError) {
            this.loading = false;
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
    let val = { message: message[0], error: true };
    this.errors.push(val);
  }

  onImageChange(event, i) {
    let files = event.target.files;
    if (files) {
      if (this.images[i]) {
        this.removeImage(i);
      }
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
            let errorMessage = "Error While uploading image";
            if (error.hasOwnProperty("error")) {
              let validation = error.error;
              if (validation.hasOwnProperty("error_message")) {
                errorMessage = error.error.error_message.image[0];
              }
            }
            this.setImageInfo(i, {}, 2, true, errorMessage);
          }
        );
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

  private setImageInfo(
    index,
    data,
    status,
    error,
    errorMessage = "Error while uploading image"
  ) {
    console.log("nan ethi");
    let image = {};
    image["isUploaded"] = status;
    image["isError"] = error;
    image["errorMessage"] = errorMessage;
    if (data && data.s_path) {
      image["path"] = data.s_path;
      image["id"] = data.hasOwnProperty("pk_i_id") ? data.pk_i_id : "";
      image["name"] = data.hasOwnProperty("name") ? data.name : "";
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
  isError(index) {
    if (this.images[index]) {
      if (this.images[index].isError) {
        return this.images[index].display;
      }
    }
    return false;
  }

  removeImage(index) {
    // this.config.duration=2000;
    if (this.images[index].hasOwnProperty("id") && this.images[index].id) {
      if (this.images.length == 1) {
        // return  this.snackBar.open('At least one image is required', ' ', this.config);
      }
      this.itemService
        .postData({ resource_id: this.images[index].id }, "/remove-resource")
        .subscribe(res => {
          if (res.status) {
            this.images.splice(index, 1);
          } else {
            let error = res.hasOwnProperty("error")
              ? res.error
              : "Unable to delete image";
            // this.snackBar.open(error, ' ', this.config);
          }
        });
    }
  }

  isTouchedAndInvalid(name: string) {
    return this.form.get(name).invalid && this.form.get(name).touched
      ? true
      : false;
  }

  goback() {
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad EditClassifiedsPage");
  }
}
