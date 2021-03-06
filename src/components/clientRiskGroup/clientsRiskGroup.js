import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { swtShowMessage } from '../sweetAlertMessages/actions';
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
    const { dataName, dataDocumentType, dataDocument, key, client, validateHasRiskGroup, isPending, gridRow, gridColumn } = this.props;
    let clsName = ["client-card", "g-c-" + gridColumn , "g-r-" + gridRow].join(" ");
    return (
      <div key={key} className={clsName} style={{
        width: "95%",
        marginBottom: "15px",
        cursor: 'auto',
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div className="celula-card-top" style={{ height: "auto", minHeight: "93px", width: "100%", flexGrow: 1 }}>
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{ backgroundColor: (client.isPending ? "rgb(220, 220, 220)" : "#B0E0E6"), width: "100%" }}>
          {!client.isPending && !isPending &&
            <i className="trash icon delete-tab" style={{ marginTop: "-14px", fontSize: '13pt' }}
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
                {<ModalComponentRemoveMember validateHasRiskGroup={validateHasRiskGroup} client={client} isOpen={this.closeModalRemoveClient} />}
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