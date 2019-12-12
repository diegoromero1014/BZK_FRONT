import * as Yup from 'yup';

export const schema = Yup.object().shape({
    visitType: Yup.string().required('Es requerido')
});