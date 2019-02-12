import {checkFirstCharacter, checkObservations} from '../../../src/validationsFields/rulesField';
import {MESSAGE_WARNING_FORBIDDEN_CHARACTER, MESSAGE_WARNING_OBSERVATIONS} from '../../../src/validationsFields/validationsMessages';

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