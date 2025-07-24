import * as Yup from 'yup';

export const invoiceValidationSchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  type: Yup.string().required('Type is required'),
  dueDate: Yup.string().required('Due date is required'),
  amount: Yup.number().required('Amount is required'),
  residenceId: Yup.number().nullable().required('Resident ID is required'),
  companyId: Yup.number().nullable().required('Company ID is required')
});
