export interface Bill {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  type: BillType;
  status: BillStatus;
  priority: BillPriority;
  companyName: string;
  userName: string;
  totalPaid: number;
  remainingAmount: number;
}

export interface CreateBillRequest {
  name: string;
  amount: number;
  dueDate: string;
  type: BillType;
  residenceId: number;
  companyId: number;
}

export enum BillType {
  ELECTRICITY = 'ELECTRICITY',
  COLD_WATER = 'COLD_WATER',
  HOT_WATER = 'HOT_WATER',
  GAS = 'GAS',
  INTERNET = 'INTERNET',
  HOUSE_SERVICE = 'HOUSE_SERVICE'
}

export enum BillStatus {
  OPEN = 'OPEN',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export enum BillPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  OVERDUE = 'OVERDUE'
}