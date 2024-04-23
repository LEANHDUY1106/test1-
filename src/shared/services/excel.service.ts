import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() {
  }

  exportExcelPrepare(excelData, fileName:string, option: (worksheet: any)=>void){

    //Create a workbook with a worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(excelData.sheetName);

    option(worksheet)

    // Adding Data with Conditional Formatting
    excelData.data.forEach(d => {
        let row = worksheet.addRow(d);
            row.font = {
                name: 'Calibri',
                size: 11,
                bold: false,
            }
        }
    );

    workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, fileName + '.xlsx');
      })
}

exportToExcel(sheetName:string = "sheetName",fileName:string = "example",data:any[],option: (worksheet: any)=>void) {

    let dataForExcel = [];
    data.forEach((row: any) => {
      dataForExcel.push(Object.values(row))
    })

    let reportData = {
      sheetName:sheetName,
      data: dataForExcel
    }

    this.exportExcelPrepare(reportData,fileName, option);
  }
}


