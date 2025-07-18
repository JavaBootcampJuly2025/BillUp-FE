export interface RegisterFormData {
    name: string;
    surname: string;
    password: string;
    residency: string;
    repeatedPassword: string;
    email: string;
    phoneNumber: string;
    role: 'CLIENT' | 'COMPANY';
}

export interface RegisterSuccessResponseType {
    name: string;
    surname: string;
    email: string;
    residency: string;
    createdAt: string;
    updatedAt: string;
    role: 'CLIENT' | 'COMPANY';
}