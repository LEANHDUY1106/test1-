# fti-DX-RTM-web

## 1. Environment required(vui lòng sử dụng chung các Environment)
* [Visual Studio code](https://code.visualstudio.com/)
* [Angular CLI](https://angular.io/cli)
* [Sornalint Extension for vs code](https://www.sonarlint.org/vscode/)
* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* Version angular:
    + Angular CLI: 12.1.4
    + Node: 14.15.4
    + Package Manager: npm 6.14.12
* Set proxy:
    Coi thông tin hướng mục backend(api).
    Đối với máy cty run commant này: 
    + npm config set proxy http://proxy.hcm.fpt.vn:80
    + npm config set https-proxy null
* Clear cache npm:
    + npm cache clean --force

## 2. Deverlop start
Copy `environment.ts` to `environment.local.ts` and run commands:
```bash
#Install package
npm install
#Start dev server
ng serve -o
```

## 3. Cấu trúc (folder) chính của dự án
```bash
|-- PRMS-web #Root path
|   |-- node_module #Folder chứa dependence
|   |-- src #Chứa source
|   |   |-- app
|   |   |   |-- layout #Chứa master layout
|   |   |   |-- page-access-denied #403 page
|   |   |   |-- page-not-found #404 page
|   |   |   |-- pages #Your code is here (Xem phần 4.)
|   |   |-- assets
|   |   |-- environments #Chứa các file config env
|   |   |-- shared #Chứa các thành phần chung
```
## 4. Cách chia pages
Ví dụ bạn code module tương ứng với phần `Báo cáo doanh thu đã chốt` thuộc `Báo Cáo Kinh Doanh`
```bash
|-- Báo Cáo Kinh Doanh
|   | -- Báo cáo doanh thu hiện tại
|   | -- Báo cáo doanh thu đã chốt
```
Lúc này, các thao tác sẽ như sau
```bash
#Note: Open terminal tại fti-pm-web\src\app\page
#Create module BusinessReport
ng g m BusinessReport --routing --skip-tests
# cd to folder business-report
cd business-report
#Create Business Report Closing component
ng g c BusinessReportClosing --skip-tests
```

## 5. <u>Các component, service có sẵn.</u>
### 5.1 <u>Core</u>
#### a. <u>Add/Update environment</u>
Biến môi trường trong quá trình dev những config cho riêng cá nhân bạn được lưu tại file `\pm-web\src\environment\environment.local.ts`.
Nếu một bạn muốn add một biến mới, vui lòng thông báo trước khi up lên để những thành viên khác có thêm environment đó vào của họ.

#### b. <u>Http Client</u>
Tất cả các phương thức connet api sẽ đặt trong folder `\fti-pm-web\src\shared\service-proxy\`

Mỗi controller bên web-api sẽ tương ứng với một folder bên trong folder `\service-proxy`

Ex: Xây dựng Http tương tác với file (tương ứng với web api sẽ có controller filecontroller).
```bash
#Note: Open terminal in \fti-pm-web\src\shared\service-proxy
#Create folder file
mkdir file
#Change directory to file
cd file
#Tạo folder chưa các models (modelview)
mkdir models
#Create file service
ng g s file --skip-tests
```
Bên trong file `file.service.ts`
```ts
//file.service.ts
/*
your dependency
*/
//Import biến môi trường để lấy host servies
import { environment } from 'src/environments/environment';
```

### 5.2 <u>Services</u>
#### a. <u>Session </u>
<b>Postion:</b> `shared\session\app-session.service.ts`.<br>
<b>Usage:</b> Sử dụng để lấy thông tin người dùng đang đăng nhập.<br>
<b>Props</b>
+ <b>user: </b> Thông tin người dùng đang đăng nhập.
+ <b>userId: </b> Id người dùng đang đăng nhập.
+ <b>token: </b> token được cấp trong phiên đăng nhập hiện tại để connect api.
+ <b>apps: </b> Thông tin những app liên kết mà người dùng có quyền truy cập.
+ <b>funcs: </b> Những chức năng người  dùng có quyền truy cập.
+ <b>ftmsToken: </b> Token của ftms, dùng để refesh token.

Ex:

```ts
// upload.component.ts
export class UploadComponent implements OnInit {
    constructor (
        private _session: AppSessionService
    )
    ngOnInit(): void {
        console.log(`Hello ${this._session.user.userName}`) 
        //Hello HungDM27
    }
}
```
#### b. <u>Toast (notify)</u>
Hiển thị một message nhỏ ở vị trí bottom-right, khi sử dụng inject service `MessageService` khi bạn muốn hiện toast.<br>
EX.
```ts
// update.component.ts
/*
    Import Your depen
*/
import { MessageService } from 'primeng/api';

export class UpdateComponent implements OnInit {
    constructor(private _mes: MessageService){}
    /*
    Your code
    */
    save(){
        //call service update
        if(result.isSuccess){
            this._mes.add({
                severity:'success', 
                detail:'Cập nhật thành công'
            });
        } else {
            this._mes.add({
                severity:'error', 
                detail: result.errorMessage
            });
        }
    }

}
```

#### c. <u>MessageConfirm</u>
<b>Postion:</b> `shared\session\app-session.service.ts`.<br>

\* <u>showPopupConfirm:</u>

<b>Usage:</b> Sử dụng để xác lại thao tác nào đó trước khi thực hiện.<br>
+ Input:
    - <b>title:</b>  Tiêu  đề popup, default `undefined`
    - <b>message:</b> Nội dung được hiển thị, default `Bạn có muốn thực hiện hành động này không?`
+ return: `Promise<boolean>` Người dùng xác nhận đồng ý hoặc không.
+ Ex

```ts
async onDeleteSurvey(id: number){
    let isConfirm = await this._messageConfirm.showPopupConfirm();
    if(!isConfirm) return;
    this._surveyService
        .delete(id)
        .subscribe(()=>this._messervice
        .add({
            severity:'success', 
            detail:'Cập nhật thành công'
        }));
}
```


### 5.3 <u>Directive</u>
#### a. <u>Busy</u>
Sử dụng directed `[busy]="isLoading"` vào tag có position relative để xuất hiện icon loading chờ data.
Ex:
```ts
//download.component.ts
/*
Your code
*/
export class DownloadComponent implements OnInit {
    constructor(private _fileService: FileService) { }
    //Variable control loading
    isLoading: boolean = true;

    files: IFileInfoDto[] = [];

    ngOnInit(): void {
        this._fileService.files()
        .pipe(finalize(()=>{
            this.isLoading = false;
        }))
        .subscribe(rs => {
            this.files = rs;
        })
    }
}
```
```html
<div class="position-relative" [busy]="isLoading">
    <p-table [value]="files">
        <ng-template pTemplate="header">
            <tr>
                <th scope="col">#</th>
                <th scope="col">Filename</th>
                <th scope="col">CreateAt</th>
                <th scope="col">CreateBy</th>
                <th scope="col">Action</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-file>
            <tr>
                <td>{{file.id}}</td>
                <td>{{file.fileName}}</td>
                <td>{{convertToShortDate(file.createAt)}}</td>
                <td>{{file.createBy}}</td>
                <td>
                    <button (click)="download(file.fileId)">
                        Download
                    </button>
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>
```

### 5.4 <u>Component</u>
#### a. <u>DataNotFound Component</u>
<b>Postion:</b> `src/shared/ui/data-not-found/`.<br>
<b>Usage:</b> Hiển thị message thông báo khi table không có row nào được hiển thị, được dùng trong ptable.<br>
+ Input:
    - <b>isLoading</b>: Nếu true text sẽ bị mất, defult: false<br>

<b>Note:</b> 
+ Khi sử dụng table vui lòng sử dụng scoll ngang để tối ưu trên màn hình nhở (responsive) bằng thuộc tính như sau: `[scrollable]="true" class="only-horizontal" scrollDirection="horizontal" responsiveLayout="scroll"`
+ Luôn đặt `app-data-not-found` bên trong ` pTemplate="emptymessage"` <br>

<b>Ex:</b>

```html
<p-table [value]="items" [scrollable]="true" class="only-horizontal" scrollDirection="horizontal"
            responsiveLayout="scroll" [busy]="isLoadingDetailReport">
    <ng-template pTemplate="header">
        <tr>
            <th style="width: 105px;">Mã cơ hội</th>
            <th style="width: 105px;">Mã YCKS</th>
            <th style="width: 275px;">Khách hàng</th>
            <th style="width: 120px;">SĐT ĐK</th>
            <th style="width: 150px;">Sale</th>
            <th style="width: 150px;">Kỹ thuật</th>
            <th style="width: 160px;">Ngày đề nghị KS</th>
            <th style="width: 175px;">Trạng thái</th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
        <tr>
            <td style="width: 105px;">{{item.opportunityCode}}</td>
            <td style="width: 105px;">{{item.surveyCode}}</td>
            <td style="width: 275px;">{{item.customerName}}</td>
            <td style="width: 120px;">{{item.phoneNumber}}</td>
            <td style="width: 150px;">{{item.saleMan?.split('@')[0]}}</td>
            <td style="width: 150px;">{{item.assignTo?.split('@')[0]}}</td>
            <td style="width: 160px;">{{item.actualSurveyDate | date: 'dd/MM/yyyy'}}</td>
            <td style="width: 175px;">
                <span class="font-size-16 badge" [ngClass]="{
                    'badge-soft-info': rowIndex%3 == 0,
                    'badge-soft-danger': rowIndex%3 == 1,
                    'badge-soft-warning': rowIndex%3 == 2
                }">
                    {{item.status}}
                </span>
            </td>
        </tr>
    </ng-template>
    <ng-template pTemplate="emptymessage" let-columns>
        <app-data-not-found [isLoading]="isLoadingDetailReport"></app-data-not-found>
    </ng-template>
</p-table>
```

#### b. <u>PageTitle Component (bread crumb)</u>
<b>Postion:</b> `src/shared/ui/pagetitle/`.<br>
<b>Usage:</b> Sử dụng để hiện thị hệ thống phân cấp trang.<br>
+ Input:
    - <b>breadcrumbItems</b>: Array chứa thông tin phân cấp<br>
    - <b>title</b>: Title của page<br>

<b>Ex:</b>

```ts
breadCrumbItems = [
        { label: 'MES', path: '' }
        , { label: 'Quản lý nhà cung cấp', path: '/supplier-management' }
        , { label: 'Đối soát nhà cung cấp', path: '/supplier-management/supplier-control' }
        , { label: 'Chi tiết đối soát Nhà cung cấp', active: true }
    ];
```
```html
<app-pagetitle title="Chi tiết đối soát Nhà cung cấp" [breadcrumbItems]="breadCrumbItems"></app-pagetitle>
```

#### c. <u>paginator Component</u>
<b>Postion:</b> `src/shared/ui/paginator/`.<br>
<b>Usage:</b> Sử dụng để phân trang.<br>
+ Input:
    - <b>totalCount</b>: Tổng số hàng<br>
    - <b>currentPage</b>: Page được chọn để hiển thị, page này sẽ ko out ra ngoài,  handle sự kiện <br>

+ Output:
    - <b>onPageChange</b>: Sự kiện khi thay đổi page, thay đó<br>

+ Templates:
    - <b>left</b>: Custom nội dung bên trái<br>
    - <b>right</b>: Custom nội dung bên phải<br>

<b>Ex:</b>

```html

<app-paginator (onPageChange)="onPageChangeReportDetail($event)" [totalCount]="reportDetailTotalCount"
    [isLoading]="isLoadingDetailReport" [currentPage]="reportDetailCurentPage">
</app-paginator>
```
#### d. <u>select-box Component</u>
<b>Postion:</b> `src/shared/ui/select-box/`.<br>
<b>Usage:</b> Component mở rộng của ng-select, hỗ trợ  tìm kiếm và scroll to load more .<br>
+ Input:
    - <b>url:</b> Url của service cần gọi đến,  chú ý url bắt đầu từ, default `null`.
    - <b>searchQuery(object):</b> Bổ sung điều kiện search nếu cần, default `null`.
    - <b>placeholder(string):</b> Placeholder, default `null`.
    - <b>multiple(boolean): </b> Cho phép chọn nhiều, default `true`
    - <b>minTermLength(number): </b>Sẽ tìm kiếm khi người dùng nhập từ  minTermLength trở lên, defaul `1` (nhập sẽ tìm)
    - <b>notFoundText(string): </b> Text hiển thị khi người dùng không tìm thấy kết quả, default `Không có kết quả được tìm thấy`
    - <b>required(bool):</b> Bắt validate required, default false.
    - <b>submitted(bool):</b> Dùng cho validate, khi required == true và không có giá trị được chọn sẽ báo đỏ khi submitted = true, default: `false`
    - <b>labelForId:</b>  Hỗ trợ cho thẻ for
+ Output:
    - <b>change</b>: Event fire khi người dùng thay đổi  lựa  chọn.
+ Two way:
    - <b>values:</b> Giá trị được chọn

<b>Required:</b> </br>
+ Output của api trả về bắt buộc phải có interface là `SelectBoxOutputDto<any>`
+ (Backend) Input của method trả data phải được kế thừa từ `ISelectBoxRequestDto`,  có thể sử dụng implement của interface này là `SelectBoxRequestDto` nếu bạn không bổ sung thêm điều kiện.

### 5.5 Global Function (myApp namespace)
#### a. myApp.moment.changeOnlyTimeZone(date: Date,format: string)

<b>Usage:</b> Xử lý khi convert datetime `p-calendar` sang muối giờ 0.<br>
+ Input
    - <b>date:</b> Thời gian chọn từ `p-calendar`
    - <b>format:</b> Định dạng (độ chi tiết tỉ lệ với độ chính xác)

<b>Ex:</b>

```ts
let createdAtStart = myApp.moment.changeOnlyTimeZone(this.searchForm.controls['createdAtStart'].value)
```
#### c. myApp.ui.setBusy(elm?:any, text?: string, delay?: string)
<b>Usage:</b> Hiển thị một vòng tròn đợi waiting, thường sử dụng để đợi import, export...
<b>Input:</b>
+ <b>elm</b>: Phần tử phần tử cha chưa loading, defaul `body`
+ <b>text:</b> Text hiển thị trong quá trình loading, default `null`
+ <b>delay:</b> Thời gian chờ, default `0`

<b>Ex: </b>

```ts
//Call service export
this._surveyService.export(this.searchQuery)
    .pipe(
        tap(()=>myApp.ui.setBusy()),
        finalize(()=>myAp.ui.clearBusy())
    )
.subcirebe(rs => {
    aveAs(rs.data, `Survey_${moment(new Date()).format('YYYYMMDDHHmmss')}.xlsx`)
})
```

#### b. myApp.ui.clearBusy(elm?:any)
<b>Usage:</b> Xóa phần tử waiting khỏi elm...
<b>Input:</b>
+ <b>elm</b>: Phần tử phần tử cha chứa loading, defaul `body`

<b>Ex: </b>

```ts
//Call service export
this._surveyService.export(this.searchQuery)
    .pipe(
        tap(()=>myApp.ui.setBusy()),
        finalize(()=>myAp.ui.clearBusy())
    )
.subcirebe(rs => {
    aveAs(rs.data, `Survey_${moment(new Date()).format('YYYYMMDDHHmmss')}.xlsx`)
})
```

#### c. myApp.ui.scrollToElement(selector: string, options?: ScrollToElementOptions)
<b>Usage:</b> Scroll tới vị trí của phần tử đầu tiên được tìm thấy trong selector
<b>Input:</b>
+ <b>selector</b>: element muốn sroll tới
+ <b>options</b>: ScrollToElementOptions Các tùy chọn khi scroll
<b>return</b>: Object chứa kết quả thành công hay  thất bại và message.

<b>Ex: </b>

```ts
//Call service export
this._surveyService.search(this.searchQuery)
    .pipe(
        tap(()=>this.isLoading = true),
        finalize(async ()=>{
            await myApp.ui.scrollToElement('#searchResultTable')
            this.isLoading = false;
        })
    )
.subcirebe(rs => {
    this.surveys = rs.items;
    this.totalCount = rs.totalCount;
})
```











