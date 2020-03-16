import React from 'react';
import { 
    validateLogin,
    saveSessionToken,
    saveSessionUserName,
    saveSessionName,
    clearSessionUserName,
    clearStateLogin,
    loadObservablesLeftTimer,
    stopObservablesLeftTimer,
    getUserDataFrontOfficeEmployee
} from '../../../../src/components/login/actions';
import { VALIDATE_LOGIN, CHANGE_STATUS_LOGIN, CLEAR_STATE, GET_DATA_USER } from '../../../../src/components/login/constants';
import { INIT_INPUT_EVENTS, STOP_INPUT_EVENTS } from '../../../../src/constantsGlobal';

describe('Login Test Actions', () => {

    it('validateLogin should return type VALIDATE_LOGIN', () => {
        const response = validateLogin();
        expect(response.type).to.equal(VALIDATE_LOGIN);
    })

    it('saveSessionToken should return type CHANGE_STATUS_LOGIN', () => {
        const response = saveSessionToken();
        expect(response.type).to.equal(CHANGE_STATUS_LOGIN);
    })
    
    it('saveSessionUserName should return nothing', () => {
        const response = saveSessionUserName();
        expect(response).to.equal(undefined);
    })
    
    it('saveSessionName should return nothing', () => {
        const response = saveSessionName();
        expect(response).to.equal(undefined);
    })

    it('clearSessionUserName should return nothing', () => {
        const response = clearSessionUserName();
        expect(response).to.equal(undefined);
    })

    it('clearStateLogin should return type CLEAR_STATE', () => {
        const response = clearStateLogin();
        expect(response.type).to.equal(CLEAR_STATE);
    })

    it('loadObservablesLeftTimer should return type INIT_INPUT_EVENTS', () => {
        const response = loadObservablesLeftTimer();
        expect(response.type).to.equal(INIT_INPUT_EVENTS);
    })

    it('stopObservablesLeftTimer should return type STOP_INPUT_EVENTS', () => {
        const response = stopObservablesLeftTimer();
        expect(response.type).to.equal(STOP_INPUT_EVENTS);
    })

    it('getUserDataFrontOfficeEmployee should return type GET_DATA_USER', () => {
        const response = getUserDataFrontOfficeEmployee();
        expect(response.type).to.equal(GET_DATA_USER);
    })
})