import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import {toggleModal} from './action';
import {bindActionCreators} from 'redux';
import * as views from './constants';
import ContactDetailsModalComponent from '../contact/contactDetailsModalComponent';

class ModalComponentDialog extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
          this._contectViewModal = this._contectViewModal.bind(this);
    }

    closeModal() {
        this.props.toggleModal();
    }

    _contectViewModal(actions, idx){
      var cell;

    switch (actions.component) {
        case views.VIEW_CONTACT:
            console.log("antes bu");
                cell =<ContactDetailsModalComponent/>
            break;
          }
              return (
                cell
              );
      }


    render() {
        const {modalStatus} = this.props;
        const status = modalStatus ? "Verdadero" : "Falso";
        const modalTitle = this.props.modalTitle;
        const actions = this.props.actions;
        return (
          <Modal
              isOpen={modalStatus}
              onRequestClose={this.closeModal}
              className="modalBt4-fade modal fade contact-detail-modal in"
          >
              <div className="modalBt4-dialog modalBt4-lg">
                  <div className="modalBt4-content modal-content">
                      <div className="modalBt4-header modal-header">
                      <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                        <span className="modal-title" aria-hidden="true" role="close"><i className="icon-cross modal-icon-close" role="close"></i></span>
                        <span className="sr-only">Close</span>
                      </button>
                            <h4 className="modal-title" id="myModalLabel">{modalTitle}</h4>
                      </div>{this._contectViewModal(actions)}
                        <div className="modalBt4-footer modal-footer">
                        <button type="button" className="btn btn-primary modal-button-edit" onClick={this.closeModal}>Guardar
                        </button>
                            <button type="button" className="btn btn-secondary modal-button-edit" data-dismiss="modal"
                                    onClick={this.closeModal}>Cancelar
                            </button>

                        </div>
                  </div>
              </div>
          </Modal>
        );
    }
}

function mapStateToProps({modal}) {
    return {
        modalStatus: modal.get('modalState')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModal
    }, dispatch);
}

ModalComponentDialog.propTypes = {
   modalTitle: PropTypes.string,
   actions:PropTypes.object
};


export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentDialog);
