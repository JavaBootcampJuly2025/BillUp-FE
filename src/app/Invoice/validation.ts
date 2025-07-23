import * as Yup from 'yup';

export const invoiceValidationSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  utility: Yup.string().oneOf(['ELECTRICITY', 'WATER', 'INTERNET']).required('Utility is required'),
  month: Yup.string().required('Month is required'),
  dueDate: Yup.string().required('Due date is required'),
  value: Yup.string().required('Value is required'),

  residence: Yup.object().shape({
    streetAddress: Yup.string().required('Street Address is required'),
    flatNumber: Yup.string().required('Flat Number is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
  }),
});
