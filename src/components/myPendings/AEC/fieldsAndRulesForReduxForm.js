import _ from "lodash";

import {
    checkRequired,processRules, checkFirstCharacter, checkClientDescription
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    commercialObservations: { rules: [checkRequired, checkFirstCharacter, checkClientDescription] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};