import _ from 'lodash';
import { processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName, checkJustificationsRiskGroup, checkObservationsRiskGroup } from './../../validationsFields/rulesField';

const fieldsWithRules = {
    id: { rules: [] },
    groupName: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkGroupName] },
    groupObservations: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkObservationsRiskGroup] },
    justification: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkJustificationsRiskGroup] }

};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}