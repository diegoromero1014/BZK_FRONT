import _ from 'lodash';
import {processRules, checkRequired, checkForValueReasonTransfer, checkFirstCharacter, checkOtherReason, checkMaxLength} from './../../../validationsFields/rulesField';

const fieldsWithRules= {
    idCelula:{rules: [checkRequired]},
    reasonTranfer:{rules: [checkRequired]},
    otherReason:{rules: [checkForValueReasonTransfer, checkFirstCharacter, checkOtherReason, checkMaxLength(50)]}
};

export const fields =_.keys(fieldsWithRules);

export const validations = (formfields, props) => {
    return processRules(formfields, fieldsWithRules, props);
}