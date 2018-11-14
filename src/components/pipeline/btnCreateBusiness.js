import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';

import createFormPipeline from './createPipeline/formPipeline';

import { toggleModalContact } from './actions';

import { ORIGIN_PIPELIN_BUSINESS } from './constants';

class BotonCreateComponent extends Component {

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
    const { typeButton, disabled } = this.props;
    const PipelineComponent = createFormPipeline(null, ORIGIN_PIPELIN_BUSINESS, this.closeModal);
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} style={{ textAlign: "right" }}>
          <button className="btn btn-primary" type="button" title="Crear negocio" onClick={this.openModal} disabled={disabled} style={_.isEqual(disabled, "disabled") ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}>
            Agregar negocio
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Negocio</h4>
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <PipelineComponent />
              </div>
            </div>
          </Modal>
        </Col>
      </Row>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleModalContact
  }, dispatch);
}

function mapStateToProps({ }, ownerProps) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateComponent);