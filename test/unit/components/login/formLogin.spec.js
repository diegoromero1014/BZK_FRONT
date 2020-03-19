import React from 'react';
import Immutable from 'immutable';
import {FormLogin} from "../../../../src/components/login/formLogin";

let defaultProps;

let dashboardReducer;
let showLoading;
let stopObservablesLeftTimer;
let clearStateLogin;
let changeTokenStatus;
let validateLogin;
let saveSessionToken;
let changeActiveItemMenu;
let login;

describe('Test formLogin component', () => {

    beforeEach(() => {
        showLoading = sinon.fake();
        stopObservablesLeftTimer = sinon.fake();
        clearStateLogin = sinon.fake();
        changeTokenStatus = sinon.fake();
        saveSessionToken = sinon.fake();
        changeActiveItemMenu = sinon.fake();
        validateLogin = sinon.stub();
        validateLogin.resolves({
            payload: {
                data: {
                    status: 200,
                    data: {
                        message: '',
                        username: 'Daniel Gallego'
                    }
                }
            }
        });

        login = Immutable.Map({
            validateLogin: true
        });
        dashboardReducer = Immutable.Map({
            validToken: ''
        });
        defaultProps = {
            showLoading,
            dashboardReducer,
            stopObservablesLeftTimer,
            clearStateLogin,
            changeTokenStatus,
            validateLogin,
            saveSessionToken,
            changeActiveItemMenu,
            login
        };
    });

    describe('Rendering tests', () => {
        it('should render formLogin', () => {
            itRenders(<FormLogin {...defaultProps}/>)
        });
    });

    describe('Actions tests', () => {
        it('handleValidateLogin should call', () => {
           const wrapper = itRenders(<FormLogin {...defaultProps}/>);
           wrapper.setState({
               usuario: 'daegalle',
               password: '1234'
           });
           wrapper.instance()._handleValidateLogin({ preventDefault: sinon.fake()});
        });
    });
});