import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import { shorterStringValue } from '../../actionsGlobal';
import { YES, NO } from '../../constantsGlobal';
import { IMPORT, EXPORT } from './constants';
import { validateValueExist } from '../../actionsGlobal';

class InternationalOperations extends Component {

  constructor(props) {
    super(props);
    this.mapHeadersInternationalOperations = this.mapHeadersInternationalOperations.bind(this);
    this.mapValuesInternationalOperations = this.mapValuesInternationalOperations.bind(this);
    this.mapOperations = this.mapOperations.bind(this);
  }

  mapValuesInternationalOperations(entity, idx) {
    return <tr key={idx}>
      <td>{entity.nameCountry}</td>
      <td>{entity.participation} %</td>
    </tr>
  }

  mapHeadersInternationalOperations(idx) {
    return <tr key={idx}>
      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>País</span></td>
      <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
    </tr>
  }

  mapOperations(operations, idx) {
    const title = _.isEqual(operations.typeOperation, IMPORT) ? "Importación" : "Exportación";
    return <Row style={{marginTop: '20px'}}>
      <Col xs={12} md={6} lg={3}><span style={{ fontWeight: "bold", color: "#4C5360" }}>{title}:</span> {operations.participation}%</Col>
      <Col xs={12} md={6} lg={3}><span style={{ fontWeight: "bold", color: "#4C5360" }}>¿El cliente tiene coberturas?</span> {_.isEqual(operations.customerCoverage, true) ? "Si" : "No"}</Col>
      <Col xs={12} md={12} lg={12}><span style={{ fontWeight: "bold", color: "#4C5360" }}>Descripción de la copbertura: </span>{operations.descriptionCoverage}</Col>
      {_.size(operations.listCountryOperations) > 0 &&
        <table className='table table-striped' style={{ width: '100%', marginTop: '10px' }}>
          {this.mapHeadersInternationalOperations()}
          <tbody>
            {operations.listCountryOperations.map(this.mapValuesInternationalOperations)}
          </tbody>
        </table>
      }
    </Row>
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
    const listImports = _.isUndefined(contextClient) || _.isNull(contextClient) ? [] : _.filter(contextClient.listOperations, ['typeOperation', IMPORT]);
    const listExports = _.isUndefined(contextClient) || _.isNull(contextClient) ? [] : _.filter(contextClient.listOperations, ['typeOperation', EXPORT]);
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
        {_.isEqual(infoClient.operationsForeignCurrency, YES) &&
          <Row style={{ marginTop: '20px', marginLeft: '2px' }}>
            <h3 style={{ width: '100%', marginBottom: '0px'}}>Operaciones internacionales</h3>
            {validateValueExist(contextClient) && contextClient.noAppliedIntOperations ?
              <span>No aplica</span>
              :
              <div style={{ width: '100%' }}>
                <Col xs={12} md={12} lg={12} >
                  {validateValueExist(contextClient) && _.size(listImports) > 0 &&
                    listImports.map(this.mapOperations)
                  }
                </Col>
                <Col xs={12} md={12} lg={12} style={{marginTop: '20px'}}>
                  {validateValueExist(contextClient) && _.size(listExports) > 0 &&
                    listExports.map(this.mapOperations)
                  }
                </Col>
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
