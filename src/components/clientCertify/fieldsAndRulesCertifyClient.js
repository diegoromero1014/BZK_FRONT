import _ from 'lodash';
import {
    processRules, checkAddress, checkFirstCharacter, checkMaxLength, checkForValueIsExClient,
    checkForValueIsNotExClient, checkForValueJustifyNoGeren, checkForValueJustifyNoLME, checkPhone,
    checkNumberLength, checkNumbers, checkMinLength
} from './../../validationsFields/rulesField';

const fieldsWithRules= {
    economicGroupName:{rules: [checkFirstCharacter, checkForValueIsExClient]},
    nitPrincipal:{rules: []},
    groupEconomic:{rules: [checkFirstCharacter, checkMaxLength()]},
    marcGeren:{rules: [checkForValueIsExClient]},
    justifyNoGeren:{rules: [checkForValueJustifyNoGeren]},
    centroDecision:{rules: [checkForValueIsExClient]},
    necesitaLME:{rules: [checkForValueIsExClient]},
    justifyNoLME:{rules: [checkForValueJustifyNoLME]},
    justifyExClient:{rules: [checkForValueIsNotExClient]},
    taxNature:{rules: []},
    idCIIU:{rules: [checkForValueIsExClient]},
    idSubCIIU:{rules: [checkForValueIsExClient]},
    annualSales:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(19)]},
    addressClient:{rules: [checkFirstCharacter, checkMaxLength(60), checkForValueIsExClient, checkAddress]},
    country:{rules: [checkForValueIsExClient]},
    province:{rules: [checkForValueIsExClient]},
    city:{rules: [checkForValueIsExClient]},
    telephone:{rules: [checkFirstCharacter, checkMinLength(7), checkMaxLength(30), checkForValueIsExClient, checkPhone]},
    razonSocial:{rules: []},
    idTypeClient:{rules: []},
    idNumber:{rules: []},
    assets:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(19)]},
    liabilities:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(19)]},
    operatingIncome:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(19)]},
    expenses:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(19)]},
    nonOperatingIncome:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(19)]},
    dateSalesAnnuals:{rules: [checkForValueIsExClient]}
};

export const fields =_.keys(fieldsWithRules);

export const validations = (formfields, props) => {
    return processRules(formfields, fieldsWithRules, props);
}