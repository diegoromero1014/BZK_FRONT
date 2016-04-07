import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {validateLogin, saveSessionToken} from './actions';
import {redirectUrl} from '../globalComponents/actions';

class FormLogin extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      usuario: "",
      password: ""
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
    })
    .catch(err => {
    });
  }

  componentDidUpdate (){
    const {login} = this.props;
    if( login.get('status') === "loggedIn" ){
      saveSessionToken(login.get('responseLogin').sessionToken);
      redirectUrl("/dashboard");
    }
  }

  render(){
    const {login} = this.props;
    return(
      <div>
        <form onSubmit={this._handleValidateLogin.bind(this)}  className=" loginform" autoComplete="off">
          <h4 className="form-item">Hola, ingrese a su cuenta:</h4>
          <div className="form-item" style={{width: "100%", marginLeft: "5px"}}>
            <input type="text" id="welcome-login-id" style={{width: "90%", heigth: "30px", marginLeft: "10px", padding: "0px 0px 0px 0px !important"}}
              placeholder="Usuario" className="input-edit"
              required value={this.state.id} onChange={this._handleChangeId.bind(this)}></input>
          </div>
          <div className="form-item" style={{width: "100%", marginLeft: "5px"}}>
            <input type="password" id="welcome-login-password" style={{width: "90%", heigth: "30px", marginLeft: "10px", padding: "0px 0px 0px 0px !important"}}
              placeholder="Contraseña" className="input-edit"
              required value={this.state.password} onChange={this._handleChangePassword.bind(this)}></input>
          </div>
          {login.get('error')  &&
            <div style={{marginLeft: "20px", marginTop: "20px", marginBottom: "0px", marginRight: "10px"}} >
              <span style={{color: "#e76e70", size: "17px"}}>Usuario o contraseña incorrecto</span>
            </div>
          }
          <div className="button-item" style={{width: "100%"}}>
            <button type="submit" className="btn btn-primary" style={{width: "90%", marginLeft: "3%"}}>
              <span>Iniciar sesión</span>
              {login.get('validateLogin') &&
                <img src="img/loading.gif" style={{ marginLeft: "10px", heigth: "100%", verticalAlign: "sub"}} width="20" />
              }
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateLogin,
    saveSessionToken,
    redirectUrl
  }, dispatch);
}

function mapStateToProps({login},ownerProps) {
  return {
    login
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
