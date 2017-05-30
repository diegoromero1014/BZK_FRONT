import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { shorterStringValue } from '../../actionsGlobal';
import _ from 'lodash';

class MainSupplier extends Component {
    constructor(props) {
        super(props);
        this.mapValuesMainSupplier = this.mapValuesMainSupplier.bind(this);
    }

    mapValuesMainSupplier(entity, idx) {
        return <tr key={idx}>
            <td>{entity.nameSupplier}</td>
            <td style={{ textAlign: 'center' }}>{entity.participation} %</td>
            <td style={{ textAlign: 'center' }}>{entity.term}</td>
            <td>{shorterStringValue(entity.relevantInformation, 85)}</td>
        </tr>
    }

    render() {
        const { infoClient } = this.props;
        const { contextClient } = infoClient;
        return (
            <div>
                <Row>
                    {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.noAppliedMainSuppliers ?
                        <span style={{ marginLeft: '12px' }}>No aplica</span>
                        :
                        <div style={{width: '100%'}}>
                            {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listMainSupplier) > 0 ?
                                <table className='table table-striped' style={{ width: "100%" }}>
                                    <tr>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Nombre del proveedor</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Plazo (días)</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Información relevante</span></td>
                                    </tr>
                                    <tbody>
                                        {contextClient.listMainSupplier.map(this.mapValuesMainSupplier)}
                                    </tbody>
                                </table>
                                :
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                        <span className="form-item">No se han adicionado principales proveedores</span>
                                    </div>
                                </Col>
                            }
                        </div>
                    }
                </Row>
            </div>
        );
    }
}

MainSupplier.PropTypes = {
    infoClient: PropTypes.object.isRequired
}

export default MainSupplier;