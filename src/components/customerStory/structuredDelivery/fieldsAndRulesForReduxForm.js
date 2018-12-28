import _ from 'lodash';
import {processRules, checkRequiredWithGlobalCondition, checkMaxLength, checkHistoryFields, checkFirstCharacter} from './../../../validationsFields/rulesField';

const fieldsWithRules= {
    id:{rules: []},
    corporateGobernance:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields, checkFirstCharacter]},
    corporateGobernanceDate:{rules: []},
    reciprocity:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields, checkFirstCharacter]}, 
    reciprocityDate:{rules: []},
    specialConsiderations:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields, checkFirstCharacter]},
    specialConsiderationsDate:{rules: []},
    businessWithAffiliates:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(2000), checkHistoryFields, checkFirstCharacter]},
    businessWithAffiliatesDate:{rules: []},
    mergers:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields, checkFirstCharacter]},
    mergersDate:{rules: []},
    dificultSituations:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields, checkFirstCharacter]},
    dificultSituationsDate:{rules: []}
};

export const fields =_.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}