import { Input } from "@angular/core";
import { Subject } from "rxjs";
import { environment as env } from "src/environments/environment";
import { PMDialogEvent } from "./pm-dialog-model";



export abstract class PMDialogComponentBase {
    abstract save(): Promise<PMDialogEvent>;
    cancel(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            resolve(true)
        });
    }
    private _dialogLoading = new Subject<boolean>();
    setLoading(isLoading: boolean) {
        this._dialogLoading.next(isLoading);
    }
    get loadingObservable() {
        return this._dialogLoading.asObservable();
    }
}
