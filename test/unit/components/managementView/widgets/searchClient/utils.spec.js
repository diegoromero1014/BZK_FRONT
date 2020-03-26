import * as globalActions from '../../../../../../src/components/globalComponents/actions';
import { redirectCreatePropspect } from '../../../../../../src/components/managementView/widgets/searchClient/utils';

let redirectUrl;

describe('Unit test utils of sectionSearchClient component', () => {

    beforeEach(() => {
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
    });

    afterEach(() => {
        redirectUrl.restore();
    });

    it('Test function redirectCreatePropspect', () => {
        const result = redirectCreatePropspect();
        expect(result).to.equal(redirectUrl());
    })
})