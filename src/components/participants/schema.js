import * as Yup from 'yup';
import { patternClientObjective, patternOfForbiddenCharacter2, patternOfNameOtherParticipant, patternOfPositionOtherParticipant, patternOfCompanyOtherParticipant } from '../../validationsFields/patternsToValidateField';
import { MESSAGE_ERROR_PATTERN_CLIENT_OBJECTIVE, MESSAGE_WARNING_FORBIDDEN_CHARACTER, MESSAGE_ERROR_INJECTION_HTML, MESSAGE_WARNING_NAME_OTHER_PARTICIPANT, MESSAGE_WARNING_POSITION_OTHER_PARTICIPANT, MESSAGE_WARNING_COMPANY_OTHER_PARTICIPANT } from '../../validationsFields/validationsMessages';
import { validateHtmlInjection } from '../../validationsFields/rulesField';

export const schema = Yup.object().shape({
    text: Yup
        .string()
        .trim()
        .max(700, "Solo se permiten 700 caracteres.")
        .test('validateHtmlInjection', MESSAGE_ERROR_INJECTION_HTML, validateHtmlInjection)
        .matches(patternOfForbiddenCharacter2, { message: MESSAGE_WARNING_FORBIDDEN_CHARACTER, excludeEmptyString: true })
        .matches(patternClientObjective, { message: MESSAGE_ERROR_PATTERN_CLIENT_OBJECTIVE, excludeEmptyString: true })
        .required('El campo objetivos del interlocutor es requerido'),
});

export const schemaOthers = Yup.object().shape({
    name: Yup
        .string()
        .trim()
        .test('validateHtmlInjection', MESSAGE_ERROR_INJECTION_HTML, validateHtmlInjection)
        .matches(patternOfForbiddenCharacter2, { message: MESSAGE_WARNING_FORBIDDEN_CHARACTER, excludeEmptyString: true })
        .matches(patternOfNameOtherParticipant, { message: MESSAGE_WARNING_NAME_OTHER_PARTICIPANT, excludeEmptyString: true })
        .required('El campo nombre es requerido'),
    position: Yup
        .string()
        .trim()
        .max(1000, "Solo se permiten 1000 caracteres.")
        .test('validateHtmlInjection', MESSAGE_ERROR_INJECTION_HTML, validateHtmlInjection)
        .matches(patternOfForbiddenCharacter2, { message: MESSAGE_WARNING_FORBIDDEN_CHARACTER, excludeEmptyString: true })
        .matches(patternOfPositionOtherParticipant, { message: MESSAGE_WARNING_POSITION_OTHER_PARTICIPANT, excludeEmptyString: true }),
    company: Yup
        .string()
        .trim()
        .test('validateHtmlInjection', MESSAGE_ERROR_INJECTION_HTML, validateHtmlInjection)
        .matches(patternOfForbiddenCharacter2, { message: MESSAGE_WARNING_FORBIDDEN_CHARACTER, excludeEmptyString: true })
        .matches(patternOfCompanyOtherParticipant, { message: MESSAGE_WARNING_COMPANY_OTHER_PARTICIPANT, excludeEmptyString: true })
});


