import {FormControl} from '@angular/forms';

export function RequiredDateRageValidator(control: FormControl) {
    if(control.value && (!control.value[0] || !control.value[1]))
        return {requiredDateRage: true};
    return null;
}
