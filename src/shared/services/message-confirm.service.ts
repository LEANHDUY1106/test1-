import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MessageConfirmService {

    constructor(
        private confirmationService: ConfirmationService
    ) { }

    /**
     * Hiển thị popup xác nhận
     * @param title : tiêu đề popup xác nhận
     * @param message : nội dung popup xác nhận
     * @returns
     */
    showPopupConfirm(title?: string, message?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.confirmationService.confirm({
                header: title ?? undefined,
                message: message ?? 'Bạn có muốn thực hiện hành động này không?',
                icon: undefined,
                acceptLabel: "Đồng ý",
                rejectLabel: "Huỷ",
                blockScroll: false,
                accept: () => {
                    resolve(true);
                },
                reject: () => {
                    resolve(false);
                }
            })
        })
    }

}
