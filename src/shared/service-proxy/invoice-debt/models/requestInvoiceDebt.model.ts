export interface RequestInvoiceDebt {
  p_contractnumber: string
  invoicenumber: string
  p_demaccount: string
  p_status: string
  startDate?: Date
  endDate?: Date
  customername: string
  createdUser: string
  orderBy: string
  isSortDesc: boolean
  taxcode: string
  fetch: number
  offset: number
}

export interface RequestInvoiceDebtExprot {
  p_contractnumber: string
  invoicenumber: string
  p_demaccount: string
  p_status: string
  startDate?: Date
  endDate?: Date
  customername: string
  createdUser: string
  orderBy: string
  isSortDesc: boolean
  fetch: number
  offset: number
  exportType: number
}

export interface ResponseInvoiceDebt {
  invoiceid: number
  region: string
  branch: string
  contractnumber: string
  customername: string
  taxcode: string
  invoicenumber: string
  invoicedate: string
  totalamount: number
  department: string
  saleaccount: string
  demaccount: string
  servicename: string
  totaldebt: number
  statusname: any
  interacttype: number
  updateat: string
  createuser: string
  updateuser: any
  status: string
  createat: string
}