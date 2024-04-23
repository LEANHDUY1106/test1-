import {FormControl} from '@angular/forms';

export function RequiredPositiveNumberValidator(control: FormControl) {
    const nameRegexp: RegExp = /^\d+$/;
    if (control.value && !nameRegexp.test(control.value)) {
            return {requiredPositiveNumber: true};
    }
    return null;

}
