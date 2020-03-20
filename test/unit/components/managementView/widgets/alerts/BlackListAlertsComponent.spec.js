import thunk from "redux-thunk";
import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import BlackListAlertsRedux from "../../../../../../src/components/managementView/widgets/alerts/blackListAlerts";
import { BlackListAlertsComponent } from "../../../../../../src/components/managementView/widgets/alerts/blackListAlerts";
import * as actions from '../../../../../../src/components/globalComponents/actions'

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let defaultProps = {}
let redirect;

describe('Test widget BLackListAlerts Tab', () => {

    beforeEach(() => {
        defaultProps = {
            alertBlackList: Immutable.Map({
                responseBlackList: [],
                totalBlackListFiltered: 0
            }),
            dispatchBlackListAlerts: sinon.stub()
        }

        redirect = sinon.stub(actions, 'redirectUrl');

        store = mockStore(defaultProps);
    });

    afterEach(() => {
        redirect.restore();
    });

    describe('Redering unit test', () => {
        it('should render with redux', () => {
            itRenders(<BlackListAlertsRedux store={store} />);
        });

        it('should render without redux', () => {
            itRenders(<BlackListAlertsComponent store={store} {...defaultProps} />);
        });
    });

    describe('Test Button', () => {
        it('onClick', () => {
            const wrapper = shallow(<BlackListAlertsComponent store={store} {...defaultProps} />);
            const button = wrapper.find('Button');

            button.at(0).simulate('click');
        });
    });

    describe('Test actions', () => {
        it('handleOnPageChange', () => {
            const wrapper = shallow(<BlackListAlertsComponent store={store} {...defaultProps} />);
            
            wrapper.instance().handleOnPageChange(1)
        });
    });
});