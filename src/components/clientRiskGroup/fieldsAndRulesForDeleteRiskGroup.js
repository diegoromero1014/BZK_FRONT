import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName,
    checkJustificationsRiskGroup, checkObservationsRiskGroup, checkGroupExternalClientNumberDocument
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    justification: { rules: [checkRequired, checkMaxLength(60), checkFirstCharacter, checkJustificationsRiskGroup] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}