import { Injectable } from "@angular/core";
// import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import "rxjs/add/operator/distinctUntilChanged";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Rx";
import { GlobalItemsProvider } from "../providers/global-items/global-items";
import { Storage } from "@ionic/storage";
@Injectable()
export class DatabasesService {
  public token: any;
  public refresh_token: any;
  tokenSub = new BehaviorSubject({});
  deletedToken = new BehaviorSubject({});

  constructor(
    // private push: Push,
    private sqlite: SQLite,
    public global_item_provider: GlobalItemsProvider,
    public storage: Storage
  ) {
    // this.getToken();
  }

  createLogin() {
    this.sqlite
      .create({
        name: "data.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "CREATE TABLE IF NOT EXISTS login(id INTEGER PRIMARY KEY, token TEXT, refresh_token TEXT)"
        )
          .then(res => {
            console.log("Executed SQL login", res);
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  saveToken(token, refresh_token) {
    let db = new SQLite();
    db.create({
      name: "data.db",
      location: "default"
    })
      .then((db: SQLiteObject) => {
        db.executeSql("INSERT INTO login VALUES(NULL,?,?)", [
          token,
          refresh_token
        ])
          .then(res => {
            console.log("inserted");
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getToken(): Observable<any> {
    return Observable.create(obse => {
      console.log("inside getToken 33");
      let db = new SQLite();
      db.create({
        name: "data.db",
        location: "default"
      })
        .then((db: SQLiteObject) => {
          db.executeSql("SELECT token,refresh_token FROM login", [])
            .then(res => {
              if (res.rows.length > 0) {
                this.global_item_provider.nav_auth = "LOGOUT";
                // this.pushsetup();
                for (var i = 0; i < res.rows.length; i++) {
                  this.token = res.rows.item(i).token;
                  this.refresh_token = res.rows.item(i).refresh_token;
                  if (this.token && this.refresh_token) {
                    // console.log('Both token found');
                    const tok = {
                      access: this.token,
                      refresh: this.refresh_token
                    };
                    this.tokenSub.next(tok);
                    obse.next(tok);
                  } else {
                    obse.next(false);
                  }
                  obse.complete();
                }
              } else {
                obse.next(false);
                obse.complete();
                this.global_item_provider.nav_auth = "LOGIN";
              }
            })
            .catch(e => {
              obse.error(e);
              // console.log(e);

              this.global_item_provider.nav_auth = "LOGIN";
            });
        })
        .catch(e => {
          // console.log(e);
          obse.error(e);

          this.global_item_provider.nav_auth = "LOGIN";
        });
    });
  }

  createVersion() {
    this.sqlite
      .create({
        name: "data.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS version(name VARCHAR(32))")
          .then(() => console.log("Executed SQL version_table"))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  accessToken() {
    // this.pushsetup();
    return this.tokenSub.getValue();
  }

  deleteToken() {
    this.sqlite
      .create({
        name: "data.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DROP TABLE login")
          .then(res => {
            console.log("Table Dropped", res);
            localStorage.clear();
            this.global_item_provider.nav_auth = "LOGIN";
            this.deletedToken.next(res);
            db.close();
            localStorage.clear();
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  deletedTokens() {
    return this.deletedToken.getValue();
  }
  // pushsetup() {
  //   console.log("inside push setup");
  //   const options: PushOptions = {
  //     android: {
  //       senderID: "275262437137"
  //     },
  //     ios: {
  //       alert: "true",
  //       badge: true,
  //       sound: "false"
  //     }
  //   };

  //   const pushObject: PushObject = this.push.init(options);

  //   pushObject
  //     .on("notification")
  //     .subscribe((notification: any) =>
  //       console.log("Received a notification", notification)
  //     );

  //   pushObject
  //     .on("registration")
  //     .subscribe((registration: any) =>
  //       console.log("Device registered", registration)
  //     );

  //   pushObject
  //     .on("error")
  //     .subscribe(error => console.error("Error with Push plugin", error));
  // }

  set_end_point() {
    let return_value: string = "/en/";

    this.storage.get("app_direction").then(res => {
      console.log("dbservice,direction-res", res);
      this.global_item_provider.App_direction = res;
    });
    console.log("dbservice,direction", this.global_item_provider.App_direction);

    if (this.global_item_provider.App_direction == "rtl") {
      return_value = "/ar/";
    } else if (
      this.global_item_provider.App_direction == "ltr" ||
      this.global_item_provider.App_direction == "left" ||
      this.global_item_provider.App_direction == null ||
      this.global_item_provider.App_direction == undefined
    ) {
      return_value = "/en/";
    } else {
      return_value = "/en/";
    }
    return return_value;
  }

  get_location() {
    if (
      this.global_item_provider.App_global_location_lat == null ||
      this.global_item_provider.App_global_location_lat == undefined ||
      this.global_item_provider.App_global_location_lat == 0 ||
      this.global_item_provider.App_global_location_lat == "0" ||
      this.global_item_provider.App_global_location_long == null ||
      this.global_item_provider.App_global_location_long == undefined ||
      this.global_item_provider.App_global_location_long == 0 ||
      this.global_item_provider.App_global_location_long == "0"
    ) {
      return "false";
    } else {
      return (
        this.global_item_provider.App_global_location_lat +
        "/" +
        this.global_item_provider.App_global_location_long
      );
    }
  }

  get_search_input() {
    if (
      this.global_item_provider.App_global_search_input == "" ||
      this.global_item_provider.App_global_search_input == undefined ||
      this.global_item_provider.App_global_search_input == null
    ) {
      return "false";
    } else {
      return this.global_item_provider.App_global_search_input;
    }
  }
}
