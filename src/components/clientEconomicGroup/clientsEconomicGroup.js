import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SweetAlert from '../sweetalertFocus';
import { getClientsEconomicGroup, deleteRelationEconomicGroup } from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { validateResponse } from '../../actionsGlobal';
import { changeEconomicGroup, consultInfoClient } from '../clientInformation/actions';
import { showLoading } from '../loading/actions';
import { TAB_INFO } from '../../constantsGlobal';
import { updateTabSeleted } from '../clientDetailsInfo/actions';

class clientsEconomicGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmDelete: false
    };
    this._handleClickClientItem = this._handleClickClientItem.bind(this);
    this._removeClientOfEconomicGroup = this._removeClientOfEconomicGroup.bind(this);
  }

  _handleClickClientItem(e) {
    const { dataIsAccess, dataId, consultInfoClient, showLoading, swtShowMessage, closeModal, updateTabSeleted, tabReducer } = this.props;

    if (dataIsAccess) {

   
    window.sessionStorage.setItem('idClientSelected', dataId);

    showLoading(true, 'Cargando...');

    consultInfoClient(dataId).then((data) => {
      if (!_.get(data, 'payload.data.validateLogin')) {
        onSessionExpire();
      }
      showLoading(false, '');
      updateTabSeleted(TAB_INFO);
      var tabActive = tabReducer.get('tabSelected');
      updateTabSeleted(tabActive);
      closeModal();
    }).catch(() => {
      showLoading(false, '');
      swtShowMessage("error", "Error servidor", "Señor usuario, ha ocurrido un error en el servidor.");
    });

  } else {
    swtShowMessage("error", "Acceso denegado", "Señor usuario, usted no pertenece a la célula del cliente seleccionado, por tal motivo no puede ver su información.");
  }

  }


  _removeClientOfEconomicGroup() {
    this.setState({ showConfirmDelete: false });
    const { deleteRelationEconomicGroup, getClientsEconomicGroup, clientInformacion, dataId, swtShowMessage,
      changeStateSaveData, changeEconomicGroup, consultInfoClient } = this.props;
    deleteRelationEconomicGroup(dataId).then((data) => {
      if (validateResponse(data)) {
        const infoClient = clientInformacion.get('responseClientInfo');
        let economicGroup;
        if (_.isEqual(infoClient.id, dataId)) {
          infoClient.economicGroup = _.get(data, 'payload.data.data');
          economicGroup = _.get(data, 'payload.data.data');
          changeEconomicGroup(economicGroup);

          window.sessionStorage.setItem('idClientSelected', dataId);
          consultInfoClient(dataId);
        }
        swtShowMessage('success', 'Cliente eliminado', 'Señor usuario, el cliente fue eliminado correctamente del grupo económico');
        getClientsEconomicGroup(infoClient.economicGroup);
      } else {
        swtShowMessage('error', 'Error eliminando relación', 'Señor usuario, ocurrió un error tratando de eliminar el cliente del grupo económico');
      }
    });
  }

  render() {
    const { dataName, dataDocumentType, dataDocument, dataAccountManager, dataIsProspect, dataIsAccess, clientInformacion } = this.props;
    const haveAccessEdit = _.get(clientInformacion.get('responseClientInfo'), 'haveAccessEdit', false);
    return (
      <div className="client-card" style={{ width: "265px", float: "left", cursor: 'auto' }}>
        <div className="celula-card-top" onClick={this._handleClickClientItem} style={ { cursor: "pointer" } }>
          <div className="celula-card-top-left">
            <div className="celula-title">{dataName.length > 60 ? dataName.substring(0, 60) + "..." : dataName}</div>
            <div className="celula-name">{dataDocumentType}: {dataDocument.length > 20 ? dataDocument.substring(0, 20) + "..." : dataDocument}</div>
            <div className="celula-name" style={{ marginTop: "5px", fontStyle: "italic" }}>{dataAccountManager}</div>
          </div>
        </div>
        <div className="celula-card-bottom" style={{ backgroundColor: dataIsAccess ? "#B0E0E6" : "#DCDCDC" }}>
          {dataIsAccess && haveAccessEdit &&
            <i className="trash icon delete-tab" style={{ marginTop: "-14px", fontSize: '13pt' }}
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
    swtShowMessage,
    consultInfoClient,
    showLoading,
    updateTabSeleted,
  }, dispatch);
}

function mapStateToProps({ clientInformacion, clientEconomicGroupReducer, tabReducer }, ownerProps) {
  return {
    clientInformacion,
    clientEconomicGroupReducer,
    tabReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(clientsEconomicGroup);