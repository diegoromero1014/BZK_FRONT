import React from 'react';
import { FormLogin } from '../../../../src/components/login/formLogin';
import FormLoginRedux from '../../../../src/components/login/formLogin';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchRedirectUrl;
let dispatchChangeTokenStatus;
let dispatchValidateLogin;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('FormLogin Test', () => {

    beforeEach(() => {
        defaultProps = {
            mainReducer: Immutable.Map({ validToken: false}),
            dispatchShowLoading: sinon.fake(),
            dispatchStopObservablesLeftTimer: sinon.fake(),
            dispatchClearStateLogin: sinon.fake(),
            login: Immutable.Map({ validateLogin: false}),
            dispatchRedirectUrl: sinon.fake(),
            dispatchChangeTokenStatus: spy(sinon.fake()),
            dispatchValidateLogin: sinon.stub().resolves({}),
        };

        store = mockStore({
            defaultProps
        })
    })

    it('Should render component', () => {
        itRenders(<FormLogin {...defaultProps}/>);
    })

    it('Should render component Redux', () => {
        itRenders(<FormLoginRedux {...defaultProps} store={store}/>);
    })

    it('when instanced handleChangeId', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.setState({usuario: null});
        wrapper.instance().handleChangeId({ target: { value: 'any'}});
        expect(wrapper.state().usuario).to.equal('any');
    })

    it('when instanced handleChangePassword', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.setState({password: null});
        wrapper.instance().handleChangePassword({ target: { value: 'any'}});
        expect(wrapper.state().password).to.equal('any');
    })

    // it('when instanced redirectLogin', () => {
    //     const wrapper = shallow(<FormLogin {...defaultProps}/>);
    //     wrapper.instance().redirectLogin();
    //     sinon.assert.calledOnce(dispatchRedirectUrl);
    // })

    it('when instanced getValueRecaptcha', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.setState({ valueRecaptcha: null });
        wrapper.instance().getValueRecaptcha('any');
        expect(wrapper.state().valueRecaptcha).to.equal('any');
    })

    it('when instanced handleValidateLogin', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.instance().handleValidateLogin({ preventDefault: sinon.fake() });
        sinon.assert.calledOnce(dispatchChangeTokenStatus);
        // sinon.assert.calledOnce(dispatchShowLoading);
        // sinon.assert.calledOnce(dispatchValidateLogin);
    })
})