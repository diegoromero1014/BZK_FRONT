import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import { getClientsEconomicGroup, deleteRelationEconomicGroup } from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { validateResponse } from '../../actionsGlobal';
import { MESSAGE_SAVE_DATA } from '../../constantsGlobal';
import { changeEconomicGroup } from '../clientInformation/actions';

class clientsEconomicGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmDelete: false
    };
    this._removeClientOfEconomicGroup = this._removeClientOfEconomicGroup.bind(this);
  }

  _removeClientOfEconomicGroup() {
    this.setState({ showConfirmDelete: false });
    const { deleteRelationEconomicGroup, getClientsEconomicGroup, clientInformacion, dataId, swtShowMessage, 
      changeStateSaveData, changeEconomicGroup } = this.props;
    deleteRelationEconomicGroup(dataId).then((data) => {
      if (validateResponse(data)) {
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEqual(infoClient.id, dataId)) {
          infoClient.economicGroup = _.get(data, 'payload.data.data');
          changeEconomicGroup(_.get(data, 'payload.data.data'));
        }
        swtShowMessage('success', 'Cliente eliminado', 'Señor usuario, el cliente fue eliminado correctamente del grupo económico');
        getClientsEconomicGroup(infoClient.economicGroup);
      } else {
        swtShowMessage('error', 'Error eliminando relación', 'Señor usuario, ocurrió un error tratando de eliminar el cliente del grupo económico');
      }
    });
  }

  render() {
    const { dataName, dataDocumentType, dataDocument, dataEconomicGroup, dataAccountManager, dataIsProspect, dataIsAccess } = this.props;
    return (
      <div className="client-card" style={{ width: "265px", float: "left", cursor: 'auto' }}>
        <div className="celula-card-top">
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
            <div className="celula-name" style={{ marginTop: "5px", fontStyle: "italic" }}>{dataAccountManager}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{ backgroundColor: dataIsAccess ? "#B0E0E6" : "#DCDCDC" }}>
          {dataIsAccess &&
            <i className="trash outline icon delete-tab" style={{ marginTop: "-14px", fontSize: '13pt' }}
              onClick={() => this.setState({ showConfirmDelete: true })}
              title="Eliminar cliente del grupo económico" />
          }
        </div>
        {dataIsProspect &&
          <div className="prospect-corner prospect badge badge-important animated bounceIn" style={{ borderRadius: "10px" }}>P</div>
        }
        <SweetAlert
          type="warning"
          show={this.state.showConfirmDelete}
          title="Grupo económico"
          confirmButtonColor='#2671d7'
          confirmButtonText='Sí'
          cancelButtonText="No"
          text="¿Señor usuario, está seguro que desea eliminar el cliente del grupo económico?"
          showCancelButton={true}
          onCancel={() => this.setState({ showConfirmDelete: false })}
          onConfirm={() => this._removeClientOfEconomicGroup()} />
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteRelationEconomicGroup,
    getClientsEconomicGroup,
    changeEconomicGroup,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ clientInformacion, clientEconomicGroupReducer }, ownerProps) {
  return {
    clientInformacion,
    clientEconomicGroupReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(clientsEconomicGroup);