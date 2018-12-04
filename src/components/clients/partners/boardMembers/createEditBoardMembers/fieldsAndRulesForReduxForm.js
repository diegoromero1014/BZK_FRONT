import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkOnlyAlphabetical, checkMinLength, checkMaxLength, checkObservations,
    processRules, checkFirstCharacter
} from '../../../../../validationsFields/rulesField';

const fieldsWithRules = {
    idBoardMember: { rules: [] },
    typeOfDocument: { rules: [checkRequired] },
    numberDocument: { rules: [checkRequired, checkFirstCharacter, checkNumberDocument, checkMaxLength(30)] },
    firstName: {
        rules: [checkRequired, checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)]
    },
    firstLastName: {
        rules: [checkRequired, checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)]
    },
    middleName: { rules: [checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    secondLastName: { rules: [checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    observations: { rules: [checkFirstCharacter, checkObservations] },
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};