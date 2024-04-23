import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export function linkValidator(control: FormControl) {
    const linkRegexp: RegExp =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    if (control.value && !linkRegexp.test(control.value)) {
        return { link: true };
    }
    return null;
}

export function specialCharacterValidator(control: FormControl) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>]/;
    if (control.value && nameRegexp.test(control.value)) {
        return { specialCharacter: true };
    }
    return null;
}

export function RequiredDateRageValidator(control: FormControl) {
    if (control.value && (!control.value[0] || !control.value[1]))
        return { requiredDateRage: true };
    return null;
}

export function onlyOriginCharacterValidator(control: FormControl) {
    const nameRegexp: RegExp = /^[0-9a-zA-Z ]*$/;
    if (control.value && !nameRegexp.test(control.value))
        return { onlyOriginCharacter: true };
    return null;
}

export function characterValidator(control: FormControl) {
    const nameRegexp: RegExp = /[~!@#$%`{}^+<>?'|\\\/[]+]*/;
    if (control.value && nameRegexp.test(control.value))
        return { characterValidator: true };
    return null;
}


export function incorrectStartEndDate(
    startDateControl: string,
    endDateControl: string
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const startDate = control.get(startDateControl).value;
        const endDate = control.get(endDateControl).value;
        if (!startDate || !endDate) return null;
        if (startDate > endDate) {
            return { incorrectStartEndDate: true };
        }
        return null;
    };
}
export function incorrectDate(
    control: AbstractControl
) {
    if(control.value == "" || control.value == null || control.value == undefined){
        return null;
    }
    //nếu là string thì bỏ qua
    if(typeof control.value  == 'string'){
        return null
    }
    let curentValue = new Date(control.value).setHours(24);
    
    if(curentValue < new Date().setHours(0)){

        return { incorrectDate: true };
    }
    return null;
}
export function confirmPassword(
    controlName: string,
    matchingControlName: string
) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.confirmPassword) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmPassword: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}

export function requiredNotSpace(control: FormControl) {
    if (!control.value) return null;
    if (control.value.trim()) return null;
    return { required: true };
}
export function partnerUsername(control: FormControl) {
    // const nameRegexp: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const nameRegexp: RegExp = /^[A-Za-z0-9._]+$/;
    if (control.value && nameRegexp.test(control.value)) return null;
    return { partnerUsername: true };
}

export class CustomValidate {
    static specialCharacter = specialCharacterValidator;
    static onlyOriginCharacter = onlyOriginCharacterValidator;
    static link = linkValidator;
    static character = characterValidator;
    static RequiredDateRage = RequiredDateRageValidator;
    static incorrectStartEndDate = incorrectStartEndDate;
    static confirmPassword = confirmPassword;
    static partnerUsername = partnerUsername;
    static requiredNotSpace = requiredNotSpace;
}
