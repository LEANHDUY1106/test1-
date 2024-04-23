export interface requestDetailDebt {
    invoicedebtid: number
  }

  export interface responseDetailDebt {
    invoiceid: number
    region: string
    branch: string
    contractnumber: string
    customername: string
    taxcode: string
    invoicenumber: string
    invoicedate?: Date
    totalamount: number
    department: string
    saleaccount: string
    demaccount: string
    servicename: string
    totaldebt: number
    statusname: string
    interacttype: number
    updateat?: Date
    createuser: any
    updateuser: any
    invoicetypename: string
    status: number
    createat: Date
    receiverestimatedate?: Date
  }

  export interface UpdateStatusDebt {
    invoicedebtid: number
    status: number
  }

  export interface requestDetailDebtUpdate {
    invoiceid: number
    region: string
    branch: string
    contractnumber: string
    customername: string
    taxcode: string
    invoicenumber: string
    invoicedate?: Date
    totalamount: number
    department: string
    saleaccount: string
    demaccount: string
    servicename: string
    totaldebt: number
    statusname: string
    interacttype: number
    updateat?: Date
    createuser: string
    updateuser: string
    status: number
    createat?: Date
    receiverestimatedate?: Date
    invoicetypename: string
  }
