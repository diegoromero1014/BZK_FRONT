import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import ModalAddByFunctionOrType from './modalAddByFunctionOrType';
import Tooltip from '../../../toolTip/toolTipComponent';

class BtnAddByFunctionOrType extends Component {

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
    const { disabled } = this.props;
    return (
      <Col xs={1} sm={1} md={1} lg={1}>
        <Tooltip text='Agregar por función o tipo'>
          <button className="btn btn-primary" type="button" onClick={this.openModal}
            disabled={disabled} style={{ cursor: 'pointer', marginTop: '20px', marginLeft: '10px' }}>
            <i className="linkify icon"></i>
          </button>
        </Tooltip>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Asociar contactos</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <ModalAddByFunctionOrType isOpen={this.closeModal} />
            </div>
          </div>
        </Modal>
      </Col>
    );
  }
}

export default (BtnAddByFunctionOrType);
