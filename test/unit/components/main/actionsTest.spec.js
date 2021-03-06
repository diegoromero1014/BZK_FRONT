import React from 'react';
import { 
    changeStateSaveData,
    validateUpgrateProductionActive,
    notifiedProductionUpgrade,
    changeTokenStatus
} from '../../../../src/components/main/actions';
import { SAVE_DATA_LOADING, PRODUCTION_UPGRADE_REQUEST, PRODUCTION_UPGRADE_NOTIFIED, VALID_TOKEN } from '../../../../src/components/main/constants';

describe('MainComponent Test Actions', () => {

    it('changeStateSaveData should return type SAVE_DATA_LOADING', () => {
        const response = changeStateSaveData();
        expect(response.type).to.equal(SAVE_DATA_LOADING);
    })

    it('validateUpgrateProductionActive should return type PRODUCTION_UPGRADE_REQUEST', () => {
        const response = validateUpgrateProductionActive();
        expect(response.type).to.equal(PRODUCTION_UPGRADE_REQUEST);
    })

    it('notifiedProductionUpgrade should return type PRODUCTION_UPGRADE_NOTIFIED', () => {
        const response = notifiedProductionUpgrade();
        expect(response.type).to.equal(PRODUCTION_UPGRADE_NOTIFIED);
    })

    it('changeTokenStatus should return type VALID_TOKEN', () => {
        const response = changeTokenStatus();
        expect(response.type).to.equal(VALID_TOKEN);
    })
})