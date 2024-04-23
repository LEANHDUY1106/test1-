import { Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { PMDialogComponentBase } from './pm-dialog-component-base';
import { PMDialogEvent } from './pm-dialog-model';
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';
@Component({
    selector: 'pm-dialog',
    templateUrl: './pm-dialog.component.html',
    styleUrls: ['./pm-dialog.component.scss']
})
export class PMDialogComponent implements OnInit {

    // Quan ly tat mo nut Save
    @Input() isDisplayButtonSave: boolean = true;
    @Input() saveLabel: string = 'Lưu';
    @Input() isDisplayButtonCancel: boolean = true;
    @Input() cancelLabel: string = 'Hủy';
    @Input() visible: boolean = false;
    @Input() isBtnClose: boolean = false;
    @Input() dialogSubject: Subject<PMDialogEvent> = new Subject<PMDialogEvent>();
    @Input() title: string = '';
    @Input() size: DialogSize = 'lg';
    @ContentChild(PMDialogComponentBase) content: PMDialogComponentBase;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output('isSave') isSave = new EventEmitter<boolean>();
    isLoading = false;
    loadingObservableSubscription: Subscription;
    breakpoints: object;
    constructor() { }
    closeTap = false;

    ngOnInit(): void {
    }
    setSize(size) {
        this.size = size;
    }
    ngAfterContentInit() {
        this.loadingObservableSubscription = this.content?.loadingObservable.subscribe(rs => {
            this.isLoading = rs;
        });
    }
    async onSave() {
        let { isClose , payload } = await this.content.save();
        if (isClose) {
            this.visibleChange.emit(false);
            this.isSave.emit(true);
            this.dialogSubject.next({
                isClose,
                payload
            });
        }
    }
    async onCancel() {
        let isClose = await this.content.cancel();
        if (!isClose) return;
        this.visibleChange.emit(false);
        this.dialogSubject.next({
            isClose
        });
    }

    ngOnDestroy() {
        this.loadingObservableSubscription && this.loadingObservableSubscription.unsubscribe();
    }
}
