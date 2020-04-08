import reducer from '../../../../src/components/main/reducer';
import { VALID_TOKEN, SAVE_DATA_LOADING, PRODUCTION_UPGRADE_REQUEST, PRODUCTION_UPGRADE_NOTIFIED } from '../../../../src/components/main/constants';
import Immutable from 'immutable';

describe('MainComponent Test Reducer', () => {

    it('reducer called type VALID_TOKEN', () => {
        const response = reducer(Immutable.Map({}), { type: VALID_TOKEN });
        expect(response).not.to.equal(null);
    })

    it('reducer called type SAVE_DATA_LOADING', () => {
        const response = reducer(Immutable.Map({}), { type: SAVE_DATA_LOADING });
        expect(response).not.to.equal(null);
    })

    it('reducer called type PRODUCTION_UPGRADE_REQUEST', () => {
        const response = reducer(Immutable.Map({}), { type: PRODUCTION_UPGRADE_REQUEST, payload: { data: { data: { messageNotification: '' } }} });
        expect(response).not.to.equal(null);
    })

    it('reducer called type PRODUCTION_UPGRADE_NOTIFIED', () => {
        const response = reducer(Immutable.Map({}), { type: PRODUCTION_UPGRADE_NOTIFIED });
        expect(response).not.to.equal(null);
    })

    it('reducer called type null', () => {
        const response = reducer(Immutable.Map({}), { type: null });
        expect(response).not.to.equal(null);
    })
})