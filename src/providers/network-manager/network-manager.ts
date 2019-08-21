import { Injectable } from "@angular/core";
@Injectable()
export class NetworkManagerProvider {
  constructor() {
    console.log("Hello NetworkManagerProvider Provider");
  }
  is_internet_connection_enabled() {
    if (window.navigator.onLine) {
      // this.global_item.showToast("online");
      // console.log("internet connection is activated");
      return true;
    } else {
      // console.log("internet connection is disabled");
      return false;
    }
  }
}
