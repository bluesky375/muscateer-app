import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { StaticSettings } from "./settings.service";
import {DatabasesService} from "./databases.service";
@Injectable()
export class ClassifiedsService extends HttpService {
    constructor(http: Http, setting: StaticSettings,public dbservice:DatabasesService) {
        super(setting.BASE_URL + setting.API_END_POINT + 'item/', http,dbservice)
    }
    
}