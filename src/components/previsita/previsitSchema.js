import * as Yup from 'yup';
import { patternOfPlaceOfPrevisit, regexNumbers } from '../../validationsFields/patternsToValidateField';
import { MESSAGE_WARNING_PLACE_OF_PREVISIT, MESSAGE_WARNING_ONLY_NUMBERS, MESSAGE_WARNING_NUMBER_LENGTH, MESSAGE_WARNING_MAX_LENGTH } from '../../validationsFields/validationsMessages';
import { checkRichTextRequiredBoolean } from '../../validationsFields/rulesField';

export const schema = {
    documentType: Yup.string()
        .required('El tipo de visita es obligatorio'),
    visitTime: Yup.date()
        .required('La fecha es obligatoria')
        .typeError('La fecha es obligatoria'),
    endTime: Yup.string()
        .required('La duración es obligatoria')
        .matches(regexNumbers, MESSAGE_WARNING_ONLY_NUMBERS)
        .max(4, MESSAGE_WARNING_NUMBER_LENGTH(4))
        .typeError('El valor debe ser numérico'),
    visitLocation: Yup.string()
        .required('El lugar es obligatorio')
        .matches(patternOfPlaceOfPrevisit, MESSAGE_WARNING_PLACE_OF_PREVISIT)
        .max(150, MESSAGE_WARNING_MAX_LENGTH(150)),
    principalObjective: Yup.string()
        .nullable()
        .when("documentStatus", {
            is: 1,
            then: Yup.string().test('principalObjectiveRequired', 'El objetivo es obligatorio', value => checkRichTextRequiredBoolean(value))
        })
};