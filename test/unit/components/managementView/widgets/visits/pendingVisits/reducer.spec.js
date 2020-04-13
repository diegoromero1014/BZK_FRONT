import reducer from '../../../../../../../src/components/managementView/widgets/visits/pendingVisits/reducer';
import { REQUEST_PENDING_VISITS } from '../../../../../../../src/components/managementView/widgets/visits/constants';
import Immutable from 'immutable';

describe('Test reducer pendingVistis', () => {

    it('Test reducer', () => {
        const response = reducer(Immutable.Map({}), { type: REQUEST_PENDING_VISITS });
        expect(response).not.to.equal(null);
    })

})