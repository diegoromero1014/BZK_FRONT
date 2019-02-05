import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName,
    checkJustificationsRiskGroup, checkGroupExternalClientNumberDocument
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    id: { rules: [] },
    clientName: { rules: [checkRequired, checkMaxLength(50), checkFirstCharacter, checkGroupName] },
    justification: { rules: [checkRequired, checkMaxLength(1000), checkFirstCharacter, checkJustificationsRiskGroup] },
    conformationReasonId: { rules: [checkRequired] },
};

const fieldsWithRulesSearch = {
    idType: { rules: [checkRequired] },
    idNumber: { rules: [checkRequired, checkMaxLength(30), checkFirstCharacter, checkGroupExternalClientNumberDocument] },
    clientType: { rules: [checkRequired] }
};

export const fields = _.keys(fieldsWithRules);
export const fieldsSearch = _.keys(fieldsWithRulesSearch);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}
export const validationsSearch = (formfields) => {
    return processRules(formfields, fieldsWithRulesSearch);
}