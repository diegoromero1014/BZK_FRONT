import * as Yup from 'yup';

export const schema = {
    documentType: Yup.string().required('El tipo de visita es obligatorio'),
    visitTime: Yup.date().required('La fecha es obligatoria').typeError('La fecha es obligatoria'),
    endTime: Yup.number().required('La duración es obligatoria').typeError('El valor debe ser númerico'),
    visitLocation: Yup.string().required('El lugar es obligatorio'),
    principalObjective: Yup.string().required('El objetivo es obligatorio'),
};