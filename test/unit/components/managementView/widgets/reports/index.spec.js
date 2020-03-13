import ReportsRedux from "../../../../../../src/components/managementView/widgets/reports";
import { Reports } from "../../../../../../src/components/managementView/widgets/reports";
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const defaultProps = {}

describe('Test widget report', () => {

    beforeEach(() => {
        defaultProps.dispatchValidate = sinon.stub();
        defaultProps.dispatchValidate.resolves({
            payload: {
                data: {
                    data: {

                    }
                }
            }
        });
        defaultProps.dispatchShowMessage = sinon.fake();

        store = mockStore({
            defaultProps
        })
    });

    describe('Redering with redux unit test', () => {
        it('should render', () => {
            itRenders(<ReportsRedux store={store} />);
        })
    });

    describe('Redering unit test', () => {
        it('should render', async () => {
            const wrapper = itRenders(<Reports {...defaultProps} />);
            wrapper.instance().validatePermissions = sinon.stub();
            wrapper.instance().validatePermissions.resolves(true);

            await wrapper.instance().componentDidMount();
            expect(wrapper.state().reports.length).to.equal(5);
        })
    });

    describe('Execute actions', () => {
        it('should execute function validatePermissions', async () => {
            defaultProps.dispatchValidate.resolves({
                payload: {
                    data: {
                        data: {
                            permissions: ['DESCARGAR']
                        }
                    }
                }
            });
            const wrapper = itRenders(<Reports {...defaultProps} />);

            const response = await wrapper.instance().validatePermissions('DESCARGAR');

            expect(response).to.equal(true);
        });

        it('should execute function validatePermissions without parameters', async () => {
            defaultProps.dispatchValidate.resolves({
                payload: {
                    data: {
                        data: {
                            permissions: ['DESCARGAR']
                        }
                    }
                }
            });
            const wrapper = itRenders(<Reports {...defaultProps} />);

            const response = await wrapper.instance().validatePermissions();

            expect(response).to.equal(false);
        });
    })
});