import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col } from 'react-flexbox-grid';
import { Icon } from 'semantic-ui-react';
import Modal from 'react-modal';
import ToolTip from '../../toolTip/toolTipComponent';
import ModalComponentContact from './modalComponentContact';
import { toggleModalContact } from './actions';

class BotonCreateContactComponent extends Component {

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { typeButton, icon, message, disabled } = this.props;
    return (
      <Col xs={2} sm={2} md={typeButton === 1 ? 4 : 1} lg={typeButton === 1 ? 4 : 1} style={typeButton === 1 ? { marginRight: '14px' } : {}}>
        {typeButton === 1 ?
          <button className="btn btn-primary" type="button" title="Crear contacto" style={typeButton === 1 ? { marginTop: "20px" } : { float: "right" }} onClick={this.openModal}>
            Crear contacto
            </button>
          : typeButton === 3 && icon && message ? 
            <ToolTip text={message}>
                <Icon disabled={disabled} name={icon} style={{ cursor: 'pointer', color: 'rgb(33, 133, 208)' }} size='huge' onClick={() => !disabled && this.openModal()}/>
            </ToolTip>
          :
            <button className="btn btn-primary" type="button" title="Crear contacto" style={{ float: "right" }} onClick={this.openModal}>
              <i className="add user icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
            </button>
        }
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Contacto</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <ModalComponentContact isOpen={this.closeModal} />
            </div>
          </div>
        </Modal>
      </Col>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleModalContact
  }, dispatch);
}

function mapStateToProps({ createContactReducer }, ownerProps) {
  return {
    createContactReducer
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateContactComponent);