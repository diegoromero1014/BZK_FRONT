import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import ModalDownloadVisit from '../visit/downloadVisits/component';
import ModalDownloadPreVisit from '../previsita/downloadPrevisits/component';
import ModalDownloadBusinessPlan from '../businessPlan/downloadBusinessPlan/component';
import DownloadTask from '../pendingTask/downloadTask/component';
import DownloadPipeline from "./downloadPipeline/component";

import { changeErrorYearSeleted } from './actions';

import { TAB_BUSINESS, TAB_PIPELINE, TAB_PREVISIT, TAB_TASKS, TAB_VISIT } from './constants';

class ButtonDownloadModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    const { year } = this.props;
    if (year === undefined || year === null) {
      const {changeErrorYearSeleted} = this.props;
      changeErrorYearSeleted(true);
    } else {
      this.setState({ modalIsOpen: true });
    }
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { itemSeleted, year } = this.props;
    let title = "";
    if (itemSeleted === TAB_VISIT) {
      title = "de visita";
    } else if (itemSeleted === TAB_PREVISIT) {
      title = "de previsita";
    } else if (itemSeleted === TAB_BUSINESS) {
      title = "de planes de negocio";
    } else if (itemSeleted === TAB_TASKS) {
      title = "de tareas";
    } else if (itemSeleted === TAB_PIPELINE) {
      title = "de pipeline";
    }

    return (
      <div>
        <i className='green file excel outline icon'
          title="Descargar información en formato Excel"
          onClick={this.openModal}
          style={{ fontSize: "18px", float: 'right', marginTop: '10px', marginRight: "5px", cursor: 'pointer' }} />
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
          <div className="modalBt4-dialog ">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{'Opciones ' + title}</h4>
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              {itemSeleted === TAB_VISIT && <ModalDownloadVisit itemSeletedModal={itemSeleted} yearModal={year} isOpen={this.closeModal} />}
              {itemSeleted === TAB_PREVISIT && <ModalDownloadPreVisit itemSeletedModal={itemSeleted} yearModal={year} isOpen={this.closeModal} />}
              {itemSeleted === TAB_PIPELINE && <DownloadPipeline itemSelectedModal={itemSeleted} isOpen={this.closeModal} />}
              {itemSeleted === TAB_BUSINESS && <ModalDownloadBusinessPlan itemSeletedModal={itemSeleted} yearModal={year} isOpen={this.closeModal} />}
              {itemSeleted === TAB_TASKS && <DownloadTask itemSeletedModal={itemSeleted} yearModal={year} isOpen={this.closeModal} />}
            </div>
          </div>
        </Modal>
      </div>
    );
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeErrorYearSeleted
  }, dispatch);
}

function mapStateToProps({viewManagementReducer}, ownerProps) {
  return {
    viewManagementReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDownloadModal);
