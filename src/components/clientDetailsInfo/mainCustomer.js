import React, { Component, PropTypes } from 'react';
import { Row } from 'react-flexbox-grid';
import { shorterStringValue } from '../../actionsGlobal';
import _ from 'lodash';

class MainCustomer extends Component {
    constructor(props) {
        super(props);
        this.mapValuesMainCustomer = this.mapValuesMainCustomer.bind(this);
    }

    mapValuesMainCustomer(entity, idx) {
        return <tr key={idx}>
            <td>{entity.nameClient}</td>
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
                    {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.listMainCustomer ?
                        <span style={{marginLeft: '12px'}}>No aplica</span>
                        :
                        <div style={{width: '100%'}}>
                            {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listMainCustomer) > 0 &&
                                <table className='table table-striped' style={{ width: "100%" }}>
                                    <tr>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Nombre del cliente</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Plazo (días)</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Información relevante</span></td>
                                    </tr>
                                    <tbody>
                                        {contextClient.listMainCustomer.map(this.mapValuesMainCustomer)}
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

MainCustomer.PropTypes = {
    infoClient: PropTypes.object.isRequired
}

export default MainCustomer;