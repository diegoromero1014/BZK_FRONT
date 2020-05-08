import reducer from '../../../../../../../src/components/managementView/widgets/visits/economicGroupsToBeVisited/reducer';
import { ACTION_ECONOMIC_GROUPS_TO_BE_VISITED } from '../../../../../../../src/components/managementView/widgets/visits/constants';
import Immutable from 'immutable';

describe('EconomicGroupsToBeVisited Test Reducer', () => {

    it('reducer called type ACTION_ECONOMIC_GROUPS_TO_BE_VISITED', () => {
        const response = reducer(Immutable.Map({}), { type: ACTION_ECONOMIC_GROUPS_TO_BE_VISITED });
        expect(response).not.to.equal(null);
    })
})