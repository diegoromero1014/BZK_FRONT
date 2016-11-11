import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {validateLogin, saveSessionToken, clearStateLogin} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import _ from 'lodash';


class FormLogin extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      usuario: "",
      password: "",
      messageErrorServidor: false,
      messageUsuarioIncorrecto: false
    }
  }

  _handleChangeId(e){
    this.setState({
      usuario: e.target.value
    })
  }

  _handleChangePassword(e){
    this.setState({
      password: e.target.value
    })
  }

  _handleValidateLogin(e){
    e.preventDefault();
    const {usuario, password} = this.state;
    const {validateLogin} = this.props;
    validateLogin(usuario, password)
    .then( response => {
      if( _.get(response, 'payload.data.data') !== {} && _.get(response, 'payload.data.data') !== undefined ){
        if( _.get(response, 'payload.data.data.redirecUrl') === "/login" &&
            _.get(response, 'payload.data.data.sessionToken') === "" ){
          this.setState({
            messageUsuarioIncorrecto: true,
            messageErrorServidor: false
          });
        } else {
          const {saveSessionToken, redirectUrl} = this.props;
          saveSessionToken(_.get(response, 'payload.data.data.sessionToken'));
          redirectUrl("/dashboard");
        }
      } else {
        this.setState({
          messageErrorServidor: true,
          messageUsuarioIncorrecto: false
        });
      }
    })
    .catch(err => {
      this.setState({
        messageErrorServidor: true,
        messageUsuarioIncorrecto: false
      });
    });
  }

  componenWillMount(){
    this.state.messageErrorServidor = false;
    this.state.messageUsuarioIncorrecto = false;
    const {clearStateLogin} = this.props;
    clearStateLogin();
  }

  render(){
    const {login} = this.props;
    return(
        <form onSubmit={this._handleValidateLogin.bind(this)}  className=" loginform" autoComplete="off">
          <h4 className="form-item" style={{marginLeft: '0px',paddingLeft: '28px',paddingRight: '28px'}}>Hola, ingrese a su cuenta:</h4>
          <div className="form-item" style={{marginLeft: "0px",paddingLeft: '28px',paddingRight: '28px'}}>
            <input type="text" id="welcome-login-id" style={{width: "100%", heigth: "30px", marginLeft: "0px",marginBottom: "10px" ,padding: "0px 0px 0px 0px !important"}}
              placeholder="Usuario" className="input-edit"
              required value={this.state.id} onChange={this._handleChangeId.bind(this)}></input>
          </div>
          <div className="form-item" style={{marginLeft: "0px",paddingLeft: '28px',paddingRight: '28px'}}>
            <input type="password" id="welcome-login-password" style={{width: "100%", heigth: "30px", marginLeft: "0px",marginBottom: "10px",padding: "0px 0px 0px 0px !important"}}
              placeholder="Contraseña" className="input-edit"
              required value={this.state.password} onChange={this._handleChangePassword.bind(this)}></input>
          </div>
          {this.state.messageErrorServidor  &&
            <div style={{marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px"}} >
              <span style={{color: "#e76e70", size: "17px"}}>Ocurrió un error en el servidor</span>
            </div>
          }
          {this.state.messageUsuarioIncorrecto &&
            <div style={{marginLeft: "28px", marginTop: "20px", marginBottom: "0px", marginRight: "10px"}} >
              <span style={{color: "#e76e70", size: "17px"}}>Usuario o contraseña incorrecto</span>
            </div>
          }
          <div className="button-item" style={{marginLeft: "0px",paddingLeft: '28px',paddingRight: '28px'}}>
            <button type="submit" className="btn btn-primary" style={{width: "100%", marginLeft: "0px"}}>
              <span>Iniciar sesión</span>
              {login.get('validateLogin') &&
                <img src="img/loading.gif" style={{ marginLeft: "10px", heigth: "100%", verticalAlign: "sub"}} width="20" />
              }
            </button>
          </div>
        </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateLogin,
    saveSessionToken,
    clearStateLogin,
    redirectUrl
  }, dispatch);
}

function mapStateToProps({login},ownerProps) {
  return {
    login
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
