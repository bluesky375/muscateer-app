import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { DatabasesService } from "./databases.service";
import { HttpService } from "./http.service";
import { StaticSettings } from "./settings.service";

@Injectable()
export class CommonApiService extends HttpService {
  constructor(
    http: Http,
    settings: StaticSettings,
    public dbservice: DatabasesService
  ) {
    super(settings.BASE_URL + settings.API_END_POINT, http, dbservice);
  }
}
