import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, checkObservations, processRules
} from '../../../../../validationsFields/rulesField';

const fieldsWithRules = {
    idBoardMember: { rules: [] },
    typeOfDocument: { rules: [checkRequired] },
    numberDocument: { rules: [checkRequired, checkNumberDocument, checkMaxLength(30)] },
    firstName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    firstLastName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    middleName: { rules: [checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    secondLastName: { rules: [checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    observations: { rules: [checkObservations] },
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};