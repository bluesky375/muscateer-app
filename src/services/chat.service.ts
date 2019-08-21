import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { StaticSettings } from "./settings.service";
@Injectable()
export class ChatService {
  constructor(private http: Http, private settings: StaticSettings) {}

  public selectedChatSubject = new BehaviorSubject("");
  public selectetChatKey = this.selectedChatSubject
    .asObservable()
    .distinctUntilChanged();
  public isSelectedChatValidSub = new BehaviorSubject(true);
  public isSelectedChatValid = this.isSelectedChatValidSub
    .asObservable()
    .distinctUntilChanged();

  uploadFile(file) {
    const _formData = {
      image: file
    };
    return this.http
      .post(
        this.settings.BASE_URL + this.settings.API_END_POINT + "chat-file",
        _formData
      )
      .map(res => res.json());
    // return this.http.post('http://development.muscateer.om/api/v1/chat-file', _formData).map((res) => res.json());
  }
}
export class Message {
  data: string;
  type: "text" | "image";
  sender: any;
  created_at: object;
}
