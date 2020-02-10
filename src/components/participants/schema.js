import * as Yup from 'yup';
import { patternClientObjective, patternOfForbiddenCharacter2 } from '../../validationsFields/patternsToValidateField';
import { MESSAGE_ERROR_PATTERN_CLIENT_OBJECTIVE, MESSAGE_WARNING_FORBIDDEN_CHARACTER, MESSAGE_ERROR_INJECTION_HTML } from '../../validationsFields/validationsMessages';
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

export const participantInformationSchema = Yup.object().shape({
    socialStyle: Yup.string().required('El campo Estilo social es requerido'),
});


