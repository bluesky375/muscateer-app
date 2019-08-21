import {Injectable} from '@angular/core';
import {StaticSettings} from "./settings.service";
@Injectable()
export class UrlUtils {


    constructor(private settings : StaticSettings){

    }
    getImagePath(res) {
        let path: boolean;
        path = res.s_path ? true : false;
        if (path) {
            return this.settings.IMAGE_URL + res.s_path;
        } else {
            return this.settings.ITEM_DUMMY_IMAGE;
        }
    }

}