import React, { Component } from 'react';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchContactComponent from './searchContactComponent';
import ListContactComponent from './listContactComponent';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import PaginationContactComponent from './paginationContactComponent';
import BotonCreateContactComponent from './createContact/botonCreateContactComponent';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';

import { redirectUrl } from '../globalComponents/actions';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { contactsByClientFindServer, clearContact } from './actions';

import { MODULE_CONTACTS, CREAR } from '../../constantsGlobal';
import _ from "lodash";
import { FILTER_OUTDATE_CONTACT, FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, NUMBER_RECORDS } from './constants';
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _CONTACT } from '../../constantsAnalytics';

const valuesYesNo = [
  { 'id': "0", 'value': "Si"},
  { 'id': "1", 'value': "No"}
];

class ContactComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      value1: "",
      value2: "",
      value3: "",
      value4: ""
    };
  }

  componentWillMount() {
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _CONTACT,
      'pagina':_CONTACT

    });
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { contactsByClientFindServer, clearContact, validatePermissionsByModule } = this.props;
      clearContact();
      contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "", "", "", "", "");
      validatePermissionsByModule(MODULE_CONTACTS).then((data) => {
        if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          redirectUrl("/login");
        } else {
          if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
            this.setState({ openMessagePermissions: true });
          }
        }
      });
    }
  }

  render() {
    const { contactsByClient, reducerGlobal } = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if (contactsByClient.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className="tab-pane quickZoomIn animated"
        style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
        <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'visible' }}>
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs={10} sm={10} md={11} lg={11}>
                <SearchContactComponent
                  value1={this.state.value1}
                  value2={this.state.value2}
                  value3={this.state.value3}
                  value4={this.state.value4}
                />
              </Col>
              {_.get(reducerGlobal.get('permissionsContacts'), _.indexOf(reducerGlobal.get('permissionsContacts'), CREAR), false) &&
                <BotonCreateContactComponent />
              }
            </Row>
            <Row>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Función:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value1: value.id })
                }}
                  idTypeFilter={FILTER_FUNCTION_ID} />
              </Col>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Entidad / Línea de negocio:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value2: value.id })
                }}
                  idTypeFilter={FILTER_TYPE_LBO_ID} />
              </Col>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Tipo de contacto:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value3: value.id })
                }}
                  idTypeFilter={FILTER_TYPE_CONTACT_ID} />
              </Col>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Contactos desactualizados:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value4: value.id })
                  }}
                  dataDefault={valuesYesNo}
                  idTypeFilter={FILTER_OUTDATE_CONTACT}
                  />
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style={{ display: visibleTable, width: "100%" }}>
          <Row>
            <Col xs>
              <ListContactComponent
                value1={this.state.value1}
                value2={this.state.value2}
                value3={this.state.value3}
                value4={this.state.value4}
                origin ={'clientInformation'} />
              <PaginationContactComponent value1={this.state.value1}
                value2={this.state.value2}
                value3={this.state.value3}
                value4={this.state.value4}
              />
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span></Col>
          </Row>
        </Grid>
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    contactsByClientFindServer,
    clearContact,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({ contactsByClient, selectsReducer, reducerGlobal }, ownerProps) {
  return {
    contactsByClient,
    selectsReducer,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactComponent);