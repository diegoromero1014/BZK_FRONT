import _ from 'lodash';
import {processRules, checkRequiredWithGlobalCondition, checkMaxLength, checkHistoryFields} from './../../../validationsFields/rulesField';

const fieldsWithRules= {
    id:{rules: []},
    corporateGobernance:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields]},
    corporateGobernanceDate:{rules: []},
    reciprocity:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields]}, 
    reciprocityDate:{rules: []},
    specialConsiderations:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields]},
    specialConsiderationsDate:{rules: []},
    businessWithAffiliates:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(2000), checkHistoryFields]},
    businessWithAffiliatesDate:{rules: []},
    mergers:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields]},
    mergersDate:{rules: []},
    dificultSituations:{rules: [checkRequiredWithGlobalCondition, checkMaxLength(1000), checkHistoryFields]},
    dificultSituationsDate:{rules: []}
};

export const fields =_.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}