import _ from "lodash";
import {
    checkRequired, processRules, checkFirstCharacter, checkObservations, 
} from '../../../../validationsFields/rulesField';
const fieldsWithRules = {

    validCovenant: { rules: [checkRequired] }, 
    fullfillmentCovenant: { rules: [checkRequired] }, 
    observedValue: { rules: [checkRequired, checkFirstCharacter, checkObservations] }, 
    dateFinancialStatements: { rules: [] }, 
    observations: { rules: [checkFirstCharacter, checkObservations] }

}
export const fields = _.keys(fieldsWithRules);
export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};