import { ZodType, z } from 'zod';
import { RegisterFormData } from './types';

export const RegistrationSchema: ZodType<RegisterFormData> = z
    .object({
        name: z
            .string()
            .min(1, { message: 'Name is required.' })
            .max(50, { message: 'Name cannot exceed 50 characters.' }),

        surname: z
            .string()
            .min(1, { message: 'Surname is required.' })
            .max(50, { message: 'Surname cannot exceed 50 characters.' }),

        residency: z
            .string()
            .min(1, { message: 'Residency is required.' })
            .max(50, { message: 'Residency cannot exceed 50 characters.' }),

        email: z
            .string()
            .min(1, { message: 'Email address is required.' })
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, {
                message: 'Invalid email address format.'
            }),

        phoneNumber: z
            .string()
            .min(1, { message: 'Phone number is required.' })
            .max(15, { message: 'Phone number cannot exceed 15 characters.' })
            .regex(/^\+[1-9]\d{8,14}$/, {
                message:
                    'Invalid phone number format. Must be in international E.164 format (e.g. +123456789).'
            }),

        role: z.enum(['CLIENT', 'COMPANY'] as const, {
            message: 'Role is required and must be either CLIENT or COMPANY.'
        }),

        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long.' })
            .max(50, { message: 'Password cannot exceed 50 characters.' })
            .regex(/[A-Z]/, {
                message: 'Password must include at least one uppercase letter.'
            })
            .regex(/[a-z]/, {
                message: 'Password must include at least one lowercase letter.'
            })
            .regex(/\d/, { message: 'Password must include at least one number.' })
            .regex(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/, {
                message: 'Password must include at least one special character.'
            }),

        repeatedPassword: z
            .string()
            .min(1, { message: 'Please confirm your password.' })
    })
    .refine((values) => values.password === values.repeatedPassword, {
        message: 'Passwords must match!',
        path: ['repeatedPassword']
    });
