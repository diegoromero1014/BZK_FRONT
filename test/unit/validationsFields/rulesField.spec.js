import { checkFirstCharacter, checkObservations, checkRequired, checkOnlyAlphabetical,
    checkIsUpdateClient, checkMinLength, checkMaxLength} from '../../../src/validationsFields/rulesField';
import { MESSAGE_WARNING_FORBIDDEN_CHARACTER, MESSAGE_WARNING_OBSERVATIONS, MESSAGE_REQUIRED_VALUE,
    MESSAGE_WARNING_ONLY_ALPHABETICAL, MESSAGE_WARNING_MIN_LENGTH, MESSAGE_WARNING_MAX_LENGTH} from '../../../src/validationsFields/validationsMessages';

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
    it('should throw error when character @ is not valid', () => {
        const text = 'this text is not valid because has a @';
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