import * as Yup from 'yup';

export const schema = Yup.object().shape({
    campo: Yup.string().required('Es requerido')
});