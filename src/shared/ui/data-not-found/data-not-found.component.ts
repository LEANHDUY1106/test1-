import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-data-not-found',
    templateUrl: './data-not-found.component.html'
})
export class DataNotFoundComponent {

    /**Danh sách cần theo dõi
     * , nếu danh sách này không tồn tại sẽ hiển thị message báo dữ liệu trống */
    @Input() isLoading: boolean | undefined | null;

    /**Câu sẽ hiển thị khi dữ liệu không tồn tại */
    @Input() message: string | undefined | null;

    constructor() {
        //Pass
    }
}
