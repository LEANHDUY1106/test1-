import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { DashboardService } from '@shared/service-proxy/dashboard/dashboard.service';
import { finalize } from 'rxjs/operators';
import { AppSessionService } from '@shared/session/app-session.service';
import { DashBoardProcessingTaskByUserRequestData, getDashboardStatusInput, getDashboardTypeInput } from '@shared/service-proxy/dashboard/models/dashBoardProcessingTaskByUserDto';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    isCheckWidth: boolean;
    @HostListener('window:resize', ['$event'])
    onResize() {
        if (window.innerWidth < 768) {
            this.isCheckWidth = false;
        } else {
            this.isCheckWidth = true;
        }
    }
    //form
    searchFormProcess: FormGroup;
    searchFormType: FormGroup;
    searchFormStatus: FormGroup;

    constructor(private _titleService: Title,
        private _fb: FormBuilder,
        private session: AppSessionService,
        private _messageService: MessageService,
        private _dataService: DataStateLeftMenuService,
        private _dashboardService: DashboardService) {
        this.searchFormType = this._fb.group({
            createdFrom: [null],
            createdTo: [null]
        });
        this.searchFormStatus = this._fb.group({
            createdFrom: [null],
            createdTo: [null]
        });
    }

    searchFormSubmit: boolean = false;
    isLoading: boolean = false;
    myAssign: number;
    isStateLeftMenu: boolean;
    emailProcessingTask: DashBoardProcessingTaskByUserRequestData = {
        email: this.session.user.userName
    };
    startDateStatus: string;
    endDateStatus: string;
    startDateType: string;
    endDateType: string;
    ngOnInit(): void {
        this._titleService.setTitle('Welcome to DX-Request');
        this.isLoading = true;
        if (window.innerWidth < 768) {
            this.isCheckWidth = false;
        } else {
            this.isCheckWidth = true;
        }
        //lấy trạng tháistate
        this._dataService.currentState.subscribe(state => {
            this.isStateLeftMenu = state;
        });
        this.onSearchPieChartType();
        this.onSearchPieChartStatus();
    }

    //chart
    chartTypeDatas: any;
    charStatustDatas: any;
    chartOptions: any = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context?.raw + "%";
                        return label;
                    }
                }
            }
        }
    };

    onSearchPieChartType() {
        //ngày bắt đầu đã là thời điểm đầu 0h00p
        let tempStartDate = this.searchFormType.controls['createdFrom'].value && myApp.moment.changeOnlyTimeZone(this.searchFormType.controls['createdFrom'].value);
        let tempEndDate = this.searchFormType.controls['createdTo'].value && myApp.moment.changeOnlyTimeZone(this.searchFormType.controls['createdTo'].value);
        if (tempStartDate >= new Date()) {
            this._messageService.add({
                severity: 'error',
                detail: 'Ngày bắt đầu phải trước ngày hiện tại hoặc là ngày hiện tại!',
            });
            return;
        }
        //
        if (tempStartDate != undefined && tempEndDate != undefined) {
            if (tempStartDate > tempEndDate) {
                this._messageService.add({
                    severity: 'error',
                    detail: 'Ngày bắt đầu phải bằng hoặc trước ngày đến!',
                });
                return;
            }
        }

        //lấy thời điểm cuối cùng trong ngày 23h59p59s
        tempEndDate = tempEndDate ? new Date(new Date(new Date(tempEndDate.setHours(23)).setMinutes(59)).setSeconds(59)) : undefined;

        //lấy input
        if (tempStartDate != undefined || tempEndDate != undefined) {
            let input: getDashboardTypeInput = {
                fromDate: tempStartDate ? this.dateTimeToString(tempStartDate, 'dd/MM/yyyy') : '01/01/2022',
                toDate: tempEndDate ? this.dateTimeToString(tempEndDate, 'dd/MM/yyyy') : this.dateTimeToString(new Date(), 'dd/MM/yyyy'),
                postType: 0
            }
            this.startDateType = tempStartDate ? this.dateTimeToString(tempStartDate, 'dd/MM/yyyy') : '01/01/2022';
            this.endDateType = tempEndDate ? this.dateTimeToString(tempEndDate, 'dd/MM/yyyy') : this.dateTimeToString(new Date(), 'dd/MM/yyyy');
            this.getDataPieChart(input);
        } else {
            //chỉ lấy 1 tháng lùi về nếu không fillter
            this.startDateType = '01/01/2022';
            this.endDateType = this.dateTimeToString(new Date(), 'dd/MM/yyyy');
            this.getDataPieChart({
                fromDate: '01/01/2022',
                toDate: this.dateTimeToString(new Date(), 'dd/MM/yyyy'),
                postType: 0
            });
        }
    }
    checkDataType: boolean = false;
    getDataPieChart(input: getDashboardTypeInput) {
        this.isLoading = true;
        this._dashboardService
            .postType(input)
            .pipe(
                finalize(async () => {
                    this.isLoading = false;
                })
            )
            .subscribe((result) => {
                if (result.data.serviceName == null) {
                    this.checkDataType = true;
                } else {
                    this.checkDataType = false;
                }
                this.chartTypeDatas = {
                    labels: result.data.serviceName,
                    datasets: [
                        {
                            data: result.data.total,
                            backgroundColor: ['#6633CC', '#28A745', '#E5B30A', '#dc3545', '#212529', '#FF00FF', '#008080', '#FF6600', '#9900FF', '#000011', '#2F4F4F', '#104E8B', '#20B2AA'],
                            hoverBackgroundColor: ['#6633CC', '#28A745', '#E5B30A', '#dc3545', '#212529', '#FF00FF', '#008080', '#FF6600', '#9900FF', '#000011', '#2F4F4F', '#104E8B', '#20B2AA'],
                            // backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#33CC00', '#FF0000', '#FF00FF', '#008080', '#FF6600', '#9900FF', '#000011', '#2F4F4F', '#104E8B', '#20B2AA'],
                            // hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#33CC00', '#FF0000', '#FF00FF', '#008080', '#FF6600', '#9900FF', '#000011', '#2F4F4F', '#104E8B', '#20B2AA'],
                        },
                    ],
                };

            });
    }
    onSearchPieChartStatus() {
        //ngày bắt đầu đã là thời điểm đầu 0h00p
        let tempStartDate = this.searchFormStatus.controls['createdFrom'].value && myApp.moment.changeOnlyTimeZone(this.searchFormStatus.controls['createdFrom'].value);
        let tempEndDate = this.searchFormStatus.controls['createdTo'].value && myApp.moment.changeOnlyTimeZone(this.searchFormStatus.controls['createdTo'].value);
        if (tempStartDate >= new Date()) {
            this._messageService.add({
                severity: 'error',
                detail: 'Ngày bắt đầu phải trước ngày hiện tại hoặc là ngày hiện tại!',
            });
            return;
        }
        //
        if (tempStartDate != undefined && tempEndDate != undefined) {
            if (tempStartDate > tempEndDate) {
                this._messageService.add({
                    severity: 'error',
                    detail: 'Ngày bắt đầu phải bằng hoặc trước ngày đến!',
                });
                return;
            }
        }
        //lấy thời điểm cuối cùng trong ngày 23h59p59s
        tempEndDate = tempEndDate ? new Date(new Date(new Date(tempEndDate.setHours(23)).setMinutes(59)).setSeconds(59)) : undefined;

        //lấy input
        if (tempStartDate != undefined || tempEndDate != undefined) {
            let input: getDashboardStatusInput = {
                fromDate: tempStartDate ? this.dateTimeToString(tempStartDate, 'dd/MM/yyyy') : '01/01/2022',
                toDate: tempEndDate ? this.dateTimeToString(tempEndDate, 'dd/MM/yyyy') : this.dateTimeToString(new Date(), 'dd/MM/yyyy'),
                status: 0
            }
            this.startDateStatus = tempStartDate ? this.dateTimeToString(tempStartDate, 'dd/MM/yyyy') : '01/01/2022';
            this.endDateStatus = tempEndDate ? this.dateTimeToString(tempEndDate, 'dd/MM/yyyy') : this.dateTimeToString(new Date(), 'dd/MM/yyyy');
            this.getDataStatusChart(input);
        } else {
            this.startDateStatus = '01/01/2022';
            this.endDateStatus = this.dateTimeToString(new Date(), 'dd/MM/yyyy');
            this.getDataStatusChart({
                fromDate: '01/01/2022',
                toDate: this.dateTimeToString(new Date(), 'dd/MM/yyyy'),
                status: 0
            });
        }
    }
    checkDataStatus: boolean = false;
    getDataStatusChart(input: getDashboardStatusInput) {
        this.isLoading = true;
        this._dashboardService
            .postStatus(input)
            .pipe(
                finalize(async () => {
                    this.isLoading = false;
                })
            )
            .subscribe((result) => {
                if (result.data.serviceName == null) {
                    this.checkDataStatus = true;
                } else {
                    this.checkDataStatus = false;
                }
                //kiểm tra xem có trạng thái từ chối không
                let checkStatusCancel = false;
                if (result.data.serviceName.length == 5) {
                    checkStatusCancel = true;
                }
                this.charStatustDatas = {
                    labels: result.data.serviceName,
                    datasets: [
                        {
                            data: result.data.total,
                            backgroundColor: checkStatusCancel ? ['#E5B30A', '#0E69AD', '#28A745', '#dc3545', '#212529', '#FF00FF'] : ['#E5B30A', '#0E69AD', '#28A745', '#212529', '#dc3545', '#FF00FF'],
                            hoverBackgroundColor: checkStatusCancel ? ['#E5B30A', '#0E69AD', '#28A745', '#dc3545', '#212529', '#FF00FF'] : ['#E5B30A', '#0E69AD', '#28A745', '#212529', '#dc3545', '#FF00FF'],
                        },
                    ],
                };

            });
    }
    //parst Date to string DD/MM/YY
    dateTimeToString(date: Date, fomat: string) {
        if (date == null) return '';

        let pipe = new DatePipe('en-US');

        return pipe.transform(date, fomat);
    }
}
