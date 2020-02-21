import * as Yup from 'yup';
import { patternOfPlaceOfPrevisit, regexNumbers } from '../../validationsFields/patternsToValidateField';
import { MESSAGE_WARNING_PLACE_OF_PREVISIT, MESSAGE_WARNING_ONLY_NUMBERS, MESSAGE_WARNING_NUMBER_LENGTH, MESSAGE_WARNING_MAX_LENGTH } from '../../validationsFields/validationsMessages';
import { checkRichTextRequiredBoolean } from '../../validationsFields/rulesField';

export const schema = {
    finalDate: Yup.date()
        .required('La fecha de cierre es obligatoria')
        .typeError('La fecha de cierre es obligatoria'),
    idStatus: Yup.string()
        .required('El estado de la tarea es obligatorio')
        .typeError('El estado de la tarea es obligatorio'),
    userName: Yup.string()
        .required('El responsable es obligatorio')
        .typeError('El responsable es obligatorio'),
    task: Yup.string()
        .required('La tarea es obligatoria'),
    advance: Yup.string()
        .nullable()
};