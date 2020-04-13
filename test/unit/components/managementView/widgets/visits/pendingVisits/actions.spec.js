import { requestPendingVisits } from '../../../../../../../src/components/managementView/widgets/visits/pendingVisits/actions';
import { REQUEST_PENDING_VISITS } from '../../../../../../../src/components/managementView/widgets/visits/constants';

describe('Actions test, for pendingVisits component', () => {
    it('requestPendingVisits should retunr type REQUEST_PENDING_VISITS', () => {
        const response = requestPendingVisits();
        expect(response.type).to.equal(REQUEST_PENDING_VISITS);
    })
})