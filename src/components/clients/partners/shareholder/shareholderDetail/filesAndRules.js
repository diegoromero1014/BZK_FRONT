import _ from "lodash";

import {
    checkRequired, processRules, checkRequiredWhenVarIsTrue, checkRequiredWhenVarIsFalse, 
    checkClientName, checkNumberInRange, checkNumberDocument, checkOnlyAlphabetical, checkMinLength, 
    checkMaxLength, checkObservations, checkFirstCharacter, checkClientNeighborhood, checkOnlyNumbers
} from '../../../../../validationsFields/rulesField';

export const fieldsWithRules = {
    id: { rules: [] },
    address: { rules: [checkFirstCharacter, checkClientNeighborhood, checkMaxLength(60)] },
    cityId: { rules: [] },
    clientId: { rules: [] },
    comment: { rules: [checkFirstCharacter, checkObservations] },
    countryId: { rules: [] },
    firstLastName: { rules: [checkRequiredWhenVarIsTrue('isNaturePerson'), checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    firstName: { rules: [checkRequiredWhenVarIsTrue('isNaturePerson'), checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    fiscalCountryId: { rules: [] },
    genderId: { rules: [] },
    middleName: { rules: [checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    provinceId: { rules: [] },
    secondLastName: { rules: [checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    shareHolderIdNumber: { rules: [] },
    shareHolderIdType: { rules: [] },
    shareHolderKindId: { rules: [checkRequired] },
    shareHolderName: { rules: [checkRequiredWhenVarIsFalse('isNaturePerson'), checkFirstCharacter, checkClientName, checkMaxLength(50)] },
    shareHolderType: { rules: [] },
    sharePercentage: { rules: [checkFirstCharacter, checkOnlyNumbers, checkRequired, checkNumberInRange(0, 100)] },
    tributaryNumber: { rules: [checkFirstCharacter, checkOnlyNumbers, checkMinLength(1), checkMaxLength(20)] },
    isNaturePerson: { rules: [] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};