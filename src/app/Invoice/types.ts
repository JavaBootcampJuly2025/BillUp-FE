export interface Residence {
    streetAddress: string;
    flatNumber: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface InvoiceForm {
    companyName: string;
    utility: "ELECTRICITY" | "WATER" | "INTERNET";
    month: string;
    dueDate: string;
    value: string;
    role: 'COMPANY';
    residence: Residence;
}