import React, { Component, PropTypes } from 'react';
import { Row, Grid, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import { shorterStringValue } from '../../actionsGlobal';
import { YES, NO } from '../../constantsGlobal';
import { IMPORT, EXPORT } from './constants';

class InternationalOperations extends Component {

  constructor(props) {
    super(props);
    this.mapValuesInternationalOperations = this.mapValuesInternationalOperations.bind(this);
  }

  mapValuesInternationalOperations(entity, idx) {
    return <tr key={idx}>
      <td>{_.isEqual(entity.typeOperation, IMPORT) ? "Importación" : "Exportación"}</td>
      <td>{entity.nameCountry}</td>
      <td style={{ textAlign: 'center' }}>{entity.participation} %</td>
      <td>{entity.customerCoverage ? "Si" : "No"}</td>
      <td>{shorterStringValue(entity.descriptionCoverage, 80)}</td>
    </tr>
  }

  render() {
    const { infoClient } = this.props;
    const { contextClient } = infoClient;
    var operationsForeignCurrency = '';
    if (_.isEqual(infoClient.operationsForeignCurrency, YES)) {
      operationsForeignCurrency = 'Si'
    } else {
      if (_.isEqual(infoClient.operationsForeignCurrency, NO)) {
        operationsForeignCurrency = 'No'
      }
    }
    return (
      <div className="tab-content-row">
        <Row>
          <Col xs={4} md={4} lg={4} style={{ paddingRight: "20px" }}>
            <span style={{ fontWeight: "bold", color: "#4C5360" }}>¿Realiza operaciones en moneda extranjera?</span>
          </Col>
          <Col xs={8} md={8} lg={8} style={{ paddingRight: "20px" }}>
            <span style={{ fontWeight: "bold", color: "#4C5360" }}>¿Cuál(es) de las siguientes operaciones realiza en moneda extranjera? </span>
          </Col>
        </Row>
        <Row>
          <Col xs={4} md={4} lg={4} style={{ paddingRight: "20px" }}>
            <span style={{ width: "25%", verticalAlign: "initial" }}>{operationsForeignCurrency}</span>
          </Col>
          <Col xs={8} md={8} lg={8} style={{ paddingRight: "20px" }}>
            <span style={{ width: "25%", verticalAlign: "initial" }}>{infoClient.operationsForeignsKeys}</span>
          </Col>
        </Row>
        <Row style={{ paddingTop: "10px" }}>
          <Col xs={8} md={8} lg={8} style={{ paddingRight: "20px" }}>
            <span style={{ fontWeight: "bold", color: "#4C5360" }}>¿Cuál?</span>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8} lg={8} style={{ paddingRight: "20px" }}>
            <span style={{ width: "25%", verticalAlign: "initial" }}>{infoClient.otherOperationsForeign}</span>
          </Col>
        </Row>
        {
          _.isEqual(infoClient.operationsForeignCurrency, YES) &&
          <Row style={{ marginTop: '20px', marginLeft: '2px' }}>
            <h3 style={{ width: '100%' }}>Líneas de negocio y participación en ventas</h3>
            {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.listMainCompetitor ?
              <span>No aplica</span>
              :
              <div style={{ width: '100%' }}>
                {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listOperations) > 0 &&
                  <table className='table table-striped' style={{ width: "100%" }}>
                    <tr>
                      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Tipo de operación</span></td>
                      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>País</span></td>
                      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
                      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>¿El cliente tiene coberturas?</span></td>
                      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Descripción de la cobertura</span></td>
                    </tr>
                    <tbody>
                      {contextClient.listOperations.map(this.mapValuesInternationalOperations)}
                    </tbody>
                  </table>
                }
              </div>
            }
          </Row>
        }
      </div>
    );
  }
}

InternationalOperations.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default InternationalOperations;
