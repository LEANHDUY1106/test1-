import { Component, Input, OnInit } from '@angular/core';
import { MailHistoryService } from '@shared/service-proxy/mail-history/mail-history.service';
import { MailHistoryDetailDto } from '@shared/service-proxy/mail-history/models/MailHistory';
import { PMDialogComponentBase } from '@shared/ui/pm-dialog/pm-dialog-component-base';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';

@Component({
    selector: 'preview-dialog',
    templateUrl: './preview-dialog.component.html',
    providers: [{ provide: PMDialogComponentBase, useExisting: PreviewDialogComponent }]
})
export class PreviewDialogComponent extends PMDialogComponentBase implements OnInit {

    @Input() id: number = null;
    mailDetail: MailHistoryDetailDto;
    constructor(
        private _mailService: MailHistoryService
    ) {
        super();
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: any) {
        if (changes.id && changes.id.currentValue) {
            this.setLoading(true);
            const id = changes.id.currentValue;
            this._mailService.getById(id).subscribe(rs => {
                this.mailDetail = rs['data'];
                this.setLoading(false);
            });
        }
    }

    save(): Promise<PMDialogEvent> {
        this.id = null;
        this.mailDetail = null;
        return new Promise<PMDialogEvent>(resolve => resolve({ isClose: true }))
    }

}
