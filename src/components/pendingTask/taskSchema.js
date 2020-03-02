import * as Yup from 'yup';
import {
    patternOfForbiddenCharacter, patternOfForbiddenCharacter2,
    patternOfOnlyAlphabetical, patternOfTaskObservation, regexHtmlInjection
} from '../../validationsFields/patternsToValidateField';
import {
    MESSAGE_ERROR_INJECTION_HTML,
    MESSAGE_REQUIRED_EMPLOYEE,
    MESSAGE_REQUIRED_FIELD,
    MESSAGE_REQUIRED_VALUE,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER,
    MESSAGE_WARNING_ONLY_ALPHABETICAL,
    MESSAGE_WARNING_TASK_OBSERVATIONS
} from '../../validationsFields/validationsMessages';
import {validateHtmlInjection} from "../../validationsFields/rulesField";

export const schema = {
    finalDate: Yup.date()
        .required(MESSAGE_REQUIRED_VALUE)
        .typeError(MESSAGE_REQUIRED_FIELD("Fecha de cierre")),
    idStatus: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_VALUE)
        .typeError(MESSAGE_REQUIRED_FIELD("Estado")),
    employeeName: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_EMPLOYEE)
        .matches(patternOfOnlyAlphabetical, MESSAGE_WARNING_ONLY_ALPHABETICAL)
        .typeError(MESSAGE_REQUIRED_EMPLOYEE),
    task: Yup.string()
        .trim()
        .required(MESSAGE_REQUIRED_FIELD("Tarea")),
    advance: Yup.string()
        .trim()
        .matches(patternOfTaskObservation, MESSAGE_WARNING_TASK_OBSERVATIONS)
        .matches(patternOfForbiddenCharacter2, { message: MESSAGE_WARNING_FORBIDDEN_CHARACTER, excludeEmptyString: true })
        .test('validateInjectionHtml', MESSAGE_ERROR_INJECTION_HTML, validateHtmlInjection)
        .nullable()
};