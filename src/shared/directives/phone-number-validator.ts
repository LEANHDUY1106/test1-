import {FormControl} from '@angular/forms';

export function PhoneNumberValidator(control: FormControl) {
    const phoneRegexp: RegExp = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+(\d{8})$/;
    if (control.value && !phoneRegexp.test(control.value)) {
            return {phoneNUmberValidate: true};
    }
    return null;
}
