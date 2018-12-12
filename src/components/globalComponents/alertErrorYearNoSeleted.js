import React, {Component, PropTypes} from 'react';
import * as constants from '../login/constants';
import ImageLogoApp from '../../../img/svg/logo_bancolombia.svg';
import {redirectUrl} from './actions';
import {changeErrorYearSeleted} from '../viewManagement/actions';
import SweetAlert from '../sweetalertFocus';

class AlertErrorYearNoSeleted extends Component{

  constructor(props){
    super(props);
    this._closeModal = this._closeModal.bind(this);
    this.state = {
      openMessageError: false
    };
  }

  componentWillReceiveProps(nextProps){
    const {openMessageError} = nextProps;
    this.setState({
      openMessageError: openMessageError
    });
  }

  _closeModal(){
    this.setState({openMessageError: false});
  }

  render(){
    const {style} = this.props;
    return(
      <div>
        <SweetAlert
         type= "error"
         show={this.state.openMessageError}
         title="Error año"
         text="Señor usuario, para descargar la información debe seleccionar un año valido."
         onConfirm={this._closeModal}
         />
      </div>
    );
  }
}
export default AlertErrorYearNoSeleted;
