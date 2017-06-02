import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import ContactInfo from '../contact/component';
import {validateContactShareholder} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import {MODULE_CONTACTS} from '../../constantsGlobal';
import SweetAlert from 'sweetalert-react';

class BottonContactAdmin extends Component {
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      modalIsOpen: false,
      showErrorPermissions: false
    };
  }

  openModal(){
    const {navBar} = this.props;
    if( _.get(navBar.get('mapModulesAccess'), MODULE_CONTACTS) ){
      this.setState({modalIsOpen: true});
    } else {
      this.setState({ showErrorPermissions: true });
    }
  }

  closeModal(){
    const {validateContactShareholder} = this.props;
    validateContactShareholder().then( (data) => {
      if(!_.get(data, 'payload.data.validateLogin')){
        redirectUrl("/login");
      }
    });
    this.setState({modalIsOpen: false});
  }

  render(){
    const {errorContact, clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    return (
      <div>
        { errorContact ?
          <span style={{marginLeft: "20px", marginTop: "10px", color: "red", fontSize: "12pt"}} >Falta Representante Legal <span style={{cursor: "pointer",textDecoration: "underline"}} onClick={this.openModal}>(Completar aquí>>)</span></span>
          :
          <span style={{marginLeft: "20px", marginTop: "10px", color: "green", fontSize: "12pt"}} >El cliente tiene información de Representante Legal, <span style={{cursor: "pointer",textDecoration: "underline"}} onClick={this.openModal}>recuerde revisarlo>>.</span></span>
        }
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg" style={{width: '80%'}}>
              <div className="modalBt4-content modal-content">
                  <div className="modalBt4-header modal-header">
                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Administración contactos</h4>
                    <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                      <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                  <ContactInfo infoClient={infoClient}/>
              </div>
          </div>
        </Modal>
        <SweetAlert
         type= "warning"
         show={this.state.showErrorPermissions}
         title="Acceso denegado"
         text="Señor usuario, no tiene permisos para acceder a éste módulo."
         onConfirm={() => this.setState({showErrorPermissions: false})}
         />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateContactShareholder
  }, dispatch);
}

function mapStateToProps({clientInformacion, navBar},ownerProps) {
  return {
    clientInformacion,
    navBar
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BottonContactAdmin);
