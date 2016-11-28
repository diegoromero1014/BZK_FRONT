import React, {Component, PropTypes} from 'react';
import * as constants from '../login/constants';
import ImageLogoApp from '../../../img/svg/logo_bancolombia.svg';
import {redirectUrl} from './actions';
import SweetAlert from 'sweetalert-react';

class AlertWithoutPermissions extends Component{

  constructor(props){
    super(props);
    this._closeModal = this._closeModal.bind(this);
    this.state = {
      openMessagePermissions: false
    };
  }

  componentWillReceiveProps(nextProps){
    const {openMessagePermissions} = nextProps;
    this.setState({
      openMessagePermissions: openMessagePermissions
    });
  }

  _closeModal(){
    this.setState({openMessagePermissions: false});
    redirectUrl("/dashboard/home");
  }

  render(){
    const {style} = this.props;
    return(
      <div>
        <SweetAlert
         type= "warning"
         show={this.state.openMessagePermissions}
         title="Acceso denegado"
         text="Señor usuario, no tiene permisos para acceder a éste módulo."
         onConfirm={this._closeModal}
         />
      </div>
    );
  }
}
export default AlertWithoutPermissions;
