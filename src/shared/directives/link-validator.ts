import {FormControl} from '@angular/forms';

export function LinkValidator(control: FormControl) {
    const linkRegexp: RegExp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    if (control.value && !linkRegexp.test(control.value)) {
            return {linkValidate: true};
    }
    return null;
}
