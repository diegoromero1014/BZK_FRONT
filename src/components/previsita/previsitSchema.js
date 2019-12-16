import * as Yup from 'yup';

export const schema = Yup.object().shape({
    typeVisit: Yup.string().required('Es requerido')
});