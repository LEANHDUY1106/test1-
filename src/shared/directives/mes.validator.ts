import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
@Injectable({
    providedIn: "root",
  })
export class MesValidatorService {

    constructor() {}

    isUniqueTemplateActive(val:boolean): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if(control.value === val){
                return {isUniqueTemplateActive: true }
            }
            return null;

          }
    }
}
