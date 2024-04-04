import * as yup from 'yup';

export const createGroupSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .required('Name is required'),
});
