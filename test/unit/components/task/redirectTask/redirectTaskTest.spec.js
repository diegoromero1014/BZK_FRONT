import RedirectTaskComponentRedux, {RedirectTaskComponent} from "../../../../../src/components/pendingTask/redirectTask";
import React from 'react';
import * as globalActions from "../../../../../src/components/globalComponents/actions";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";

let defaultProps = {};
let dispatchSetTaskIdFromRedirect = sinon.fake();
let redirectUrl;
let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test RedirectTaskComponent', () => {

    beforeEach(() => {
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        defaultProps = {
            params: {
                id: 15616
            },
            dispatchSetTaskIdFromRedirect
        };
        store = mockStore({
            defaultProps
        });
    });

    afterEach(() => {
       redirectUrl.restore();
    });

    describe('Rendering unit tests', () => {

        it('should render RedirectTaskComponent', () => {
           itRenders(<RedirectTaskComponent {...defaultProps}/>);
           expect(redirectUrl.calledOnce);
        });

    });

    describe('Actions unit tests', () => {

        it('renderRedirect should not call redirectUrl when redirect state is false', () => {
           const wrapper = shallow(<RedirectTaskComponent {...defaultProps}/>);
           wrapper.setState({redirect: false});
           wrapper.instance().renderRedirect(1231);
           expect(redirectUrl.calledOnce);
        });
    });

    describe('Redux render unit tests', () => {

        it('should render with redux', () => {
            itRenders(<RedirectTaskComponentRedux store={store}/>)
        });
    });
});