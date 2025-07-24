import {BillType} from "@/types/bill";

export interface InvoiceForm {
  name: string;
  amount: number;
  dueDate: string;
  type: BillType;
  residenceId: number;
}