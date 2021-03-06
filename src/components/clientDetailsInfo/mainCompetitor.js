import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { shorterStringValue } from '../../actionsGlobal';
import _ from 'lodash';

class MainCompetitor extends Component {
    constructor(props) {
        super(props);
        this.mapValuesMainCompetitor = this.mapValuesMainCompetitor.bind(this);
    }

    mapValuesMainCompetitor(entity, idx) {
        return <tr key={idx}>
            <td>{entity.nameCompetitor}</td>
            <td>{entity.participation} %</td>
            <td>{shorterStringValue(entity.observations, 130)}</td>
        </tr>
    }

    render() {
        const { infoClient } = this.props;
        const { contextClient } = infoClient;
        return (
            <div>
                <Row>
                    {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.noAppliedMainCompetitors ?
                        <span style={{ marginLeft: '12px' }}>No aplica</span>
                        :
                        <div style={{width: '100%'}}>
                            {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listMainCompetitor) > 0 ?
                                <table className='table table-striped' style={{ width: "100%" }}>
                                    <tr>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Nombre del competidor</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
                                        <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Observaciones</span></td>
                                    </tr>
                                    <tbody>
                                        {contextClient.listMainCompetitor.map(this.mapValuesMainCompetitor)}
                                    </tbody>
                                </table>
                                :
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                        <span className="form-item">No se han adicionado principales competidores</span>
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

MainCompetitor.PropTypes = {
    infoClient: PropTypes.object.isRequired
}

export default MainCompetitor;