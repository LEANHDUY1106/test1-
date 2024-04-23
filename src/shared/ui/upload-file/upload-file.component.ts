import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss']
})

export class UploadFileComponent implements OnInit, OnChanges {
    // @Output('pushData') pushData: EventEmitter<any> = new EventEmitter();
    @Output('finish') finish: EventEmitter<any> = new EventEmitter()
    @Input() isSucsess: boolean;
    @Input() invalidFile: boolean;
    @Input() messageErr: string;
    constructor(private activatedRoute: ActivatedRoute,
        private _messageService: MessageService) {

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.isSucsess == true) {
            this.files = [];
        }
    }
    ngOnInit(): void {
    }
    //changeFile
    files: File[] = [];
    changeFile(event: any): void {
        //nếu tổng số file chọn và số file đã có > 5 hiển thị warn
        if (this.files.length + event.target.files.length > 5) {
            this._messageService.add({
                severity: 'warn',
                detail: 'Chỉ được upload tối đa 5 file!',
            });
            return;
        }
        //gán content file
        //và chỉ chọn các file có đuôi[.jpg; .png; .xlsx; .docx; .pdf; .zip; .rar]
        let totalFiles = 0;
        for (let i = 0; i < event.target.files.length; i++) {
            let fileFunction = event.target.files[i].name.split('.');
            let fileType = fileFunction[fileFunction.length - 1];
            if (!(fileType == "pptx" || fileType == "jpg" || fileType == "xlsx" || fileType == "docx" || fileType == "pdf")) {
                this._messageService.add({
                    severity: 'error',
                    detail: 'Chỉ upload được file có đuôi [.jpg; .xlsx; .docx; .pttx; .pdf]!',
                });
                return;
            }
            totalFiles += event.target.files[i].size;
            console.log('tinhs file');
            console.log(event.target.files[i].size);
            // if ((fileType == "pptx" || fileType == "xlsx" || fileType == "docx" || fileType == "pdf")) {
            //     if(event.target.files[i].size > 5242880){
            //         this._messageService.add({
            //             severity: 'error',
            //             detail: 'Chỉ upload được file có dung lượng tối đa là 5MB!',
            //         });
            //         return;
            //     }
            // }
            // if ((fileType == "jpg" || fileType == "png" || fileType == "PNG" || fileType == "JPG")) {
            //     if(event.target.files[i].size > 1024000){
            //         this._messageService.add({
            //             severity: 'error',
            //             detail: 'Chỉ upload được file ảnh có dung lượng tối đa là 1MB!',
            //         });
            //         return;
            //     }
            // }
        }
        console.log('tong file');
            console.log(totalFiles);
        if (totalFiles > 20480000) {
            this._messageService.add({
                severity: 'error',
                detail: 'Tổng dung lượng các files không được vượt quá 20MB!',
            });
            return;
        }
        for (let i = 0; i < event.target.files.length; i++) {
            //kiểm tra xem trùng tên không
            let checkName = 0;
            for (let j = 0; j < this.files.length; j++) {
                if (this.files[j].name == event.target.files[i].name) {
                    checkName++;
                }
            }
            if (checkName == 0) {
                this.files.push(event.target.files[i]);
            }
        }
        //truền mảng file sang cha
        //đưa event về null
        this.finish.emit(this.files);
    }

    //xóa file
    removeFile(file: any) {
        let listFile = this.files;
        this.files = [];
        for (let i = 0; i < listFile.length; i++) {
            if (listFile[i].name != file.name) {
                this.files.push(listFile[i]);
            }
        }
        //neeus xoas thif goij cais nay de xoa su kien
        document.getElementById('uploadFile')['value'] = "";
        this.finish.emit(this.files);
    }
}
