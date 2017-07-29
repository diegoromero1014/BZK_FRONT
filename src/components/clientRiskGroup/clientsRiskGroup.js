import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import { } from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { validateResponse } from '../../actionsGlobal';
import { MESSAGE_SAVE_DATA } from '../../constantsGlobal';
import ModalComponentRemoveMember from './modalComponentRemoveMember';

import Modal from 'react-modal';


class clientsRiskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmDelete: false,
      modalRemoveClientIsOpen: false
    };

    this.openModalRemoveClient = this.openModalRemoveClient.bind(this);
    this.closeModalRemoveClient = this.closeModalRemoveClient.bind(this);


  }


  openModalRemoveClient() {
    this.setState({ modalRemoveClientIsOpen: true });
  }

  closeModalRemoveClient() {
    this.setState({ modalRemoveClientIsOpen: false });
  }

  render() {
    const { dataName, dataDocumentType, dataDocument, key, client } = this.props;
    return (
      <div key={key} className="client-card" style={{ width: "100%", marginBottom: "15px", cursor: 'auto', height: "auto" }}>
        <div className="celula-card-top" style={{ height: "auto", minHeight: "79px" }}>
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{ backgroundColor: (client.isPending ? "rgb(220, 220, 220)" : "#B0E0E6") }}>
          {!client.isPending &&
            <i className="trash outline icon delete-tab" style={{ marginTop: "-14px", fontSize: '13pt' }}
              onClick={this.openModalRemoveClient}
              title="Remover cliente grupo de riesgo" />
          }


          <Modal isOpen={this.state.modalRemoveClientIsOpen} onRequestClose={this.closeModalRemoveClient} className="modalBt4-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-md">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Retirar cliente</h4>
                  <button type="button" onClick={this.closeModalRemoveClient} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                {<ModalComponentRemoveMember client={client} isOpen={this.closeModalRemoveClient} />}
              </div>
            </div>
          </Modal>


        </div>

      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ riskGroupReducer }, ownerProps) {
  return {
    riskGroupReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(clientsRiskGroup);