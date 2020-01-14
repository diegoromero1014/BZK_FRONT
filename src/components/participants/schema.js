import * as Yup from 'yup';

export const schema = Yup.object().shape({
    text: Yup.string().required('El campo es requerido'),
});


