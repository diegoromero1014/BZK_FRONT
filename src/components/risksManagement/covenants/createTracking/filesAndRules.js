import _ from "lodash";
import {
    checkRequired, processRules, checkFirstCharacter, checkObservations, checkRequiredWhenFieldIsTrue
} from '../../../../validationsFields/rulesField';
const fieldsWithRules = {

    validCovenant: { rules: [checkRequired] }, 
    fullfillmentCovenant: { rules: [checkRequired] }, 
    observedValue: { rules: [checkRequired, checkFirstCharacter, checkObservations] }, 
    observations: { rules: [checkRequiredWhenFieldIsTrue('isMandatoryObservations'), checkFirstCharacter, checkObservations] },
    dateFinancialStatements: { rules: [checkRequiredWhenFieldIsTrue('isFinancialStatements')] }, 
    isMandatoryObservations: { rules: [] },
    isFinancialStatements: { rules: [] }
}
export const fields = _.keys(fieldsWithRules);
export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};