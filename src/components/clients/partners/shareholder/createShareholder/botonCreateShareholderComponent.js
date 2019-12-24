import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import ModalComponentShareholder from './modalComponentShareholder';
import { toggleModalShareholder } from './actions';

class BotonCreateShareholderComponent extends Component {

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
      <Col xs={2} sm={2} md={1} lg={1}>
        <button className="btn btn-primary" disabled={disabled} type="button" title="Crear accionista" style={{ float: "right" }} onClick={this.openModal}>
          <i className="add user icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Accionista</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <ModalComponentShareholder isOpen={this.closeModal} />
            </div>
          </div>
        </Modal>
      </Col>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleModalShareholder
  }, dispatch);
}

function mapStateToProps({ createShareholder }, ownerProps) {
  return {
    createShareholder
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateShareholderComponent);