import { Injectable } from '@angular/core';
import { MessageConfirmService } from './message-confirm.service';

@Injectable({ providedIn: 'root' })
export class AlertService {
    constructor(private _messageConfirmService: MessageConfirmService) {
        //
    }

    /**
     * Xác nhận người dùng trước khi thực thi một hành động nào đó.
     * @param callbackSuccess Nếu người dùng xác nhận sẽ thực thi hành động này
     * @param callbackError Nếu người dùng không xác nhận sẽ thực thi hành động này (default = null)
     */
    confirm = async (callbackSuccess, callbackError = null) => {
        // Nếu người dùng đồng ý
        if (await this._messageConfirmService.showPopupConfirm(
            'Xác nhận hủy',
            'Bạn có chắc chắn muốn thực hiện hành động này không?'
        )) {
            callbackSuccess();
        }
        // Nếu người dùng không đồng ý và có hành động cần thực thi sẽ thực thi
        else {
            callbackError && callbackError();
        }

    }
}

