import reducer from '../../../../src/components/transactional/reducer';
import * as actions from '../../../../src/components/transactional/constants';
import Immutable from 'immutable';

describe('test reducer transactional', () => {

    it('reducer called actions.SET_URL_PARAMETER', () => {
        const response = reducer(Immutable.Map({}), { type: actions.SET_URL_PARAMETER });
        expect(response).not.to.equal(null);
    })

    it('reducer called actions.GET_ALL_CATEGORIES', () => {
        const response = reducer(Immutable.Map({}), { type: actions.GET_ALL_CATEGORIES , payload: { data: { data: null }} })
        expect(response).not.to.equal(null);
    })

    it('reducer called type null', () => {
        const response = reducer(Immutable.Map({}), { type: null });
        expect(response).not.to.equal(null);
    })

})