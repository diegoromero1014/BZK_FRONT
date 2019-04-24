import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName,
     checkObservationsRiskGroup
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    groupName: { rules: [checkRequired, checkMaxLength(50), checkFirstCharacter, checkGroupName] },
    groupObservations: { rules: [checkRequired, checkMaxLength(1000), checkFirstCharacter, checkObservationsRiskGroup] },
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}