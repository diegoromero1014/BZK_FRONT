import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    stopObservablesLeftTimer,
    validateLogin,
    saveSessionToken,
    clearStateLogin,
    saveSessionUserName,
    clearSessionUserName
} from './actions';
import { redirectUrl } from '../globalComponents/actions';
import _ from 'lodash';
import { LOADING_LOGIN, ITEM_ACTIVE_MENU_DEFAULT } from './constants';
import { MESSAGE_SERVER_ERROR, REQUEST_SUCCESS } from '../../constantsGlobal';
import { showLoading } from '../loading/actions';
import { changeActiveItemMenu } from '../menu/actions';

import SweetAlert from "sweetalert-react";
import { swtShowMessage } from '../sweetAlertMessages/actions';


class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: "",
            password: "",
            message: "",
            showMessageNotification: false,
            messageTitle: '¡Aviso!',
            messageNotification: ''


        }

        this._redirectLogin = this._redirectLogin.bind(this);

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
    

    _handleValidateLogin(e) {
        e.preventDefault();
        const { usuario, password } = this.state;
        const { validateLogin, showLoading, changeActiveItemMenu } = this.props;
        showLoading(true, LOADING_LOGIN);
        validateLogin(usuario, password)
            .then(response => {
                if (_.get(response, 'payload.data.status') === REQUEST_SUCCESS) {
                    if (_.get(response, 'payload.data.data.message', true)) {
                        this.setState({
                            message: (_.get(response, 'payload.data.data.message'))
                        });
                    } else {

                        const { saveSessionToken, redirectUrl } = this.props;
                        saveSessionToken(_.get(response, 'payload.data.data.sessionToken'));
                        saveSessionUserName(usuario);
                        changeActiveItemMenu(ITEM_ACTIVE_MENU_DEFAULT);

                        let messageNotification = _.get(response, 'payload.data.data.messageNotification');

                        if (_.get(response, 'payload.data.data.messageNotification', true) &&  messageNotification){
                           //Mensaje notificacion
                           this.setState({showMessageNotification : true, messageNotification: messageNotification  });

                        } else {
                           redirectUrl("/dashboard/clients");
                        }
                    }
                } else {
                    this.setState({
                        message: MESSAGE_SERVER_ERROR
                    });
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
        const { stopObservablesLeftTimer, clearStateLogin } = this.props;
        stopObservablesLeftTimer();
        clearSessionUserName();
        clearStateLogin();
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
                <div style={{ marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px" }}>
                    <span style={{ color: "#e76e70", size: "17px" }}>{this.state.message}</span>
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
        changeActiveItemMenu
    }, dispatch);
}

function mapStateToProps({ login }, ownerProps) {
    return {
        login
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
