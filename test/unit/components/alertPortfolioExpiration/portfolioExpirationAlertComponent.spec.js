import { ClientsPendingUpdate } from '../../../../src/components/alertPortfolioExpirtation/portfolioExpirationAlertComponent';
import ListClientsAlertPortfolioExp from '../../../../src/components/alertPortfolioExpirtation/listPortfolioExpiration';
import * as actionsGlobalComponents from '../../../../src/components/globalComponents/actions';
import { createFieldsFromArray } from '../../../helpers/ReduxFormField';
import Immutable from 'immutable';

describe('Test PorfolioExpirationAlertComponent', () => {

    let stubRedirect;

    let fields = createFieldsFromArray(["team", "region", "zone", "type", "line"]);
    let defaultProps;

    beforeEach(() => {
        stubRedirect = sinon.stub(actionsGlobalComponents, 'redirectUrl');
        defaultProps = {
            fields: fields,
            alertPortfolioExpiration: Immutable.Map({
                totalClientsByFiltered: 5
            }),
            selectsReducer: Immutable.Map({})
        }
    });

    afterEach(() => {
        stubRedirect.restore();
    });

    it('Should render', () => {
        itRenders(<ClientsPendingUpdate {...defaultProps} />);
    });

    it('Should render number of clients', () => {
        const wrapper = shallow(<ClientsPendingUpdate {...defaultProps} />);
        expect(wrapper.find(".numero-clientes-encontrados").text()).to.equal("Total: 5");
    });

    it('Should render ListClientsAlertPortfolioExp', () => {
        itRendersChildComponent(
            <ClientsPendingUpdate {...defaultProps} />,
            ListClientsAlertPortfolioExp
        )
    })
})