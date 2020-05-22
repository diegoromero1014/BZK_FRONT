import reducer from '../../../../src/components/clientRiskGroup/reducer';
import Immutable from 'immutable';
import { CONSULT_RISK_GROUP, HAS_RISK_GROUP, UPDATE_NAME_RISK_GROUP, CHANGE_PENDING, SHOW_MODAL_RISK_GROUP, LIST_NOVELTIES_RISK_GROUP, GET_OBSERVATIONS_BY_RISK_GROUP } from '../../../../src/components/clientRiskGroup/constants';

describe('clientRiskGroup Test Reducer', () => {

    it('reducer called type CONSULT_RISK_GROUP', () => {
        const response = reducer(Immutable.Map({}), { type: CONSULT_RISK_GROUP, payload: { data: { data: null }} });
        expect(response).not.to.equal(null);
    })
    
    it('reducer called type HAS_RISK_GROUP', () => {
        const response = reducer(Immutable.Map({}), { type: HAS_RISK_GROUP, payload: { data: { data: null }} });
        expect(response).not.to.equal(null);
    })
    
    it('reducer called type UPDATE_NAME_RISK_GROUP', () => {
        const response = reducer(Immutable.Map({}), { type: UPDATE_NAME_RISK_GROUP, riskGroup: { code: null } });
        expect(response).not.to.equal(null);
    })

    it('reducer called type CHANGE_PENDING', () => {
        const response = reducer(Immutable.Map({}), { type: CHANGE_PENDING });
        expect(response).not.to.equal(null);
    })

    it('reducer called type SHOW_MODAL_RISK_GROUP', () => {
        const response = reducer(Immutable.Map({}), { type: SHOW_MODAL_RISK_GROUP });
        expect(response).not.to.equal(null);
    })

    it('reducer called type LIST_NOVELTIES_RISK_GROUP', () => {
        const response = reducer(Immutable.Map({}), { type: LIST_NOVELTIES_RISK_GROUP, payload: { data: { data: null }} });
        expect(response).not.to.equal(null);
    })

    it('reducer called type GET_OBSERVATIONS_BY_RISK_GROUP', () => {
        const response = reducer(Immutable.Map({}), { type: GET_OBSERVATIONS_BY_RISK_GROUP, payload: { data: { data: null }} });
        expect(response).not.to.equal(null);
    })

    it('reducer called type null', () => {
        const response = reducer(Immutable.Map({}), { type: null });
        expect(response).not.to.equal(null);
    })
})