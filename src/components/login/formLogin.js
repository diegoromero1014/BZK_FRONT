import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { isInternetExplorer } from '../../utils/browserValidation';
import SweetAlert from "../sweetalertFocus";
import ReCaptcha from '../recaptcha/ReCaptcha';
import {clearCache} from '../../utils/catchRequest';

import {
    stopObservablesLeftTimer,
    validateLogin,
    saveSessionToken,
    clearStateLogin,
    saveSessionUserName,
    clearSessionUserName,
} from './actions';
import { redirectUrl } from '../globalComponents/actions';
import { showLoading } from '../loading/actions';
import { changeActiveItemMenu } from '../menu/actions';

import { LOADING_LOGIN, ITEM_ACTIVE_MENU_DEFAULT } from './constants';
import { MESSAGE_SERVER_ERROR, REQUEST_SUCCESS } from '../../constantsGlobal';
import { changeTokenStatus } from '../main/actions';
import {TaskPageUrl} from "../../constantsAnalytics";

export class FormLogin extends Component {
    constructor(props) {
        super(props);

        const browserMessage = !isInternetExplorer() ? "Para acceder a todas las funcionalidades de biztrack, por favor ingrese por Internet Explorer" : "" ;

        this.state = {
            usuario: "",
            password: "",
            message: "",
            browserMessage,
            showMessageNotification: false,
            messageTitle: '¡Aviso!',
            messageNotification: '',
            loginAttempts: 0,
            valueRecaptcha:""
        };        
        this.redirectLogin = this.redirectLogin.bind(this);
        this.getValueRecaptcha = this.getValueRecaptcha.bind(this);
    }

    handleChangeId = (e) => {
        this.setState({
            usuario: e.target.value
        })
    };

    handleChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    };

    redirectLogin = () => {
        this.setState({ showMessageNotification: false });
        redirectUrl("/dashboard/clients");
    };

    getValueRecaptcha = (value) => {
        this.setState({valueRecaptcha:value});
    };

    handleValidateLogin = (e) => {
        e.preventDefault();
        
        const { usuario, password } = this.state;
        const recaptcha = this.state.loginAttempts >= 2 ? this.state.valueRecaptcha : null;
        const { dispatchValidateLogin, dispatchShowLoading, dispatchChangeActiveItemMenu, dispatchChangeTokenStatus, tasksByClient } = this.props;
        const taskIdFromRedirect = tasksByClient.get('taskIdFromRedirect');
        dispatchChangeTokenStatus(true);
        dispatchShowLoading(true, LOADING_LOGIN);        
        dispatchValidateLogin(usuario, password, recaptcha)
            .then( response => {
                if (_.get(response, 'payload.data.status') === REQUEST_SUCCESS) {
                    if (_.get(response, 'payload.data.data.message', true)) {
                        this.setState({
                            message: (_.get(response, 'payload.data.data.message'))
                        });
                    } else {
                        const { dispatchSaveSessionToken } = this.props;
                        dispatchSaveSessionToken(_.get(response, 'payload.data.data.sessionToken'));
                        saveSessionUserName(usuario, _.get(response, 'payload.data.data.username'));
                        dispatchChangeActiveItemMenu(ITEM_ACTIVE_MENU_DEFAULT);

                        if(taskIdFromRedirect)
                            redirectUrl(`${TaskPageUrl}/${taskIdFromRedirect}`);
                        else
                            redirectUrl("/dashboard/clients");
                    }
                } else {
                    let res = JSON.parse(response.payload.data.data);
                    this.setState({
                        message: res.message,
                        loginAttempts: res.loginAttempts
                    });
                    if(res.shouldReload){
                        window.location.reload(true);
                    }
                }
                dispatchShowLoading(false, '');
            })
            .catch(err => {
                dispatchShowLoading(false, '');
                this.setState({
                    message: MESSAGE_SERVER_ERROR
                });
            });
    };

    componentWillMount() {
        const { dispatchShowLoading, dispatchStopObservablesLeftTimer, dispatchClearStateLogin, mainReducer } = this.props;

        let token = window.localStorage.getItem('sessionTokenFront');

        const validToken = mainReducer.get("validToken");

        clearCache();
        dispatchShowLoading(false, null);    
        
        if (token == null || token === '' || !validToken) {

            dispatchStopObservablesLeftTimer();
            //Limpiar variables de sesion (idClientSelected)
            clearSessionUserName();
            //Esto no hace nada
            dispatchClearStateLogin();
        } else {
            // El usuario ya se encuentra logueado
            redirectUrl("/dashboard/clients");
        }
    }

    render() {
        const { login } = this.props;               
        return (
            <form onSubmit={this.handleValidateLogin.bind(this)} className=" loginform" autoComplete="off">
                <h4 className="form-item" style={{ marginLeft: '0px', paddingLeft: '28px', paddingRight: '28px' }}>Hola,
                    ingrese a su cuenta:</h4>
                <div className="form-item" style={{ marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px' }}>
                    <input type="text" id="welcome-login-id" style={{
                        width: "100%",
                        heigth: "30px",
                        marginLeft: "0px",
                        marginBottom: "10px",
                        padding: "0px 0px 0px 0px !important"
                    }}
                        placeholder="Usuario" className="input-edit"
                        required value={this.state.id} onChange={this.handleChangeId.bind(this)}></input>
                </div>
                <div className="form-item" style={{ marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px' }}>
                    <input type="password" id="welcome-login-password" style={{
                        width: "100%",
                        heigth: "30px",
                        marginLeft: "0px",
                        marginBottom: "10px",
                        padding: "0px 0px 0px 0px !important"
                    }}
                        placeholder="Contraseña" className="input-edit"
                        required value={this.state.password}
                        onChange={this.handleChangePassword.bind(this)}></input>
                </div>
                <div className={'form-item ' + (this.state.loginAttempts >= 2 ? 'show' : 'hidden')} style={{ marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px' }}>
                    <ReCaptcha getValueRecaptcha={this.getValueRecaptcha}/>
                </div>
                <div style={{ marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px" }}>
                    <span style={{ color: "#e76e70", size: "17px" }}>{this.state.message}</span>
                </div>
                <div style={{ marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px" }}>
                    <span style={{ color: "#e76e70", size: "17px" }}>{this.state.browserMessage}</span>
                </div>
                <div className="button-item" style={{ marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", marginLeft: "0px" }}>
                        <span>Iniciar sesión</span>
                        {login.get('validateLogin') &&
                            <img src="img/loading.gif" style={{ marginLeft: "10px", heigth: "100%", verticalAlign: "sub" }}
                                width="20" />
                        }
                    </button>
                </div>
                <SweetAlert
                    type="warning"
                    show={this.state.showMessageNotification}
                    title={this.state.messageTitle}
                    text={this.state.messageNotification}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Continuar'

                    onConfirm={this.redirectLogin} />
            </form>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchStopObservablesLeftTimer: stopObservablesLeftTimer,
        dispatchValidateLogin: validateLogin,
        dispatchSaveSessionToken: saveSessionToken,
        dispatchClearStateLogin: clearStateLogin,
        dispatchShowLoading: showLoading,
        dispatchChangeActiveItemMenu: changeActiveItemMenu,
        dispatchChangeTokenStatus: changeTokenStatus,
    }, dispatch);
}

const mapStateToProps = ({ login, mainReducer, tasksByClient }) => {
    return {
        login,
        mainReducer,
        tasksByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);