export interface debtLogResponse {
    invoicelogid: number
    content: string
    interacttype: number
    createduser: string
    crateat?: Date
    updateuser: string
    updateat?: Date
    invoicedebtid: number
    invoicenumber: string
  }

  export interface RequestDebtLog {
    invoicenumber: string
    isViewDetail: boolean
    fetch: number
    offset: number
  }

  export interface InseartUpdateDebtLog {
    invoicedebtlogid: number
    invoicenumber: string
    content: string
    interacttype: number
    creatAt?: Date
  }

  export interface ImportFileLog {
    invoiceId: number
    file: any
  }

  export interface deleteLog {
    invoicedebtlogid: number
  }

