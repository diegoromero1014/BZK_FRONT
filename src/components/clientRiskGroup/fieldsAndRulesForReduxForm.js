import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName,
    checkJustificationsRiskGroup, checkObservationsRiskGroup, checkGroupExternalClientNumberDocument
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    id: { rules: [] },
    groupName: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkGroupName] },
    clientName: { rules: [checkRequired, checkMaxLength(50), checkFirstCharacter, checkGroupName] },
    groupObservations: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkObservationsRiskGroup] },
    justification: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkJustificationsRiskGroup] },
    idNumber: { rules: [checkRequired, checkMaxLength(30), checkFirstCharacter, checkGroupExternalClientNumberDocument] },
    observation: { rules: [checkRequired, checkMaxLength(500), checkFirstCharacter, checkObservationsRiskGroup] },
    conformationReasonId: { rules: [checkRequired] },
};

const fieldsWithRulesSearch = {
    idType: { rules: [checkRequired] },
    idNumber: { rules: [checkRequired] },
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