import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, checkAddress, checkNeighborhood, checkPostalCode, checkPhone, checkOnlyNumbers,
    checkContactRelevantFeatures, checkEmail, checkRequiredWithGlobalCondition, processRules
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    contactId: { rules: [] },
    contactType: { rules: [] },
    contactIdentityNumber: { rules: [checkRequired, checkNumberDocument, checkMaxLength(30)] },
    contactTitle: { rules: [checkRequired] },
    contactGender: { rules: [checkRequired] },
    contactFirstName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    contactMiddleName: { rules: [checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    contactFirstLastName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    contactSecondLastName: { rules: [checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    contactPosition: { rules: [checkRequired] },
    contactDependency: { rules: [checkRequired] },
    contactDateOfBirth: { rules: [] },
    contactSocialStyle: { rules: [] },
    contactAttitudeOverGroup: { rules: [] },
    contactCountry: { rules: [checkRequired] },
    contactProvince: { rules: [checkRequired] },
    contactCity: { rules: [checkRequired] },
    contactAddress: { rules: [checkRequired, checkMinLength(5), checkAddress] },
    contactNeighborhood: { rules: [checkNeighborhood] },
    contactPostalCode: { rules: [checkPostalCode] },
    contactTelephoneNumber: { rules: [checkRequired, checkPhone] },
    contactExtension: { rules: [checkOnlyNumbers] },
    contactMobileNumber: { rules: [checkPhone] },
    contactEmailAddress: { rules: [checkRequired, checkEmail] },
    contactTypeOfContact: { rules: [checkRequiredWithGlobalCondition] },
    contactLineOfBusiness: { rules: [] },
    contactFunctions: { rules: [checkRequiredWithGlobalCondition] },
    contactHobbies: { rules: [] },
    contactSports: { rules: [] },
    contactRelevantFeatures: { rules: [checkContactRelevantFeatures] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};