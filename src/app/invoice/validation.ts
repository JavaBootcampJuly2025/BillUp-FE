import * as Yup from 'yup';

export const invoiceValidationSchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  type: Yup.string().required('Type is required'),
  dueDate: Yup.string().required('Due date is required'),
  amount: Yup.number().typeError('Amount must be a number').required('Amount is required'),
  residenceId: Yup.number().typeError('Resident ID must be a number').required('Resident ID is required'),
  companyId: Yup.number().typeError('Company ID must be a number').required('Company ID is required')
});