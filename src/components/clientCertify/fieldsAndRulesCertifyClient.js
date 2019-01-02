import _ from 'lodash';
import {processRules, checkAddress, checkFirstCharacter, checkMaxLength, checkForValueIsExClient,
     checkForValueIsNotExClient, checkForValueJustifyNoGeren, checkForValueJustifyNoLME, checkPhone,
     checkNumberLength} from './../../validationsFields/rulesField';

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
    annualSales:{rules: [checkForValueIsExClient, checkNumberLength(15)]},
    addressClient:{rules: [checkFirstCharacter, checkMaxLength(60), checkForValueIsExClient, checkAddress]},
    country:{rules: [checkForValueIsExClient]},
    province:{rules: [checkForValueIsExClient]},
    city:{rules: [checkForValueIsExClient]},
    telephone:{rules: [checkFirstCharacter, checkMaxLength(30), checkForValueIsExClient, checkPhone]},
    razonSocial:{rules: []},
    idTypeClient:{rules: []},
    idNumber:{rules: []},
    assets:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(15)]},
    liabilities:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(15)]},
    operatingIncome:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(15)]},
    expenses:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(15)]},
    nonOperatingIncome:{rules: [checkFirstCharacter, checkForValueIsExClient, checkNumberLength(15)]},
    dateSalesAnnuals:{rules: [checkForValueIsExClient]}
};

export const fields =_.keys(fieldsWithRules);

export const validations = (formfields, props) => {
    return processRules(formfields, fieldsWithRules, props);
}