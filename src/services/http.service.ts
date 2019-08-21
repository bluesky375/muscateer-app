import { Injectable } from "@angular/core";
import { Headers, Http, URLSearchParams } from "@angular/http";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { AppError } from "../Errors/app-error";
import { AuthenticationError } from "../Errors/authentication-error";
import { BadRequestError } from "../Errors/bad-request-error";
import { ServerError } from "../Errors/server-error";
import { DatabasesService } from "./databases.service";

@Injectable()
export class HttpService {
  ts;
  constructor(
    private url: string,
    private http: Http,
    public dbservice: DatabasesService
  ) {}
  get(subUrl?: string, params?: object) {
    let temp_url = this.url.split("/api/");
    let new_url =
      temp_url[0] + this.dbservice.set_end_point() + "api/" + temp_url[1];
    console.log("url is ", new_url + subUrl);
    let optionalParam: URLSearchParams = new URLSearchParams();
    if (params) {
      if (this.dbservice.get_location() == "false") {
        console.log("new User without current location");
      } else {
        let data = this.dbservice.get_location();
        let new_data = data.split("/");
        console.log("string data of lat long", new_data);
        Object.assign(params, { latitude: parseFloat(new_data[0]) });
        Object.assign(params, { longitude: parseFloat(new_data[1]) });
      }
      if (this.dbservice.get_search_input() != "false") {
        Object.assign(params, { search: this.dbservice.get_search_input() });
      }
      for (let item in params) {
        optionalParam.set(item, params[item]);
      }
      return this.http
        .get(new_url + subUrl, {
          search: optionalParam,
          headers: this.createCustomHeader()
        })
        .map(response => response.json())
        .catch(this.handleError);
    } else {
      let data = this.dbservice.get_location();
      if (data == "false") {
        let search_input = "";
        if (this.dbservice.get_search_input() != "false") {
          search_input = this.dbservice.get_search_input();
        }
        let search_params = { search: search_input };
        return this.http
          .get(new_url + subUrl, {
            search: search_params,
            headers: this.createCustomHeader()
          })
          .map(response => response.json())
          .catch(this.handleError);
      } else {
        console.log("string data of lat long", data);
        let new_data = data.split("/");
        let search_input = "";
        if (this.dbservice.get_search_input() != "false") {
          search_input = this.dbservice.get_search_input();
        }
        let new_params = {
          latitude: parseFloat(new_data[0]),
          longitude: parseFloat(new_data[1]),
          search: search_input
        };
        let new_optionalParam: URLSearchParams = new URLSearchParams();
        for (let item in new_params) {
          new_optionalParam.set(item, new_params[item]);
        }
        return this.http
          .get(new_url + subUrl, {
            search: new_optionalParam,
            headers: this.createCustomHeader()
          })
          .map(response => response.json())
          .catch(this.handleError);
      }
    }
    // return this.http
    //   .get(new_url + subUrl, {
    //     search: optionalParam,
    //     headers: this.createCustomHeader()
    //   })
    //   .map(response => response.json())
    //   .catch(this.handleError);
  }

  postData(resource, subUrl: string = "") {
    return this.http
      .post(this.url + subUrl, JSON.stringify(resource), {
        headers: this.createCustomHeader()
      })
      .map(response => response.json())
      .catch(this.handleError);
  }

  updateData(resource, subUrl: string = "") {
    return this.http
      .put(this.url + subUrl, JSON.stringify(resource), {
        headers: this.createCustomHeader()
      })
      .map(response => response.json())
      .catch(this.handleError);
  }

  deleteData(subUrl: string = "") {
    return this.http
      .delete(this.url + subUrl, {
        headers: this.createCustomHeader()
      })
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    if (error.status === 500) return Observable.throw(new ServerError());
    // if (error.status === 404) return Observable.throw(new NotFoundError());
    if (error.status === 403)
      return Observable.throw(new AuthenticationError(error.json()));
    if (error.status == 400)
      return Observable.throw(new BadRequestError(error.json()));
    return Observable.throw(new AppError(error));
  }

  private createCustomHeader() {
    let token = this.dbservice.accessToken();
    let header = new Headers();
    if (token.hasOwnProperty("access")) {
      header.append("Authorization", "Bearer " + token["access"]);
    }
    header.append("Content-Type", "application/json");
    header.append("Accept", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
    header.append("Access-Control-Allow-Credentials", "true");
    header.append("Access-Control-Allow-Headers", "*");
    return header;
  }
}
