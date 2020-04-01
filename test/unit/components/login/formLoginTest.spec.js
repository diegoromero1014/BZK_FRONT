import React from 'react';
import { FormLogin } from '../../../../src/components/login/formLogin';
import FormLoginRedux from '../../../../src/components/login/formLogin';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let redirectUrl;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('FormLogin Test', () => {

    beforeEach(() => {
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        defaultProps = {
            mainReducer: Immutable.Map({ validToken: false}),
            dispatchShowLoading: sinon.fake(),
            dispatchStopObservablesLeftTimer: sinon.fake(),
            dispatchClearStateLogin: sinon.fake(),
            login: Immutable.Map({ validateLogin: false}),
            dispatchChangeTokenStatus: sinon.fake(),
            dispatchValidateLogin: sinon.stub().resolves({}),
        };

        store = mockStore({
            defaultProps
        })
    })

    afterEach(() => {
        redirectUrl.restore();
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

    it('when instanced redirectLogin', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.instance().redirectLogin();
        sinon.assert.calledOnce(redirectUrl);
    })

    it('when instanced getValueRecaptcha', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.setState({ valueRecaptcha: null });
        wrapper.instance().getValueRecaptcha('any');
        expect(wrapper.state().valueRecaptcha).to.equal('any');
    })

    it('when instanced handleValidateLogin', () => {
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.instance().handleValidateLogin({ preventDefault: sinon.fake()});
        expect(defaultProps.dispatchChangeTokenStatus.called).to.equal(true);
        expect(defaultProps.dispatchShowLoading.called).to.equal(true);
        expect(defaultProps.dispatchValidateLogin.called).to.equal(true);
    })

    it('when instanced handleValidateLogin when dispatchValidateLogin -> status is 0.', () => {
        defaultProps.dispatchValidateLogin = sinon.stub().resolves({
            payload: {
                data: {
                    status: null
                }
            }
        })
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.instance().handleValidateLogin({ preventDefault: sinon.fake()});
        expect(defaultProps.dispatchChangeTokenStatus.called).to.equal(true);
        expect(defaultProps.dispatchShowLoading.called).to.equal(true);
        expect(defaultProps.dispatchValidateLogin.called).to.equal(true);
    })

    it('when instanced handleValidateLogin when dispatchValidateLogin -> status is 200 and message is not empty', () => {
        defaultProps.dispatchValidateLogin = sinon.stub().resolves({
            payload: {
                data: {
                    status: 200,
                    data: {
                        message: 'Any message'
                    }
                }
            }
        })
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.instance().handleValidateLogin({ preventDefault: sinon.fake()});
        expect(defaultProps.dispatchChangeTokenStatus.called).to.equal(true);
        expect(defaultProps.dispatchShowLoading.called).to.equal(true);
        expect(defaultProps.dispatchValidateLogin.called).to.equal(true);
    })

    it('when instanced handleValidateLogin when dispatchValidateLogin -> status is 200 and message is not defined', () => {
        defaultProps.dispatchValidateLogin = sinon.stub().resolves({
            payload: {
                data: {
                    status: 200,
                    data: {
                        message: null
                    }
                }
            }
        })
        const wrapper = shallow(<FormLogin {...defaultProps}/>);
        wrapper.instance().handleValidateLogin({ preventDefault: sinon.fake()});
        expect(defaultProps.dispatchChangeTokenStatus.called).to.equal(true);
        expect(defaultProps.dispatchShowLoading.called).to.equal(true);
        expect(defaultProps.dispatchValidateLogin.called).to.equal(true);
    })
})