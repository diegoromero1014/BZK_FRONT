import _ from "lodash";

import {
    checkRequired,processRules, checkFirstCharacter, checkClientDescription, checkRegexHtmlInjection, checkMaxLength
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    commercialObservations: { rules: [checkRequired, checkFirstCharacter, checkClientDescription, checkRegexHtmlInjection, checkMaxLength(500)] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};