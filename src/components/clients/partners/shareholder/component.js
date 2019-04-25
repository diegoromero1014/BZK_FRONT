import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import $ from 'jquery';

import SearchShareholderComponent from './searchShareholderComponent';
import BotonCreateShareholderComponent from './createShareholder/botonCreateShareholderComponent';
import PaginationShareholderComponent from './paginationShareholderComponent';
import ListShareholderComponent from './listShareholderComponent';
import SelectFilterContact from '../../../selectsComponent/selectFilterContact/selectFilterComponent';
import AlertWithoutPermissions from '../../../globalComponents/alertWithoutPermissions';

import { clearShareholder, shareholdersByClientFindServer, updateCertificateNoShareholder } from './actions';
import { changeCheckInfoClient } from '../../../clientInformation/actions';
import { redirectUrl } from '../../../globalComponents/actions';
import { validatePermissionsByModule, onSessionExpire } from '../../../../actionsGlobal';

import { NUMBER_RECORDS, SHAREHOLDER_KIND } from './constants';
import { MODULE_SHAREHOLDERS, CREAR, EDITAR } from '../../../../constantsGlobal';
import { CLIENT_TYPE } from '../../../selectsComponent/constants';

var enableClickCertificationShareholder = "";

class ShareholderComponent extends Component {

  constructor(props) {
    super(props);
    this._handleChangeValueCertificateShareholder = this._handleChangeValueCertificateShareholder.bind(this);
    this.state = {
      openMessagePermissions: false,
      value1: "",
      value2: "",
      valueCheck: false,
      disabledComponents: ""
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { clearShareholder, shareholdersByClientFindServer, clientInformacion, validatePermissionsByModule } = this.props;
      const infoClient = clientInformacion.get('responseClientInfo');
      clearShareholder();
      shareholdersByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'),
        NUMBER_RECORDS, "sh.sharePercentage", 1, "", "", "").then((data) => {
          if (_.get(data, 'payload.data.rowCount') !== 0) {
            enableClickCertificationShareholder = "disabled";
          } else {
            enableClickCertificationShareholder = "";
            if (infoClient.certificateNoShareholder) {
              this.setState({
                valueCheck: infoClient.certificateNoShareholder,
                disabledComponents: "disabled"
              });
            } else {
              this.setState({
                valueCheck: infoClient.certificateNoShareholder,
                disabledComponents: ""
              });
            }
          }
        }
        );
      validatePermissionsByModule(MODULE_SHAREHOLDERS).then((data) => {
        if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          onSessionExpire();
        } else {
          if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
            this.setState({ openMessagePermissions: true });
          }
        }
      });
    }
  }

  _handleChangeValueCertificateShareholder() {
    const selector = $("#checkNoShareholder");
    if (!selector[0].checked) {
      this.setState({
        valueCheck: false,
        disabledComponents: ""
      });
    } else {
      this.setState({
        valueCheck: true,
        disabledComponents: "disabled"
      });
    }
    const { updateCertificateNoShareholder, changeCheckInfoClient } = this.props;
    updateCertificateNoShareholder(selector[0].checked);
    changeCheckInfoClient(selector[0].checked);
  }

  _validateDisabledCheckCertificate() {

  }

  render() {
    const { shareholdersReducer, reducerGlobal } = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if (shareholdersReducer.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
      enableClickCertificationShareholder = "disabled"
    } else {
      enableClickCertificationShareholder = "";
    }
    return (
      <div className="tab-pane quickZoomIn animated"
        style={{ width: "100%", marginTop: "10px" }}>
        {_.get(reducerGlobal.get('permissionsShareholders'), _.indexOf(reducerGlobal.get('permissionsShareholders'), EDITAR), false) &&
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>
              <input type="checkbox" id="checkNoShareholder"
                checked={this.state.valueCheck}
                disabled={enableClickCertificationShareholder}
                onClick={this._handleChangeValueCertificateShareholder} />
              &nbsp;&nbsp;Certifico que el cliente no tiene accionistas con un porcentaje de participación mayor a 5%.
            </label>
          </div>
        }
        <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'visible' }}>
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs={10} sm={10} md={11} lg={11}>
                <SearchShareholderComponent
                  value1={this.state.value1}
                  value2={this.state.value2}
                  disabled={this.state.disabledComponents}
                />
              </Col>
              {
                _.get(
                  reducerGlobal.get('permissionsShareholders'),
                  _.indexOf(reducerGlobal.get('permissionsShareholders'), CREAR),
                  false) && <BotonCreateShareholderComponent disabled={this.state.disabledComponents} />
              }
            </Row>
            <Row>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Tipo de accionista:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value1: value.id })
                }}
                  disabled={this.state.disabledComponents}
                  idTypeFilter={SHAREHOLDER_KIND} />
              </Col>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Tipo de persona:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value2: value.id })
                }}
                  disabled={this.state.disabledComponents}
                  idTypeFilter={CLIENT_TYPE} />
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style={{ display: visibleTable, width: "100%" }}>
          <Row>
            <Col xs>
              <ListShareholderComponent
                value1={this.state.value1}
                value2={this.state.value2} />
              <PaginationShareholderComponent
                value1={this.state.value1}
                value2={this.state.value2} />
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
    clearShareholder,
    shareholdersByClientFindServer,
    updateCertificateNoShareholder,
    changeCheckInfoClient,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({ shareholdersReducer, clientInformacion, reducerGlobal }, ownerProps) {
  return {
    shareholdersReducer,
    clientInformacion,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareholderComponent);