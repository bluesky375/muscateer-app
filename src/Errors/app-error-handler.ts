import {ErrorHandler} from '@angular/core';
export class AppErrorHandler implements ErrorHandler{
    handleError(){
        console.log('somthing went wrong');
    }
}