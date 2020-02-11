import {
    checkFirstCharacter,
    checkObservations,
    checkRequired,
    checkOnlyAlphabetical,
    checkIsUpdateClient,
    checkMinLength,
    checkMaxLength,
    checkNumberDocument,
    checkAddress,
    checkNeighborhood,
    checkPostalCode,
    checkPhone,
    checkOnlyNumbers,
    checkEmail,
    checkContactRelevantFeatures,
    checkPipeLineOpportunityName,
    checkObservationsLinkClient,
    checkHistoryFields,
    checkOtherReason,
    checkClientName,
    checkClientContext,
    checkInventoryPolicy,
    checkControlLinkedPayments,
    checkClientDescription,
    checkClientAddress,
    checkNameEntityProduct,
    checkdetailNonOperatingIncomePrincipal,
    checkOttherOperationsForeign,
    checkClientNeighborhood,
    checkRegexHtmlInjection,
    validateDecimal,
    checkJustificationDetails
} from '../../../src/validationsFields/rulesField';
import {
    MESSAGE_WARNING_FORBIDDEN_CHARACTER,
    MESSAGE_WARNING_OBSERVATIONS,
    MESSAGE_REQUIRED_VALUE,
    MESSAGE_WARNING_ONLY_ALPHABETICAL,
    MESSAGE_WARNING_MIN_LENGTH,
    MESSAGE_WARNING_MAX_LENGTH,
    MESSAGE_WARNING_NUMBER_DOCUMENT,
    MESSAGE_WARNING_ADDRESS,
    MESSAGE_WARNING_NEIGHBORHOOD,
    MESSAGE_WARNING_POSTAL_CODE,
    MESSAGE_WARNING_PHONE,
    MESSAGE_WARNING_ONLY_NUMBERS,
    MESSAGE_WARNING_INVALID_EMAIL,
    MESSAGE_WARNING_RELEVANT_FEATURES,
    MESSAGE_WARNING_OPPORTUNITY_NAME,
    MESSAGE_WARNING_OBSERVATIONS_LINK_CLIENT,
    MESSAGE_WARNING_HISTORY,
    MESSAGE_WARNING_OTHER_REASON,
    MESSAGE_WARNING_CLIENT_NAME,
    MESSAGE_WARNING_NAME_ENTITY,
    MESSAGE_WARNING_NO_OPERATING_IN_COME,
    MESSAGE_WARNING_ONLY_ALPHABETICAL_AND_SLASH,
    MESSAGE_ERROR_INJECTION_HTML,
    MESSAGE_ERROR_PERCENTAGE
} from '../../../src/validationsFields/validationsMessages';

describe('Test checkRequired white list validation', () => {
    it('should throw error if the text is empty', () => {
        const text = '';
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkRequired(text)).equal(expectedMessage);
    });

    it('should throw error if the text is null', () => {
        const text = null;
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkRequired(text)).equal(expectedMessage);
    });

    it('should throw error if the text is undefined', () => {
        const text = undefined;
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkRequired(text)).equal(expectedMessage);
    });

    it('should throw null if the text contains something', () => {
        const text = 'this text contains something';        
        expect(checkRequired(text)).equal(null);
    });    
});

describe('Test checkOnlyAlphabetical white list validation', () => {
    it('should throw error if the text contains numbers at start', () => {
        const text = '015 this text contains numbers at the start';
        const expectedMessage = MESSAGE_WARNING_ONLY_ALPHABETICAL;
        expect(checkOnlyAlphabetical(text)).equal(expectedMessage);
    });

    it('should throw error if the text contains numbers at the end', () => {
        const text = 'this text contains numbers at the end618598';
        const expectedMessage = MESSAGE_WARNING_ONLY_ALPHABETICAL;
        expect(checkOnlyAlphabetical(text)).equal(expectedMessage);
    });

    it('should throw error if the text contains numbers between the words', () => {
        const text = 'this text contains3123between the words';
        const expectedMessage = MESSAGE_WARNING_ONLY_ALPHABETICAL;
        expect(checkOnlyAlphabetical(text)).equal(expectedMessage);
    });

    it('should throw error if the text contains a special character', () => {
        const text = '#!"this text, is not ok$#%';  
        const expectedMessage = MESSAGE_WARNING_ONLY_ALPHABETICAL;      
        expect(checkOnlyAlphabetical(text)).equal(expectedMessage);
    });

    it('should throw null if the text is ok', () => {
        const text = 'this text is ok pretty sure';        
        expect(checkOnlyAlphabetical(text)).equal(null);
    });
});

describe('Test checkFirstCharacter white list validation', () => {    
    it('should throw error when @ is the first character', () => {
        const text = '@import something';
        const expectedMessage = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
        expect(checkFirstCharacter(text)).equal(expectedMessage);
    });

    it('should throw error when + is the first character', () => {
        const text = '+something with plus';
        const expectedMessage = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
        expect(checkFirstCharacter(text)).equal(expectedMessage);
    });

    it('should throw error when = is the first character', () => {
        const text = '=CMD Something';
        const expectedMessage = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
        expect(checkFirstCharacter(text)).equal(expectedMessage);
    });

    it('should throw error when - is the first character', () => {
        const text = '-something with the minus';
        const expectedMessage = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
        expect(checkFirstCharacter(text)).equal(expectedMessage);
    });

    it('should throw null if the text is ok', () => {
        const text = 'this is a normal text';        
        expect(checkFirstCharacter(text)).equal(null);
    });

    it('should throw null if the text is empty', () => {
        const text = '';        
        expect(checkFirstCharacter(text)).equal(null);
    });

    it('should throw null if the text is null', () => {
        const text = null;        
        expect(checkFirstCharacter(text)).equal(null);
    });
});

describe('Test checkObservations white list validation', () => {
    it('should throw error when character } is not valid', () => {
        const text = 'this text is not valid because has a }';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS;
        expect(checkObservations(text)).equal(expectedMessage);
    });

    it('should throw error when character | is not valid', () => {
        const text = 'this text is not valid because has a |';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS;
        expect(checkObservations(text)).equal(expectedMessage);
    });

    it('should throw null if all the characters are valid', () => {
        const text = 'this text is valid because contains all this ;,.-""!()$%&/¿?°#=¡\':´+[]_';        
        expect(checkObservations(text)).equal(null);
    });

    it('should throw null if the text is null', () => {
        const text = null;        
        expect(checkObservations(text)).equal(null);
    });
});

describe('Test checkIsUpdateClient validation', () => {
    it('should throw error when value is empty', () => {
        const value = '';
        const isEditButton = 'BUTTON_SAVE';
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkIsUpdateClient(value, {}, isEditButton)).equal(expectedMessage);
    });

    it('should throw error when value is null', () => {
        const value = null;
        const isEditButton = 'BUTTON_SAVE';
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkIsUpdateClient(value, {}, isEditButton)).equal(expectedMessage);
    });

    it('should throw error when value is undefined', () => {
        const value = undefined;
        const isEditButton = 'BUTTON_SAVE';
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkIsUpdateClient(value, {}, isEditButton)).equal(expectedMessage);
    });

    it('should throw error when value is not null or undefined and isEditButton is BUTTON_EDIT', () => {
        const value = 'Some value';
        const isEditButton = 'BUTTON_EDIT';
        const expectedMessage = null;
        expect(checkIsUpdateClient(value, {}, isEditButton)).equal(expectedMessage);
    });

    it('should throw null when value is not null or undefined and isEditButton is not BUTTON_EDIT', () => {
        const value = 'Some value';
        const isEditButton = 'BUTTON_SAVE';
        const expectedMessage = null;
        expect(checkIsUpdateClient(value, {}, isEditButton)).equal(expectedMessage);
    });      
});

describe('Test checkMinLength validation', () => {
    it('should throw error when the value has a minor length that specified length', () => {
        const value = 'test';
        const minLength = 5;
        const expectedMessage = MESSAGE_WARNING_MIN_LENGTH(minLength);
        expect(checkMinLength(minLength)(value)).equal(expectedMessage);
    });

    it('should throw null when the value has an equal length that specified length', () => {
        const value = 'testa';
        const minLength = 5;
        const expectedMessage = null;
        expect(checkMinLength(minLength)(value)).equal(expectedMessage);
    });

    it('should throw null when the value has a superior length that specified length', () => {
        const value = 'test a text';
        const minLength = 5;
        const expectedMessage = null;
        expect(checkMinLength(minLength)(value)).equal(expectedMessage);
    });
});

describe('Test checkMaxLength validation', () => {
    it('should throw null when the value has a minor length that specified length', () => {
        const value = 'test';
        const maxLength = 5;
        const expectedMessage = null;
        expect(checkMaxLength(maxLength)(value)).equal(expectedMessage);
    });

    it('should throw null when the value has an equal length that specified length', () => {
        const value = 'testa';
        const maxLength = 5;
        const expectedMessage = null;
        expect(checkMaxLength(maxLength)(value)).equal(expectedMessage);
    });

    it('should throw error when the value has a superior length that specified length', () => {
        const value = 'test a text';
        const maxLength = 5;
        const expectedMessage = MESSAGE_WARNING_MAX_LENGTH(maxLength);
        expect(checkMaxLength(maxLength)(value)).equal(expectedMessage);
    });
});

describe('Test checkNumberDocument white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '#$!"#$ 31234412-sd';
        const expectedMessage = MESSAGE_WARNING_NUMBER_DOCUMENT;
        expect(checkNumberDocument(value)).equal(expectedMessage);
    });

    it('should throw null when value only has - as a special character', () => {
        const value = '31234412-sd';
        const expectedMessage = null;
        expect(checkNumberDocument(value)).equal(expectedMessage);
    });

    it('should throw null when value has only numbers', () => {
        const value = '31234412';
        const expectedMessage = null;
        expect(checkNumberDocument(value)).equal(expectedMessage);
    });

    it('should throw null when value has only alphabetical', () => {
        const value = 'dasdqwe';
        const expectedMessage = null;
        expect(checkNumberDocument(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkNumberDocument(value)).equal(expectedMessage);
    });
});

describe('Test checkAddress white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '@#$!"#$ Cra 26A #30-86';
        const expectedMessage = MESSAGE_WARNING_ADDRESS;
        expect(checkAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value has only # and - as a special character', () => {
        const value = 'Cra 26A #30-86';
        const expectedMessage = null;
        expect(checkAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value has accent mark in any vocal', () => {
        const value = 'Cra 26A #30-86 Barrio Colón';
        const expectedMessage = null;
        expect(checkAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value has () ; , . as a special character', () => {
        const value = 'Cra 26A #(30-86). Barrio Colón, Medellín; Antioquia';
        const expectedMessage = null;
        expect(checkAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkAddress(value)).equal(expectedMessage);
    });
});

describe('Test checkNeighborhood white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=@#$!"#$ Barrio El Salvador';
        const expectedMessage = MESSAGE_WARNING_NEIGHBORHOOD;
        expect(checkNeighborhood(value)).equal(expectedMessage);
    });

    it('should throw null when value has only has () ; , . as a special character', () => {
        const value = 'Barrio (El Salvador), Medellin; Antioquia.';
        const expectedMessage = null;
        expect(checkNeighborhood(value)).equal(expectedMessage);
    });

    it('should throw null when value has accent mark in any vocal', () => {
        const value = 'Barrio Colón';
        const expectedMessage = null;
        expect(checkNeighborhood(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkNeighborhood(value)).equal(expectedMessage);
    });
});

describe('Test checkPostalCode white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=@#$!"#$ 9082-1';
        const expectedMessage = MESSAGE_WARNING_POSTAL_CODE;
        expect(checkPostalCode(value)).equal(expectedMessage);
    });

    it('should throw null when value only has - as special character', () => {
        const value = '9082-1';
        const expectedMessage = null;
        expect(checkPostalCode(value)).equal(expectedMessage);
    });

    it('should throw null when value only has - as special character', () => {
        const value = '9082-1';
        const expectedMessage = null;
        expect(checkPostalCode(value)).equal(expectedMessage);
    });

    it('should throw error when value has only has () ; , . as a special character', () => {
        const value = '(9082)-1.,;';
        const expectedMessage = MESSAGE_WARNING_POSTAL_CODE;
        expect(checkPostalCode(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkPostalCode(value)).equal(expectedMessage);
    });
});

describe('Test checkPhone white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=@#$!"#$ 3110258694';
        const expectedMessage = MESSAGE_WARNING_PHONE;
        expect(checkPhone(value)).equal(expectedMessage);
    });

    it('should throw error when value only has + as special character', () => {
        const value = '+573110258694';
        const expectedMessage = MESSAGE_WARNING_PHONE;
        expect(checkPhone(value)).equal(expectedMessage);
    });

    it('should throw error when value has spaces', () => {
        const value = '57 3110258694';
        const expectedMessage = MESSAGE_WARNING_PHONE;
        expect(checkPhone(value)).equal(expectedMessage);
    });

    it('should throw error when value has alphabetical characters', () => {
        const value = 'CO3110258694';
        const expectedMessage = MESSAGE_WARNING_PHONE;
        expect(checkPhone(value)).equal(expectedMessage);
    });

    it('should throw null when value has only numbers', () => {
        const value = '3110258694';
        const expectedMessage = null;
        expect(checkPhone(value)).equal(expectedMessage);
    });
});

describe('Test checkOnlyNumbers white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=@#$!"#$3110258694';
        const expectedMessage = MESSAGE_WARNING_ONLY_NUMBERS;
        expect(checkOnlyNumbers(value)).equal(expectedMessage);
    });

    it('should throw error when value has spaces', () => {
        const value = '45 3110258694';
        const expectedMessage = MESSAGE_WARNING_ONLY_NUMBERS;
        expect(checkOnlyNumbers(value)).equal(expectedMessage);
    });

    it('should throw error when value has alphabetical characters', () => {
        const value = 'CO3110258694';
        const expectedMessage = MESSAGE_WARNING_ONLY_NUMBERS;
        expect(checkOnlyNumbers(value)).equal(expectedMessage);
    });

    it('should throw null when value has only numbers', () => {
        const value = '3110258694';
        const expectedMessage = null;
        expect(checkOnlyNumbers(value)).equal(expectedMessage);
    });
});

describe('Test checkEmail white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=<>dgallego@ias.com.co#$#!%&/';
        const expectedMessage = MESSAGE_WARNING_INVALID_EMAIL;
        expect(checkEmail(value)).equal(expectedMessage);
    });

    it('should throw error when value email doesnt have a correct pattern', () => {
        const value = '@dgallegoias.com.co';
        const expectedMessage = MESSAGE_WARNING_INVALID_EMAIL;
        expect(checkEmail(value)).equal(expectedMessage);
    });

    it('should throw null when value email have the correct pattern', () => {
        const value = 'dgallego@ias.com.co';
        const expectedMessage = null;
        expect(checkEmail(value)).equal(expectedMessage);
    });
});

describe('Test checkContactRelevantFeatures white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=<>#$#!%&/ this value contains special characters. ¿?°#=:´+_';
        const expectedMessage = null;
        expect(checkContactRelevantFeatures(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkContactRelevantFeatures(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters?';
        const expectedMessage = null;
        expect(checkContactRelevantFeatures(value)).equal(expectedMessage);
    });
});

describe('Test checkPipeLineOpportunityName white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=<>#$#!%&/ this value contains special characters. ¿?°#=:´+_';
        const expectedMessage = MESSAGE_WARNING_OPPORTUNITY_NAME;
        expect(checkPipeLineOpportunityName(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = MESSAGE_REQUIRED_VALUE;
        expect(checkPipeLineOpportunityName(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkPipeLineOpportunityName(value)).equal(expectedMessage);
    });
});

describe('Test checkObservationsLinkClient white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=<>#$#!%&/ this value contains special characters. ¿?°#=:´+_';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS_LINK_CLIENT;
        expect(checkObservationsLinkClient(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkObservationsLinkClient(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkObservationsLinkClient(value)).equal(expectedMessage);
    });
});

describe('Test checkHistoryFields white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=<>#$#!%&/ this value contains special characters. ¿?°#=:´+_';
        const expectedMessage = MESSAGE_WARNING_HISTORY;
        expect(checkHistoryFields(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkHistoryFields(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkHistoryFields(value)).equal(expectedMessage);
    });
});

describe('Test checkOtherReason white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_OTHER_REASON;
        expect(checkOtherReason(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkOtherReason(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkOtherReason(value)).equal(expectedMessage);
    });
});

describe('Test checkClientName white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_CLIENT_NAME;
        expect(checkClientName(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkClientName(value)).equal(expectedMessage);
    });

    it('should throw error when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = MESSAGE_WARNING_CLIENT_NAME;
        expect(checkClientName(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'Carlos Sanchez Restrepo.';
        const expectedMessage = null;
        expect(checkClientName(value)).equal(expectedMessage);
    });
});

describe('Test checkClientContext white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS;
        expect(checkClientContext(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkClientContext(value)).equal(expectedMessage);
    });

    it('should throw null when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkClientContext(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters';
        const expectedMessage = null;
        expect(checkClientContext(value)).equal(expectedMessage);
    });
});

describe('Test checkInventoryPolicy white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS;
        expect(checkInventoryPolicy(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkInventoryPolicy(value)).equal(expectedMessage);
    });

    it('should  throw null when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkInventoryPolicy(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters';
        const expectedMessage = null;
        expect(checkInventoryPolicy(value)).equal(expectedMessage);
    });
});

describe('Test checkControlLinkedPayments white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS;
        expect(checkControlLinkedPayments(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkControlLinkedPayments(value)).equal(expectedMessage);
    });

    it('should throw null when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkInventoryPolicy(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters';
        const expectedMessage = null;
        expect(checkInventoryPolicy(value)).equal(expectedMessage);
    });
});

describe('Test checkClientDescription white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_OBSERVATIONS;
        expect(checkClientDescription(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkControlLinkedPayments(value)).equal(expectedMessage);
    });

    it('should throw null when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkControlLinkedPayments(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters';
        const expectedMessage = null;
        expect(checkControlLinkedPayments(value)).equal(expectedMessage);
    });
});

describe('Test checkClientAddress white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '@#$!"#$ Cra 26A #30-86';
        const expectedMessage = MESSAGE_WARNING_ADDRESS;
        expect(checkClientAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value has only # and - as a special character', () => {
        const value = 'Cra 26A #30-86';
        const expectedMessage = null;
        expect(checkClientAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value has accent mark in any vocal', () => {
        const value = 'Cra 26A #30-86 Barrio Colón';
        const expectedMessage = null;
        expect(checkClientAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value has () ; , . as a special character', () => {
        const value = 'Cra 26A #(30-86). Barrio Colón, Medellín; Antioquia';
        const expectedMessage = null;
        expect(checkClientAddress(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkClientAddress(value)).equal(expectedMessage);
    });
});

describe('Test checkNameEntityProduct white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'any $#!"&%@ name entity';
        const expectedMessage = MESSAGE_WARNING_NAME_ENTITY;
        expect(checkNameEntityProduct(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkNameEntityProduct(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'any name entity';
        const expectedMessage = null;
        expect(checkNameEntityProduct(value)).equal(expectedMessage);
    });

});

describe('Test checkdetailNonOperatingIncomePrincipal white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_NO_OPERATING_IN_COME;
        expect(checkdetailNonOperatingIncomePrincipal(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkdetailNonOperatingIncomePrincipal(value)).equal(expectedMessage);
    });

    it('should throw null when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = null;
        expect(checkdetailNonOperatingIncomePrincipal(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters';
        const expectedMessage = null;
        expect(checkdetailNonOperatingIncomePrincipal(value)).equal(expectedMessage);
    });
});

describe('Test checkOttherOperationsForeign white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = 'this text contains $#!"&%@ especial characters in the middle';
        const expectedMessage = MESSAGE_WARNING_ONLY_ALPHABETICAL_AND_SLASH;
        expect(checkOttherOperationsForeign(value)).equal(expectedMessage);
    });

    it('should throw error when value has interrogation characters', () => {
        const value = 'this value doesnt contains special characters?¿';
        const expectedMessage = MESSAGE_WARNING_ONLY_ALPHABETICAL_AND_SLASH;
        expect(checkOttherOperationsForeign(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkOttherOperationsForeign(value)).equal(expectedMessage);
    });

    it('should throw null when value has slash', () => {
        const value = '//this value doesnt // contains special characters //\\';
        const expectedMessage = null;
        expect(checkOttherOperationsForeign(value)).equal(expectedMessage);
    });

    it('should throw null when value is correct', () => {
        const value = 'this value doesnt contains special characters';
        const expectedMessage = null;
        expect(checkOttherOperationsForeign(value)).equal(expectedMessage);
    });
});

describe('Test checkClientNeighborhood white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '=@#$!"#$ Barrio El Salvador';
        const expectedMessage = MESSAGE_WARNING_NEIGHBORHOOD;
        expect(checkClientNeighborhood(value)).equal(expectedMessage);
    });

    it('should throw null when value has only has () ; , . as a special character', () => {
        const value = 'Barrio (El Salvador), Medellin; Antioquia.';
        const expectedMessage = null;
        expect(checkClientNeighborhood(value)).equal(expectedMessage);
    });

    it('should throw null when value has accent mark in any vocal', () => {
        const value = 'Barrio Colón';
        const expectedMessage = null;
        expect(checkClientNeighborhood(value)).equal(expectedMessage);
    });

    it('should throw null when value is empty', () => {
        const value = '';
        const expectedMessage = null;
        expect(checkClientNeighborhood(value)).equal(expectedMessage);
    });
});

describe('Test checkRegexHtmlInjection white list validation', () => {
    it('should throw error when value has special characters', () => {
        const value = '<></>';
        const expectedMessage = MESSAGE_ERROR_INJECTION_HTML;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
    it('should throw null when value has any text', () => {
        const value = '<>pruebaServicio</>';
        const expectedMessage = MESSAGE_ERROR_INJECTION_HTML;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
    it('should throw null when value is correct checkRegexHtmlInjection', () => {
        const value = '</>';
        const expectedMessage = MESSAGE_ERROR_INJECTION_HTML;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
    it('should throw null when value is correct case 2 checkRegexHtmlInjection', () => {
        const value = '<>';
        const expectedMessage = null;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
    it('should throw null when value is correct case 3 checkRegexHtmlInjection', () => {
        const value = '<><>';
        const expectedMessage = null;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
    it('should throw null when value is incorrect checkRegexHtmlInjection', () => {
        const value = '<p></p>';
        const expectedMessage = MESSAGE_ERROR_INJECTION_HTML;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
    it('should throw null when value is an ampersand html injection checkRegexHtmlInjection', () => {
        const value = '&ltp&gt&lt/p&gt';
        const expectedMessage = MESSAGE_ERROR_INJECTION_HTML;
        expect(checkRegexHtmlInjection(value)).equal(expectedMessage);
    });
});

describe('Test validateDecimal', ()=>{
    it('should throw message error when it does not meet the criteria', ()=> {
        const value = 3333.55;
        const expectedMessage = MESSAGE_ERROR_PERCENTAGE;
        expect(validateDecimal(value)).equal(expectedMessage);
    });

    it('no should throw message error when  meet the criteria', ()=> {
        const value = 333.55;
        const expectedMessage = null;
        expect(validateDecimal(value)).equal(expectedMessage);
    });
})

describe('Test checkJustificationDetails validations', ()=>{
    it('you must send a message when you have values ​​not allowed', ()=>{
        const value = 'mess^~';
        const expectedMessage = MESSAGE_WARNING_OPPORTUNITY_NAME;
        expect(checkJustificationDetails(value)).equal(expectedMessage);
    })
})