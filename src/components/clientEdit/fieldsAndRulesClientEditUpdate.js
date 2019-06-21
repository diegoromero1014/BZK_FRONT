import _ from 'lodash';
import {processRules, checkIsUpdateClient, checkClientName, checkMaxLength,
    checkNumberDocument, checkFirstCharacter, checkRequired, checkForValueSubSegmentEditClient,
    checkClientDescription, checkForValueIdSubCiiuEditClient, checkClientContext, checkInventoryPolicy,
    checkControlLinkedPayments, checkControlLinkedPaymentsRequired, checkClientNeighborhood, checkNumbers,
    checkNumberLength, checkdetailNonOperatingIncome, checkForValueJustifyNoGerenEditClient, checkForValueJustifyNoLMEEditClient,
    checkOthersEnabledOriginGoods, checkForValueOperationsForeigns, checkOnlyAlphabetical, checkClientAddress,
    checkOthersEnabledclientOperationsForeignCurrency, checkOthersEnabledOriginResources, checkdetailNonOperatingIncomePrincipal,
    checkOttherOperationsForeign, checkEconomicGroup, checkMinLength
} from './../../validationsFields/rulesField';

const fieldsWithRules= {
     addressClient:{rules: [checkFirstCharacter, checkIsUpdateClient, checkClientAddress, checkMinLength(5), checkNumberLength(60)]},
     telephone:{rules: [checkFirstCharacter, checkIsUpdateClient, checkNumbers, checkMinLength(7), checkMaxLength(30)]},
     annualSales:{rules: [checkFirstCharacter, checkIsUpdateClient, checkNumberLength(19)]},
     country:{rules: [checkIsUpdateClient]},
     province:{rules: [checkIsUpdateClient]},
     city:{rules: [checkIsUpdateClient]},
     dateSalesAnnuals:{rules: [checkIsUpdateClient]},
     liabilities:{rules: [checkIsUpdateClient, checkNumberLength(19)]},
     assets:{rules: [checkIsUpdateClient, checkNumberLength(19)]},
     operatingIncome:{rules: [checkIsUpdateClient, checkNumberLength(19)]},
     nonOperatingIncome:{rules: [checkIsUpdateClient, checkNumberLength(19)]},
     expenses:{rules: [checkIsUpdateClient, checkNumberLength(19)]},
     marcGeren:{rules: [checkIsUpdateClient]},
     justifyNoGeren:{rules: [checkForValueJustifyNoGerenEditClient]},
     centroDecision:{rules: [checkIsUpdateClient]},
     necesitaLME:{rules: [checkIsUpdateClient]},
     justifyNoLME:{rules: [checkForValueJustifyNoLMEEditClient]},
     reportVirtual:{rules: [checkIsUpdateClient]},
     extractsVirtual:{rules: [checkIsUpdateClient]},
     otherOriginGoods:{rules: [checkFirstCharacter, checkOthersEnabledOriginGoods, checkOnlyAlphabetical, checkNumberLength(200)]},
     otherOriginResource:{rules: [checkFirstCharacter, checkOthersEnabledOriginResources, checkOnlyAlphabetical, checkNumberLength(200)]},
     otherOperationsForeign:{rules: [checkFirstCharacter, checkOthersEnabledclientOperationsForeignCurrency, checkOttherOperationsForeign, checkNumberLength(200)]},
     originCityResource:{rules: [checkFirstCharacter, checkIsUpdateClient, checkClientAddress, checkNumberLength(20)]},
     detailNonOperatingIncome:{rules: [checkFirstCharacter, checkdetailNonOperatingIncome, checkdetailNonOperatingIncomePrincipal]},
     originResource:{rules: [checkIsUpdateClient]},
     countryOrigin:{rules: [checkIsUpdateClient]},
     operationsForeignCurrency:{rules: [checkIsUpdateClient]},
     operationsForeigns:{rules: [checkForValueOperationsForeigns]},
     economicGroupName:{rules: [checkEconomicGroup]},
     controlLinkedPayments:{rules: [checkControlLinkedPaymentsRequired, checkControlLinkedPayments, checkFirstCharacter, checkMaxLength(1000)]},
     description:{rules: [checkFirstCharacter, checkClientDescription]},
     neighborhood:{rules: [checkFirstCharacter, checkClientNeighborhood, checkMaxLength(40)]},
     contextClientField:{rules: [checkFirstCharacter, checkClientContext, checkMaxLength(1000)]},
     inventoryPolicy:{rules: [checkFirstCharacter, checkInventoryPolicy, checkMaxLength(1200)]},
     nitPrincipal:{rules: []},
     justifyExClient:{rule: []},
     idTypeClient:{rules: []},
     customerTypology:{rules:[]},
     idCIIU:{rules:[checkRequired]},
     idSubCIIU:{rules:[checkForValueIdSubCiiuEditClient]},
     taxNature:{rules:[checkIsUpdateClient]},
     originGoods:{rules:[checkIsUpdateClient]},
     razonSocial: { rules: [checkFirstCharacter, checkRequired, checkClientName, checkMaxLength(50)] },
     idNumber: { rules: [checkRequired, checkNumberDocument, checkFirstCharacter, checkMaxLength(30)] },
     idTypeClient: { rules: [checkRequired] },
     segment: { rules: [checkRequired] },
     subSegment: { rules: [checkForValueSubSegmentEditClient] },
     groupEconomic:{rules:[]},
     customerCoverageIntOpe:{rules:[]}
 };
 
 export const fields =_.keys(fieldsWithRules);
 
 export const validations = (formfields, props) => {
     return processRules(formfields, fieldsWithRules, props);
 }