import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { CommonApiService } from "../../services/common-api.service";
import { FormBuilder, Validators } from "@angular/forms";
import { UpdatePasswordPage } from "../update-password/update-password";
import { BadRequestError } from "../../Errors/bad-request-error";
import { AppError } from "../../Errors/app-error";
import { StaticSettings } from "../../services/settings.service";
import { UrlUtils } from "../../services/url.service";
import { UploadService } from "../../services/file-upload.service";
import { GlobalItemsProvider } from "../../providers/global-items/global-items";

/**
 * Generated class for the ProfileSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "ProfileSettingsPage" })
@Component({
  selector: "page-profile-settings",
  templateUrl: "profile-settings.html"
})
export class ProfileSettingsPage implements OnInit {
  userInfo: any = {};
  form: any = {};
  passForm: any = {};
  user: any = {};
  images: any = {};
  errors: any = [];
  avatar_list: any = [];
  avatar_image_path = null;
  avatar_image_index = null;
  avatar_image_name_list = [];
  location_address: "";
  location_lat: "";
  location_lng: "";
  public userSettings: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: CommonApiService,
    fb: FormBuilder,
    public modalCtrl: ModalController,
    private settings: StaticSettings,
    private urlM: UrlUtils,
    private upload: UploadService,
    public global_items: GlobalItemsProvider
  ) {
    this.form = fb.group({
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      about: [
        "",
        Validators.compose([Validators.required, Validators.minLength(10)])
      ],
      region: ["", Validators.required],
      website: [""],
      facebook: [""],
      twitter: [""],
      instagram: [""],
      location: [""]
    });
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
  ngOnInit() {
    this.getProfileSettings();
    this.get_Avatar();
  }
  get_Avatar() {
    this.apiService.get("default-images").subscribe(
      res => {
        if (res.status == true) {
          res.data.images.forEach(element => {
            let img = res.data.prefix + element;
            this.avatar_list.push(img);
            this.avatar_image_name_list.push(element);
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  remove_profile_pic() {
    this.user.type = "0";
  }
  setAvatar() {
    let modal = this.modalCtrl.create("AvatarListPage", {
      avatar: this.avatar_list
    });
    modal.onDidDismiss(res => {
      console.log("modal dismiss value is", res);
      if (res == "" || res == null || res == undefined) {
        this.avatar_image_path = null;
        this.avatar_image_index = null;
        this.user.type = "0";
        this.setImage(1, false, this.user);
      } else {
        this.avatar_image_path = res.img_path;
        this.avatar_image_index = res.index;
        this.user.type = "1";
      }
    });
    modal.present();
  }
  presentModal() {
    let modal = this.modalCtrl.create("UpdatePasswordPage");
    modal.present();
  }

  isTouchInvalid(name: string) {
    return this.form.get(name).touched && this.form.get(name).invalid;
  }

  getProfileSettings() {
    this.apiService.get("user/details").subscribe(
      res => {
        if (res.status && res.data) {
          console.log("user/details");
          console.log(res);

          this.user["email"] = res.data.user.email;
          this.user["phone"] = res.data.user.s_phone_mobile;
          this.user["name"] = res.data.user.s_name;
          this.user["regions"] = res.data.regions;
          this.user["s_path"] = res.data.user.profile_picture;
          this.user["about"] = res.data.user.about;
          this.user["website"] = res.data.user.s_website;
          this.user["facebook"] = res.data.user.facebook;
          this.user["twitter"] = res.data.user.twitter;
          this.user["instagram"] = res.data.user.instagram;
          this.user["type"] = res.data.user.type;
          this.setImage(1, false, this.user);
          if (
            res.data.user.profile_picture != null ||
            res.data.user.profile_picture != undefined ||
            res.data.user.profile_picture != ""
          ) {
          }
          this.user["profile_picture"] =
            this.settings.BASE_URL + "uploads/" + res.data.user.profile_picture;
          this.user["region_id"] = res.data.user.fk_i_region_id;

          if (
            res.data.user.location == undefined ||
            res.data.user.location == null ||
            res.data.user.location == ""
          ) {
            this.user["location"] = "Location";
            this.user["latitude"] = "";
            this.user["longitude"] = "";
          } else {
            this.user["location"] = res.data.user.location;
            this.user["latitude"] = res.data.user.latitude;
            this.user["longitude"] = res.data.user.longitude;
          }
          this.userSettings = {
            showRecentSearch: false,
            inputPlaceholderText: this.user.location,
            showSearchButton: false,
            showCurrentLocation: false,
            geoCountryRestriction: "om"
            // geoCountryRestriction: ['in'],
            // searchIconUrl: 'http://downloadicons.net/sites/default/files/identification-search-magnifying-glass-icon-73159.png'
          };
          this.form.patchValue({
            name: this.user["name"],
            region: this.user["region_id"],
            about: this.user["about"],
            facebook: this.user["facebook"],
            website: this.user["website"],
            instagram: this.user["instagram"],
            twitter: this.user["twitter"]
          });

          console.log("form data");
          console.log(this.form);
        }
      },
      err => {
        if (err.originalError.status == 404) {
          this.navCtrl.push("ForNotForPage");
        }
      }
    );
  }
  isSelected(selectedRegion) {
    if (this.user["region_id"] == selectedRegion) {
      return "selected";
    }
    return null;
  }

  onSubmit() {
    console.log("on submit -type", this.user.type);

    this.userInfo["name"] = this.form.get("name").value;
    this.userInfo["region_id"] = this.form.get("region").value;
    this.userInfo["website"] = this.form.get("website").value;
    this.userInfo["facebook"] = this.form.get("facebook").value;
    this.userInfo["twitter"] = this.form.get("twitter").value;
    this.userInfo["instagram"] = this.form.get("instagram").value;
    this.userInfo["about"] = this.form.get("about").value;
    if (
      this.location_address == null ||
      this.location_address == undefined ||
      this.location_address == ""
    ) {
      this.userInfo["latitude"] = this.user["latitude"];
      this.userInfo["longitude"] = this.user["longitude"];
      this.userInfo["location"] = this.user["location"];
    } else {
      this.userInfo["latitude"] = this.location_lat;
      this.userInfo["longitude"] = this.location_lng;
      this.userInfo["location"] = this.location_address;
    }
    switch (this.user.type) {
      case "0":
        {
          this.userInfo["profile_picture"] = "";
          this.userInfo["avathar"] = "";
          this.userInfo["type"] = "0";
        }

        break;
      case "1":
        {
          this.userInfo["avathar"] = this.avatar_image_name_list[
            this.avatar_image_index
          ];
          this.userInfo["type"] = "1";
        }

        break;
      case "2":
        {
          this.userInfo["type"] = "2";
        }

        break;

      default:
        {
        }
        break;
    }
    console.log("looping");
    for (let key in this.userInfo) {
      if (this.userInfo.hasOwnProperty(key)) {
        console.log(key + " -> " + this.userInfo[key]);
        if (this.userInfo[key] == null || this.userInfo[key] == undefined) {
          this.userInfo[key] = "";
        }
      }
    }
    console.log(this.userInfo);
    this.setProfileSettings(this.userInfo);
  }

  setProfileSettings(values) {
    this.global_items.showLoading("Please wait...");
    console.log(values);
    let url = "user/update-profile-dummy";
    this.apiService.postData(values, url).subscribe(
      res => {
        if (res.status) {
          this.global_items.dismissLoading();
          this.global_items.showAlert("Done", "Success", "success");
          this.navCtrl.pop();
        } else {
          this.global_items.dismissLoading();
          this.global_items.showToast("Something went wrong");
        }
        console.log(res);
      },
      (error: AppError) => {
        this.global_items.dismissLoading();
        this.global_items.showAlert("Oops", "Error", "error");
        if (error instanceof BadRequestError) {
          if (error.originalError.error) {
            let errors = error.originalError.error.error_message;
            for (let error in errors) {
              this.doValidationMessage(errors[error]);
              console.log(errors);
            }
          }
        } else throw error;
      }
    );
  }

  doValidationMessage(message) {
    let val = { message: message[0], error: true };
    this.errors.push(val);
  }

  getImage(event) {
    this.user.type = "2";
    this.avatar_image_path = null;
    console.log("get image....");

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
              this.user.type = "0";
              this.setImage(1, false, this.user);
              // this.setImage(2, true);
            }
          },
          error => {
            this.user.type = "0";
            // this.setImage(2, true);
            this.setImage(1, false, this.user);
          }
        );
    } else {
      this.user.type = "0";
      this.setImage(1, false, this.user);
    }
  }

  setImage(status, error, data?) {
    this.images["isUploaded"] = status;
    this.images["isError"] = error;
    if (data && data.s_path) {
      this.images["path"] = data.s_path;
      this.images["display"] = this.urlM.getImagePath(data);
      this.userInfo["profile_picture"] = data.s_path;
      this.userInfo["avathar"] = "";
      this.user.type = "2";
    }
  }

  imageExists() {
    if (this.images["isUploaded"] == 1) {
      return this.images["display"];
    }
    return (this.images["display"] = "profile/user-dummy.png");
  }

  isUploading() {
    if (this.images["isUploaded"] == 0) {
      return true;
    }
    return false;
  }

  isError() {
    if (this.images["isError"]) {
      return true;
    }
    return false;
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProfileSettingsPage");
  }
}
