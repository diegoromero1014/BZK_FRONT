import * as Yup from 'yup';

export const schema = Yup.object().shape({
    field: Yup.string().required('El campo es requerido'),
});


