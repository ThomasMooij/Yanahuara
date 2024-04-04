import * as yup from "yup";

const peruvianPhoneRegExp = /^\(0[1-9]\) [0-9]{6,7}$|^9[0-9]{8}$/; //inprincipe juiste regexp

export const createUserSchema = yup.object().shape({
  firstName: yup.string().required("Nombre obligatorio"),
  lastName: yup.string().required("Apellido obligatorio"),
  email: yup
    .string()
    .email("Correo electronico no es valido")
    .required("Correo electronico obligatorio"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  phoneNumber: yup
    .string()
    .matches(peruvianPhoneRegExp, "Phone number is not valid")
    .required("Phone number is required"),
});
