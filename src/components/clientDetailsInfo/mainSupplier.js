import React, { Component, PropTypes } from 'react';
import { Row } from 'react-flexbox-grid';
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
                    {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.listMainSupplier ?
                        <span style={{ marginLeft: '12px' }}>No aplica</span>
                        :
                        <div style={{width: '100%'}}>
                            {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listMainSupplier) > 0 &&
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