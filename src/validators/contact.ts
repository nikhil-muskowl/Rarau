import { FormControl } from '@angular/forms';
 
export class ContactValidator {
 
    static isValid(control: FormControl): any {
 
        if(isNaN(control.value)){
            return {
                "not a number": true
            };
        }     
 
        if(control.value < 10){
            return {
                "Min 10 digit": true
            };
        }
 
        return null;
    }
 
}