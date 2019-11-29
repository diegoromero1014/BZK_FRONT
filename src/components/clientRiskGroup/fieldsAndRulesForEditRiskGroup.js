import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName, checkObservationsRiskGroup, checkRegexHtmlInjection
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    groupName: { rules: [checkRequired, checkMaxLength(50), checkFirstCharacter, checkGroupName, checkRegexHtmlInjection] },
    groupObservations: { rules: [checkRequired, checkMaxLength(1000), checkFirstCharacter, checkObservationsRiskGroup, checkRegexHtmlInjection] },
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}