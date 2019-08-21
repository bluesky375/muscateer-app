import { Geolocation } from "@ionic-native/geolocation";
import { Diagnostic } from "@ionic-native/diagnostic";
import { GlobalItemsProvider } from "./../../providers/global-items/global-items";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { CommonApiService } from "../../services/common-api.service";
import { DatabasesService } from "../../services/databases.service";
import { Storage } from "@ionic/storage";
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderReverseResult
} from "@ionic-native/native-geocoder";
/**
 * Generated class for the UpdateLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ name: "UpdateLocationPage" })
@Component({
  selector: "page-update-location",
  templateUrl: "update-location.html"
})
export class UpdateLocationPage {
  public userSettings: any = {
    showRecentSearch: false,
    inputPlaceholderText: this.global_items.do_translation("Location"),
    showSearchButton: false,
    showCurrentLocation: false,
    geoCountryRestriction: "om"
  };
  public lottieConfig = {
    path: "assets/lottie_files/current_location.json",
    renderer: "canvas",
    autoplay: true,
    loop: true
  };
  constructor(
    public storage: Storage,
    public dbservice: DatabasesService,
    public apiservice: CommonApiService,
    private nativeGeocoder: NativeGeocoder,
    public geolocation: Geolocation,
    public diagnostic: Diagnostic,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global_items: GlobalItemsProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad UpdateLocationPage");
  }
  location_picked(event) {
    console.log(event);
    console.log("formatted address", event.data.formatted_address);
    console.log("lat", event.data.geometry.location.lat);
    console.log("lng", event.data.geometry.location.lng);

    this.global_items.App_global_location = event.data.formatted_address;
    this.global_items.App_global_location_lat =
      event.data.geometry.location.lat;
    this.global_items.App_global_location_long =
      event.data.geometry.location.lng;
    // this.navCtrl.setRoot(TabsPage);
    this.setUp(
      event.data.formatted_address,
      event.data.geometry.location.lat,
      event.data.geometry.location.lng
    );
  }
  get_current_location() {
    this.diagnostic.isLocationEnabled().then(enabled => {
      this.global_items.showToast("Please wait...");
      if (enabled) {
        this.geolocation
          .getCurrentPosition()
          .then(res => {
            console.log("lattitude", res.coords.latitude);
            console.log("longitude", res.coords.longitude);
            setTimeout(() => {
              if (
                res.coords.latitude == null ||
                res.coords.latitude == undefined
              ) {
                this.get_current_location();
              } else {
                console.log("set location base api settings here");
                let options: NativeGeocoderOptions = {
                  useLocale: true,
                  maxResults: 1
                };
                this.nativeGeocoder
                  .reverseGeocode(
                    res.coords.latitude,
                    res.coords.longitude,
                    options
                  )
                  .then((result: NativeGeocoderReverseResult[]) => {
                    console.log(result);
                    this.global_items.App_global_location =
                      result[0].thoroughfare +
                      ", " +
                      result[0].administrativeArea;
                    this.global_items.App_global_location_lat =
                      result[0]["latitude"];
                    this.global_items.App_global_location_long =
                      result[0]["longitude"];

                    // this.navCtrl.setRoot(TabsPage);
                    this.setUp(
                      result[0].thoroughfare,
                      result[0]["latitude"],
                      result[0]["longitude"]
                    );
                  })
                  .catch((error: any) => console.log(error));
              }
            }, 1000);
          })
          .catch(err => {
            console.log("get current position", err);
            this.global_items.showToast("Location disabled");
          });
      } else {
        this.diagnostic.switchToLocationSettings();
      }
    });
  }

  setUp(location, latitude, longitude) {
    let data = {
      latitude: latitude,
      longitude: longitude,
      location: location
    };
    this.dbservice.getToken().subscribe(
      res => {
        if (res) {
          console.log("token", res);
          this.apiservice.postData(data, "user/location").subscribe(
            res => {
              if (res.status == true) {
                this.navCtrl.setRoot(TabsPage);
              } else {
                this.global_items.showToast("Something went wrong");
              }
            },
            err => {
              this.global_items.showToast("Something went wrong");
            }
          );
        } else {
          this.storage.set("temp_user_location", location);
          this.storage.set("temp_user_latitude", latitude);
          this.storage.set("temp_user_longitude", longitude);
          this.navCtrl.setRoot(TabsPage);
        }
      },
      err => {
        this.storage.set("temp_user_location", location);
        this.storage.set("temp_user_latitude", latitude);
        this.storage.set("temp_user_longitude", longitude);
        this.navCtrl.setRoot(TabsPage);
      }
    );
  }
}
