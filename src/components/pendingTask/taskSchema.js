import * as Yup from 'yup';
import {
    patternOfForbiddenCharacter2,
    patternOfOnlyAlphabetical,
    patternOfTaskObservation
} from '../../validationsFields/patternsToValidateField';
import {
    MESSAGE_ERROR_INJECTION_HTML,
    MESSAGE_REQUIRED_EMPLOYEE,
    MESSAGE_REQUIRED_FIELD,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER, MESSAGE_WARNING_MAX_LENGTH,
    MESSAGE_WARNING_ONLY_ALPHABETICAL,
    MESSAGE_WARNING_TASK_OBSERVATIONS
} from '../../validationsFields/validationsMessages';
import {checkRichTextRequiredBoolean, validateHtmlInjection} from "../../validationsFields/rulesField";

export const schema = {
    finalDate: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_FIELD("Fecha de cierre"))
        .typeError(MESSAGE_REQUIRED_FIELD("Fecha de cierre")),
    idStatus: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_FIELD("Estado"))
        .typeError(MESSAGE_REQUIRED_FIELD("Estado")),
    employeeName: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_EMPLOYEE)
        .matches(patternOfOnlyAlphabetical, MESSAGE_WARNING_ONLY_ALPHABETICAL)
        .max(50, MESSAGE_WARNING_MAX_LENGTH(50))
        .typeError(MESSAGE_REQUIRED_EMPLOYEE),
    task: Yup.string()
        .trim()
        .test('validateInjectionHtml', MESSAGE_REQUIRED_FIELD("Tarea"), checkRichTextRequiredBoolean),
    advance: Yup.string()
        .trim()
        .matches(patternOfTaskObservation, MESSAGE_WARNING_TASK_OBSERVATIONS)
        .matches(patternOfForbiddenCharacter2, {message: MESSAGE_WARNING_FORBIDDEN_CHARACTER, excludeEmptyString: true})
        .test('validateInjectionHtml', MESSAGE_ERROR_INJECTION_HTML, validateHtmlInjection)
        .max(1000, MESSAGE_WARNING_MAX_LENGTH(1000))
        .nullable()
};