import { Injectable } from "@angular/core";

@Injectable()
export class StaticSettings {
  public BASE_URL: string;
  public API_END_POINT: string;
  public API_URL: string;
  public IMAGE_URL: string;
  public ITEM_DUMMY_IMAGE;
  public GOOGLE_API_KEY = "AIzaSyDPjXibfSHCCu9mBuBSV-VFyzVi4yHJfPs";
  constructor() {
    // this.BASE_URL = "http://development.muscateer.om";
    this.BASE_URL = "https://muscateer.om";
    // this.BASE_URL = "http://muscateer.bravocodesolutions.com";
    this.API_END_POINT = "/api/v1/";
    this.API_URL = this.BASE_URL + this.API_END_POINT;
    this.IMAGE_URL = this.BASE_URL + "/uploads/";
    // this.IMAGE_URL = 'http://muscateer.bravocodesolutions.com/uploads/';
    this.ITEM_DUMMY_IMAGE = "assets/images/dummy-image.jpg";
  }
}
