import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import ContactInfo from '../contact/component';
import {validateContactShareholder} from './actions';

class BottonContactAdmin extends Component {
  constructor(props){
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal(){
    this.setState({modalIsOpen: true});
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
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateContactShareholder
  }, dispatch);
}

function mapStateToProps({clientInformacion},ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BottonContactAdmin);