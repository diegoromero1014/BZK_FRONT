import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import TasksRedux from "../../../../../../src/components/managementView/widgets/tasks";
import { Task }  from "../../../../../../src/components/managementView/widgets/tasks";
import { ASSIGNED_TASKS, ASSIGNED } from "../../../../../../src/components/managementView/widgets/tasks/constants";
import * as actions from '../../../../../../src/components/globalComponents/actions'

let defaultProps = {};

let store;
const middleWares = [thunk];
const mockStore = configureStore(middleWares);
let redirect;


describe('Tasks test', () => {
    beforeEach(() => {
        defaultProps = {
            assignedCounter: {
                finished: 0,
                pending: 0,
                total: 0,
            },
            myTaskCounter: {
                finished: 0,
                pending: 0,
                total: 0,
            }
        }

        defaultProps.dispatchGetInformationUser = sinon.fake();
        defaultProps.dispatchSetRolToSearch = sinon.fake();
        redirect = sinon.stub(actions, 'redirectUrl');

        const initialStore = {
            boardTaskReducer: defaultProps
        }

        store = mockStore(initialStore);
    });

    afterEach(() => {
        redirect.restore();
    });

    it('Should render component with Redux', () => {
        itRenders(<TasksRedux {...defaultProps} store={store} />);
    });

    it('Should render component', () => {
        itRenders(<Task {...defaultProps} />);
    });


    describe('Test actions', () => {
        it('handleDispatchAction', () => {
            const wrapper = shallow(<Task store={store} {...defaultProps} />);
            
            wrapper.instance().handleDispatchAction();
        });

        it('handleChangeTab', () => {
            const wrapper = shallow(<Task store={store} {...defaultProps} />);
            
            wrapper.instance().handleChangeTab(ASSIGNED_TASKS);
            expect(wrapper.state().tabName).to.equal(ASSIGNED_TASKS);
        });

        it('handleRedirect', () => {
            const wrapper = shallow(<Task store={store} {...defaultProps} />);
            
            wrapper.instance().handleRedirect();
        });

        it('getRole', () => {
            const wrapper = shallow(<Task store={store} {...defaultProps} />);

            wrapper.instance().handleChangeTab(ASSIGNED_TASKS);
            expect(wrapper.state().tabName).to.equal(ASSIGNED_TASKS);
            expect(wrapper.instance().getRole()).to.equal(ASSIGNED);
        });
    });
});