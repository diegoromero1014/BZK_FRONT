import _ from "lodash";

import {
    checkRequired, checkNumberDocument,
    processRules
} from '../../validationsFields/rulesField';

const fieldsWithRules = {
    idType: { rules: [checkRequired] },
    idNumber: { rules: [checkRequired, checkNumberDocument] },
    clientType: { rules: [checkRequired] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};