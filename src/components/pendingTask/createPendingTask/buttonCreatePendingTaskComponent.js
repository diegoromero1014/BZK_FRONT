import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';

import ModalComponentPendingTask from './modalComponentPendingTask';
import SecurityMessageComponent from './../../globalComponents/securityMessageComponent';
import {redirectUrl} from "../../globalComponents/actions";
import { updateTitleNavBar } from '../../navBar/actions';

class ButtonCreatePendingTaskComponent extends Component {

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.createTask = this.createTask.bind(this);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  createTask() {
    const { updateTitleNavBar } = this.props;
    updateTitleNavBar("Tareas");
    redirectUrl("/dashboard/task");
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { actionEdit } = this.props;
    return (
      <Col xs={2} sm={2} md={1} lg={1}>
        <button className="btn btn-primary" type="button" title="Crear tarea" style={{ float: "right", marginTop: '21px' }} onClick={this.createTask}>
          <i className="tasks  icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog modalBt4-lg">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Tarea</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <SecurityMessageComponent />
              <ModalComponentPendingTask isOpen={this.closeModal} actionEdit={actionEdit} />
            </div>
          </div>
        </Modal>
      </Col>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({ navBar }, ownerProps) {
  return {
    navBar
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonCreatePendingTaskComponent);

//export default (ButtonCreatePendingTaskComponent);