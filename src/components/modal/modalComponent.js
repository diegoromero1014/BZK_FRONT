import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { toggleModal } from './action';
import { clearClienEdit } from '../contact/contactDetail/actions';
import { bindActionCreators } from 'redux';
import * as views from './constants';
import { clearSearchShareholder } from '../shareholder/shareholderDetail/actions';
import { clearValuesAdressessKeys } from '../selectsComponent/actions';
import ContactDetailsModalComponent from '../contact/contactDetail/contactDetailsModalComponent';
import ComponentShareHolderDetail from '../shareholder/shareholderDetail/componentShareHolderDetail';
import ModalTask from '../visit/tasks/modalTask';
import ModalCreateTask from '../pendingTask/modalCreateTask';
import ModalTrackingCovenant from '../risksManagement/covenants/createTracking/modalTrackingCovenant';

class ModalComponentDialog extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      modalIsOpen: false
    };
    this._contectViewModal = this._contectViewModal.bind(this);
  }

  openModal() {
    const {actions, clearValuesAdressessKeys, clearSearchShareholder} = this.props;
    switch (actions.component) {
      case views.VIEW_SHAREHOLDER:
        clearValuesAdressessKeys();
        clearSearchShareholder();
        break;
    }
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    const {clearClienEdit} = this.props;
    const actions = this.props.actions
    this.setState({ modalIsOpen: false });
    if (actions.component === views.VIEW_CONTACT) {
      clearClienEdit();
    }
  }

  _contectViewModal(actions, idx) {
    var cell;
    const {closeModal} = this.props;
    switch (actions.component) {
      case views.VIEW_CONTACT:
        cell = <ContactDetailsModalComponent contactId={actions.id} isOpen={this.closeModal} />
        break;
      case views.VIEW_SHAREHOLDER:
        cell = <ComponentShareHolderDetail shareHolderId={actions.id} isOpen={this.closeModal} />
        break;
      case views.VIEW_TASK:
        cell = <ModalTask taskEdit={actions.task} isOpen={this.closeModal} />
        break;
      case views.VIEW_TASK_ADMIN:
        cell = <ModalCreateTask taskEdit={actions.id} isOpen={this.closeModal} idClient={actions.idClient} />
        break;
      case views.VIEW_TRACKING_COVENANT:
        cell = <ModalTrackingCovenant covenantId={actions.id} isOpen={this.closeModal} />
        break;
    }

    return (cell);
  }


  render() {
    const modalTitle = this.props.modalTitle;
    const actions = this.props.actions;
    return (
      <td style={{ padding: '10px', textAlign: 'center' }}><button className="btn btn-primary btn-sm" onClick={this.openModal}>
        <i className="zoom icon" style={{ margin: '0em', fontSize: '1.2em' }} />
      </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">

          <div className="modalBt4-dialog modalBt4-lg">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">{modalTitle}</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              {this._contectViewModal(actions)}
            </div>
          </div>
        </Modal>
      </td>
    );
  }
}

function mapStateToProps({modal}, {idModal}) {
  return {
    modalStatus: modal.get('modalState')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearValuesAdressessKeys,
    clearSearchShareholder,
    toggleModal,
    clearClienEdit
  }, dispatch);
}

ModalComponentDialog.propTypes = {
  modalTitle: PropTypes.string,
  actions: PropTypes.object
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentDialog);
