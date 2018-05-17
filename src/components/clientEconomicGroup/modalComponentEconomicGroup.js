import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import { reduxForm } from 'redux-form';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { REQUEST_ERROR, ERROR_MESSAGE_REQUEST, MESSAGE_USER_WITHOUT_PERMISSIONS } from '../../constantsGlobal';
import { stringValidate, validateIsNullOrUndefined, validateResponse, onSessionExpire } from '../../actionsGlobal';
import { bindActionCreators } from 'redux';
import { getClientsEconomicGroup, updateEconomicGroupClient } from './actions';
import ClientsEconomicGroup from './clientsEconomicGroup';
import { clientsFindServer } from '../clients/actions';
import ComboBoxFilter from '../../ui/comboBoxFilter/comboBoxFilter';
import _ from 'lodash';
import $ from 'jquery';

var clients = [];
class ModalComponentEconomicGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      nameClientSearch: '',
      idClient: null
    };
    this._closeError = this._closeError.bind(this);
    this.updateKeyValueClient = this.updateKeyValueClient.bind(this);
    this.addClientToRelationship = this.addClientToRelationship.bind(this);
  }

  _closeError() {
    this.setState({ showError: false, messageError: '' });
  }

  componentWillMount() {
    const { getClientsEconomicGroup, clientInformacion } = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    getClientsEconomicGroup(infoClient.economicGroup).then((data) => {
      if (_.get(data, 'payload.data.data.status') === REQUEST_ERROR) {
        this.setState({
          showError: true,
          messageError: ERROR_MESSAGE_REQUEST
        });
      } else {
        if (_.get(data, 'payload.data.data.validateLogin')) {
          onSessionExpire();
        }
      }
    });
  }

  _mapClientItems(item, idx) {
    return <ClientsEconomicGroup
      key={idx}
      dataId={item.id}
      dataName={item.name}
      dataDocumentType={item.documentType}
      dataDocument={item.document}
      dataAccountManager={item.accountManager}
      dataEconomicGroup={item.economicGroup}
      dataIsProspect={item.prospect}
      dataIsAccess={item.access}
    />
  }

  componentDidMount() {
    const self = this;
    $("#iconClientRelationship").click(function () {
      var e = { keyCode: 13, consultclick: true };
      self.updateKeyValueClient(e);
    });
  }

  componentWillUpdate() {
    const self = this;
    $("#iconClientRelationship").click(function () {
      var e = { keyCode: 13, consultclick: true };
      self.updateKeyValueClient(e);
    });
  }

  updateKeyValueClient(e) {
    const { clientsFindServer, swtShowMessage } = this.props;
    const self = this;
    if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
      e.consultclick ? "" : e.preventDefault();
      const nameClient = this.state.nameClientSearch;
      if (stringValidate(nameClient) && nameClient.length >= 3) {
        $('.ui.search.clientRelationship').toggleClass('loading');
        clientsFindServer(nameClient, 0, 150, "", "", null, null, null, null).then((data) => {
          clients = _.get(data, 'payload.data.data.rows', []);
          $('.ui.search.clientRelationship')
            .search({
              cache: false,
              source: clients,
              maxResults: 1500,
              searchFields: [
                'title',
                'description',
                'id',
              ],
              onSelect: function (event) {
                self.setState({
                  nameClientSearch: event.name,
                  idClient: event.id
                });
                return 'default';
              }
            });
          $('.ui.search.clientRelationship').toggleClass('loading');
          setTimeout(function () {
            $('#clientRelationship').focus();
          }, 150);
        });
      } else {
        swtShowMessage('error', 'Error buscando cliente', 'Señor usuario, para realizar la busqueda es necesario ingresar mínimo 3 caracteres');
      }
    }
  }

  addClientToRelationship() {
    const { swtShowMessage, clientEconomicGroupReducer, updateEconomicGroupClient, getClientsEconomicGroup, clientInformacion } = this.props;
    const idClient = this.state.idClient;

    if (!validateIsNullOrUndefined(idClient)) {
      //Valido si estoy agregando un cliente que ya se encuentra en la relación
      if (!validateIsNullOrUndefined(_.find(_.get(clientEconomicGroupReducer.get('economicGroupClients'), "listClients", []), ['id', idClient]))) {
        swtShowMessage('error', 'Error agregando cliente', 'Señor usuario, el cliente que quiere agregar ya se encuentra en el grupo económico.');
      } else {
        const infoClient = clientInformacion.get('responseClientInfo');
        const self = this;
        updateEconomicGroupClient(idClient, infoClient.economicGroup).then((data) => {
          if (validateResponse(data)) {
            if (_.get(data, 'payload.data.data', false)) {
              swtShowMessage('success', 'Cliente agregado', 'Señor usuario, el cliente se agregó al grupo económico de forma exitosa.');
              self.setState({
                nameClientSearch: '',
                idClient: null
              });
              getClientsEconomicGroup(infoClient.economicGroup);
            } else {
              swtShowMessage('error', 'Error agregando cliente', 'Señor usuario, el cliente no puede pertenecer al grupo económico porque es NIT principal de otras relaciones.');
            }
          } else {
            swtShowMessage('error', 'Error agregando cliente', 'Señor usuario, ocurrió un error tratando de agregar el cliente al grupo económico.');
          }
        });
      }
    } else {
      swtShowMessage('error', 'Error agregando cliente', 'Señor usuario, para agregar un cliente al grupo económico primero debe selecionar uno.');
    }
  }

  render() {
    const { clientEconomicGroupReducer, clientInformacion} = this.props;
    const nameEconomicGroup = _.get(clientEconomicGroupReducer.get('economicGroupClients'), "nameEconomicGroup", "");
    const nitEconomicGroup = _.get(clientEconomicGroupReducer.get('economicGroupClients'), "nitEconomicGroup", "");
    const clientsEconomicGroup = _.get(clientEconomicGroupReducer.get('economicGroupClients'), "listClients", []);
    const haveAccessEdit = _.get(clientInformacion.get('responseClientInfo'),'haveAccessEdit',false);

    return (
      <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: "hidden", marginBottom: '15px' }}>
        
          {
            haveAccessEdit &&
            <Row style={{ padding: "10px 20px 0px 20px" }}>
                <Col xs={10} md={8} lg={6}>
                  <dt><span>Cliente </span></dt>
                  <dd>
                    <div className="ui dropdown search clientRelationship fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                      <ComboBoxFilter className="prompt" id="clientRelationship" idIcon="iconClientRelationship"
                        style={{ borderRadius: "3px" }}
                        autoComplete="off"
                        type="text"
                        value={this.state.nameClientSearch}                        
                        placeholder="Ingrese un criterio de búsqueda..."
                        onChange={(e) => this.setState({ nameClientSearch: e.target.value })}
                        onKeyPress={this.updateKeyValueClient}
                        touched={true}
                      />
                    </div>
                  </dd>
                </Col>
                <Col xs={2} md={4} lg={4}>
                  <button className="btn btn-primary" type="button" onClick={this.addClientToRelationship}
                    style={{ cursor: 'pointer', marginTop: '35px' }}>
                    <i className="plus icon"></i> Agregar
                  </button>
                </Col>  
              </Row>
          }
        <Row style={{ padding: "0px 20px 20px 20px" }}>
          <Col xs={12} md={12} lg={12} style={{ paddingTop: '20px' }}>
            <div className="news-page content">
              <div className="team-modal" style={{ textAlign: 'center', marginBottom: "30px" }}>
                <div className="client-card" style={{ width: '300px', textAlign: 'left', height: '100px' }}>
                  <div className="celula-card-top" style={{ borderBottom: '0px' }}>
                    <div className="celula-card-top-left">
                      <div className="celula-title">{nameEconomicGroup.length > 60 ? nameEconomicGroup.substring(0, 60) + "..." : nameEconomicGroup}</div>
                      {nitEconomicGroup !== '' &&
                        <div className="celula-name">NIT principal: {nitEconomicGroup}</div>
                      }
                    </div>
                  </div>
                  <div className="celula-card-bottom" style={{ backgroundColor: "#B0E0E6", marginTop: '-45px' }}></div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={12} lg={12}>
            <div className="news-page content">
              <div className="team-modal">
                {clientsEconomicGroup.length === 0 ?
                  <div style={{ textAlign: "center", marginTop: "15px" }}> <h4 className="form-item">Señor usuario, no hay clientes asociados a este grupo económico.</h4> </div>
                  :
                  clientsEconomicGroup.map(this._mapClientItems)}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEconomicGroupClient,
    getClientsEconomicGroup,
    clientsFindServer,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ clientEconomicGroupReducer, clientInformacion }, ownerProps) {
  return {
    clientEconomicGroupReducer,
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentEconomicGroup);
