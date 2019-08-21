import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DatabasesService} from "./databases.service";
@Injectable()
export class UploadService {
    progress$ :any;
    progress:any;
    progressObserver :any;
    constructor (public dbservice:DatabasesService) {
        // this.progress$= Observable.create(observer => {
        //     this.progressObserver = observer
        // }).share();
    }

     makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
        return Observable.create(observer => {
            if(!files[0]){
              return  observer.error('File Missing');
            }
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            formData.append("image", files[0], files[0].name);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
            
            xhr.open('POST', url, true);
            // let token=document.getElementsByName('csrf-token')[0].getAttribute('content');
            // xhr.setRequestHeader('X-CSRF-TOKEN',token);

            let token = this.dbservice.accessToken();
            // let header = new Headers();
            // if (token.hasOwnProperty('access')) {
            //     header.append('Authorization', 'Bearer ' + token['access']);
            // }
            
            xhr.setRequestHeader('Authorization','Bearer '+ token['access']);
            xhr.send(formData);
        });
    }
}