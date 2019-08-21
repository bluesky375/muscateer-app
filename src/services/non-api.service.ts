
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {StaticSettings} from "./settings.service";
import {DatabasesService} from "./databases.service";

@Injectable()
export class WebService extends HttpService{
    constructor(http:Http ,settings : StaticSettings,public dbservice:DatabasesService){
        super(settings.BASE_URL,http,dbservice);
    }
}