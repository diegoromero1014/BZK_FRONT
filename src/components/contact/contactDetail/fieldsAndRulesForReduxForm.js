import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, checkAddress, checkNeighborhood, checkPostalCode, checkPhone, checkOnlyNumbers,
    checkContactRelevantFeatures, checkEmail, checkRequiredWithGlobalCondition, processRules, checkFirstCharacter
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    contactId: { rules: [] },
    contactType: { rules: [] },
    contactIdentityNumber: { rules: [checkRequired, checkNumberDocument, checkFirstCharacter, checkMaxLength(30)] },
    contactTitle: { rules: [checkRequired] },
    contactGender: { rules: [checkRequired] },
    contactFirstName: { rules: [checkRequired, checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    contactMiddleName: { rules: [checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    contactFirstLastName: { rules: [checkRequired, checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    contactSecondLastName: { rules: [checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    contactPosition: { rules: [checkRequired] },
    contactDependency: { rules: [checkRequired] },
    contactDateOfBirth: { rules: [] },
    contactSocialStyle: { rules: [] },
    contactAttitudeOverGroup: { rules: [] },
    contactCountry: { rules: [checkRequired] },
    contactProvince: { rules: [checkRequired] },
    contactCity: { rules: [checkRequired] },
    contactAddress: { rules: [checkRequired, checkFirstCharacter, checkMinLength(5), checkAddress, checkMaxLength(60)] },
    contactNeighborhood: { rules: [checkNeighborhood, checkFirstCharacter, checkMaxLength(40)] },
    contactPostalCode: { rules: [checkPostalCode, checkFirstCharacter, checkMaxLength(10)] },
    contactTelephoneNumber: { rules: [checkRequired, checkFirstCharacter, checkMinLength(7), checkPhone, checkMaxLength(30)] },
    contactExtension: { rules: [checkOnlyNumbers, checkFirstCharacter, checkMaxLength(14)] },
    contactMobileNumber: { rules: [checkPhone, checkFirstCharacter, checkMaxLength(30)] },
    contactEmailAddress: { rules: [checkRequired, checkFirstCharacter, checkEmail, checkMaxLength(50)] },
    contactTypeOfContact: { rules: [checkRequiredWithGlobalCondition] },
    contactLineOfBusiness: { rules: [] },
    contactFunctions: { rules: [checkRequiredWithGlobalCondition] },
    contactHobbies: { rules: [] },
    contactSports: { rules: [] },
    contactRelevantFeatures: { rules: [checkContactRelevantFeatures, checkFirstCharacter] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};