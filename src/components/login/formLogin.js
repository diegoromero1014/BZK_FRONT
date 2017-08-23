import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    stopObservablesLeftTimer,
    validateLogin,
    saveSessionToken,
    clearStateLogin,
    saveSessionUserName,
    clearSessionUserName
} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import _ from 'lodash';
import {LOADING_LOGIN, ITEM_ACTIVE_MENU_DEFAULT} from './constants';
import {showLoading} from '../loading/actions';
import {changeActiveItemMenu} from '../menu/actions';


class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: "",
            password: "",
            messageErrorServidor: false,
            messageUsuarioIncorrecto: false,
            messageWithoutPermissions: false
        }
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

    _handleValidateLogin(e) {
        e.preventDefault();
        const {usuario, password} = this.state;
        const {validateLogin, showLoading, changeActiveItemMenu} = this.props;
        showLoading(true, LOADING_LOGIN);
        validateLogin(usuario, password)
            .then(response => {
                if (_.get(response, 'payload.data.status') === 200) {
                    if (_.get(response, 'payload.data.data.redirecUrl') === "login") {
                        this.setState({
                            messageUsuarioIncorrecto: true,
                            messageErrorServidor: false,
                            messageWithoutPermissions: false
                        });
                    } else if (_.get(response, 'payload.data.data.redirecUrl') === "withoutPermissions") {
                        this.setState({
                            messageWithoutPermissions: true,
                            messageUsuarioIncorrecto: false,
                            messageErrorServidor: false
                        });
                    } else {
                        const {saveSessionToken, redirectUrl} = this.props;
                        saveSessionToken(_.get(response, 'payload.data.data.sessionToken'));
                        saveSessionUserName(usuario);
                        changeActiveItemMenu(ITEM_ACTIVE_MENU_DEFAULT);
                        redirectUrl("/dashboard/clients");
                    }
                } else {
                    this.setState({
                        messageErrorServidor: true,
                        messageUsuarioIncorrecto: false,
                        messageWithoutPermissions: false
                    });
                }
                showLoading(false, '');
            })
            .catch(err => {
                showLoading(false, '');
                this.setState({
                    messageErrorServidor: true,
                    messageUsuarioIncorrecto: false,
                    messageWithoutPermissions: false
                });
            });
    }

    componentWillMount() {
        const {stopObservablesLeftTimer} = this.props;
        stopObservablesLeftTimer();
        this.state.messageErrorServidor = false;
        this.state.messageUsuarioIncorrecto = false;
        this.state.messageWithoutPermissions = false;
        const {clearStateLogin} = this.props;
        clearSessionUserName();
        clearStateLogin();
    }

    render() {
        const {login} = this.props;
        return (
            <form onSubmit={this._handleValidateLogin.bind(this)} className=" loginform" autoComplete="off">
                <h4 className="form-item" style={{marginLeft: '0px', paddingLeft: '28px', paddingRight: '28px'}}>Hola,
                    ingrese a su cuenta:</h4>
                <div className="form-item" style={{marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px'}}>
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
                <div className="form-item" style={{marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px'}}>
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
                {this.state.messageErrorServidor &&
                <div style={{marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px"}}>
                    <span style={{color: "#e76e70", size: "17px"}}>Ocurrió un error en el servidor</span>
                </div>
                }
                {this.state.messageUsuarioIncorrecto &&
                <div style={{marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px"}}>
                    <span style={{color: "#e76e70", size: "17px"}}>Usuario o contraseña incorrecto</span>
                </div>
                }
                {this.state.messageWithoutPermissions &&
                <div style={{marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px"}}>
                    <span
                        style={{color: "#e76e70", size: "17px"}}>Usuario sin privilegios suficientes para acceder</span>
                </div>
                }
                <div className="button-item" style={{marginLeft: "0px", paddingLeft: '28px', paddingRight: '28px'}}>
                    <button type="submit" className="btn btn-primary" style={{width: "100%", marginLeft: "0px"}}>
                        <span>Iniciar sesión</span>
                        {login.get('validateLogin') &&
                        <img src="img/loading.gif" style={{marginLeft: "10px", heigth: "100%", verticalAlign: "sub"}}
                             width="20"/>
                        }
                    </button>
                </div>
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

function mapStateToProps({login}, ownerProps) {
    return {
        login
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
