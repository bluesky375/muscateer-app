export class AppError{

    constructor(public  originalError?:any){
        console.log('Something went wrong',originalError)
    }
}