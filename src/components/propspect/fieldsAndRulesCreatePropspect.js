import _ from "lodash";

import {
    checkRequired, checkNumberDocument,
    processRules, checkFirstCharacter
} from '../../validationsFields/rulesField';

const fieldsWithRules = {
    idType: { rules: [checkRequired] },
    idNumber: { rules: [checkRequired, checkNumberDocument, checkFirstCharacter] },
    clientType: { rules: [checkRequired] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};