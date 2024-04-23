
import { Component, Input, OnInit } from '@angular/core';
import { PMDialogComponentBase } from '@shared/ui/pm-dialog/pm-dialog-component-base';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';

@Component({
    selector: 'app-manual-dialog',
    templateUrl: './manual-dialog.component.html',
    providers: [{ provide: PMDialogComponentBase, useExisting: ManualDialogComponent }]
})
export class ManualDialogComponent extends PMDialogComponentBase implements OnInit {
    //Input
    //Dialog
    @Input() isSupport: boolean

    constructor(
    ) {
        super();
    }


    ngOnInit() {
    }
    async save(): Promise<PMDialogEvent> {
        return new Promise((resolve) => resolve({ isClose: true }));
    }

    cancel(): Promise<boolean> {
        return new Promise<boolean>(async rs => {
            rs(true);
        });
    }
}
