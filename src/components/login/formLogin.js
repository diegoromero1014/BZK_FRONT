import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    stopObservablesLeftTimer,
    validateLogin,
    saveSessionToken,
    clearStateLogin,
    saveSessionUserName,
    clearSessionUserName,
    saveSessionName,
    getUserDataFrontOfficeEmployee
} from './actions';
import { redirectUrl } from '../globalComponents/actions';
import _ from 'lodash';
import { LOADING_LOGIN, ITEM_ACTIVE_MENU_DEFAULT } from './constants';
import { MESSAGE_SERVER_ERROR, REQUEST_SUCCESS } from '../../constantsGlobal';
import { showLoading } from '../loading/actions';
import { changeActiveItemMenu } from '../menu/actions';
import { isInternetExplorer } from '../../utils/browserValidation';

import SweetAlert from "../sweetalertFocus";
import ReCaptcha from '../recaptcha/ReCaptcha';
import {clearCache} from '../../utils/catchRequest';
import { changeTokenStatus } from '../dashboard/actions';

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
        this._redirectLogin = this._redirectLogin.bind(this);
        this._getValueRecaptcha = this._getValueRecaptcha.bind(this);
    }

    _handleChangeId(e) {
        this.setState({
            usuario: e.target.value
        })
    }

    _handleChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    _redirectLogin() {
        this.setState({ showMessageNotification: false });
        redirectUrl("/dashboard/clients");
    }

    _getValueRecaptcha(value){
        this.setState({valueRecaptcha:value});
    }

    _handleValidateLogin(e) {
        e.preventDefault();
        
        const { usuario, password } = this.state;
        const recaptcha = this.state.loginAttempts >= 2 ? this.state.valueRecaptcha : null;
        const { validateLogin, showLoading, changeActiveItemMenu, changeTokenStatus, getUserDataFrontOfficeEmployee } = this.props;
        changeTokenStatus(true);
        showLoading(true, LOADING_LOGIN);        
        validateLogin(usuario, password, recaptcha)
            .then(response => {
                if (_.get(response, 'payload.data.status') === REQUEST_SUCCESS) {
                    if (_.get(response, 'payload.data.data.message', true)) {
                        this.setState({
                            message: (_.get(response, 'payload.data.data.message'))
                        });
                    } else {
                        const { saveSessionToken, redirectUrl } = this.props;
                        saveSessionToken(_.get(response, 'payload.data.data.sessionToken'));
                        saveSessionUserName(usuario, _.get(response, 'payload.data.data.username'));
                        changeActiveItemMenu(ITEM_ACTIVE_MENU_DEFAULT);
                        getUserDataFrontOfficeEmployee(usuario).then(data => {
                            saveSessionName(_.get(data, 'payload.data.data.name'));
                        })
                        // Activar cookie
                        document.cookie = 'estadoconexion=activa;path=/';                        

                        redirectUrl("/dashboard/clients");
                    }
                } else {
                    let res = JSON.parse(response.payload.data.data);
                    this.setState({
                        message: res.message,             
                        //TODO: reCaptcha deshabilitado           
                        loginAttempts: res.loginAttempts
                    });
                    if(res.shouldReload){
                        window.location.reload(true);
                    }
                }
                showLoading(false, '');
            })
            .catch(err => {
                showLoading(false, '');
                this.setState({
                    message: MESSAGE_SERVER_ERROR
                });
            });
    }

    componentWillMount() {
        const { showLoading, stopObservablesLeftTimer, clearStateLogin, dashboardReducer } = this.props;

        let token = window.localStorage.getItem('sessionTokenFront');

        const validToken = dashboardReducer.get("validToken");

        clearCache();
        showLoading(false, null);        
        
        if (token == null || token === '' || !validToken) {

            stopObservablesLeftTimer();
            //Limpiar variables de sesion (idClientSelected)
            clearSessionUserName();
            //Esto no hace nada
            clearStateLogin();
        } else {
            // El usuario ya se encuentra logueado
            redirectUrl("/dashboard/clients");
        }
    }

    render() {
        const { login } = this.props;               
        return (
            <form onSubmit={this._handleValidateLogin.bind(this)} className=" loginform" autoComplete="off">
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
                        required value={this.state.id} onChange={this._handleChangeId.bind(this)}></input>
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
                        onChange={this._handleChangePassword.bind(this)}></input>
                </div>
                <div className={'form-item ' + (this.state.loginAttempts >= 2 ? 'show' : 'hidden')} style={{ marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px' }}>
                    <ReCaptcha _getValueRecaptcha={this._getValueRecaptcha}/>
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

                    onConfirm={this._redirectLogin} />
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        stopObservablesLeftTimer,
        validateLogin,
        saveSessionToken,
        clearStateLogin,
        redirectUrl,
        showLoading,
        changeActiveItemMenu,
        changeTokenStatus,
        getUserDataFrontOfficeEmployee
    }, dispatch);
}

function mapStateToProps({ login, dashboardReducer }, ownerProps) {
    return {
        login,
        dashboardReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);