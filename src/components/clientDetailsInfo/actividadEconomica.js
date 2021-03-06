import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';
import { INFO_ESTUDIO_CREDITO } from '../../constantsGlobal';

class ActividadEconomica extends Component {

    constructor(props) {
        super(props);
        this._mapValuesParticipation = this._mapValuesParticipation.bind(this);
        this._mapValuesDistribution = this._mapValuesDistribution.bind(this);
    }

    _mapValuesParticipation(entity, idx) {
        return <tr key={idx}>
            <td>{entity.lineOfBusiness}</td>
            <td>{entity.participation} %</td>
            <td>{entity.experience}</td>
            <td>{entity.contribution != null ? entity.contribution + "%" : ""}</td>
        </tr>
    }

    _mapValuesDistribution(entity, idx) {
        return <tr key={idx}>
            <td>{entity.distributionChannel}</td>
            <td>{entity.participation} %</td>
            <td>{entity.contribution != null ? entity.contribution + "%" : ""}</td>
        </tr>
    }

    render() {
        const { infoClient, reducerGlobal } = this.props;
        const { contextClient } = infoClient;

        const allowAccessContextClient = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), INFO_ESTUDIO_CREDITO), false);

        return (
            <div>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>CIIU</span></th>
                            <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Descripción CIIU</span></th>
                            <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Sector</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ width: "20%", verticalAlign: "initial" }}>{infoClient.ciiu}</td>
                            <td style={{ width: "40%", verticalAlign: "initial" }}>{infoClient.ciiuDescription}</td>
                            <td style={{ width: "20%", verticalAlign: "initial" }}>{infoClient.sector}</td>
                        </tr>
                    </tbody>
                </table>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>SubCIIU</span></th>
                            <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Subsector</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ width: "40%", verticalAlign: "initial" }}>{infoClient.subCiiuKey}</td>
                            <td style={{ width: "40%", verticalAlign: "initial" }}>{infoClient.subSector}</td>
                        </tr>
                    </tbody>
                </table>                
                <Row style={{ marginTop: '15px' }}>
                    <Col xs={12} md={12} lg={12}>
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Naturaleza Tributaria</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Tipología del cliente</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Gerencias de estrategia sectorial</span></th>
                                    <th><span style={{ fontWeight: "bold", color: "#4C5360" }}></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ width: "20%", verticalAlign: "initial" }}>{infoClient.taxNatureKey}</td>
                                    <td style={{ width: "20%", verticalAlign: "initial" }}>{infoClient.valueCustomerTypology}</td>
                                    <td style={{ width: "20%", verticalAlign: "initial" }}>{infoClient.strSectorStrategy}</td>
                                    <td style={{ width: "20%", verticalAlign: "initial" }}></td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>

                {allowAccessContextClient &&

                    <Row>
                        <Col xs={12} md={12} lg={12} style={{ textAlign: 'justify', marginTop: '15px' }}>
                            <dt><span style={{ fontWeight: "bold", color: "#4C5360" }}>Contexto</span></dt>
                            {_.isNull(contextClient) || _.isUndefined(contextClient) ? "" : contextClient.context}
                        </Col>
                    </Row>
                }

                {allowAccessContextClient &&
                    <Row style={{ marginTop: '20px', marginLeft: '1px' }}>
                        <h3 style={{ width: '100%' }}>Líneas de negocio y participación en ventas</h3>
                        {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.noAppliedLineOfBusiness ?
                            <span>No aplica</span>
                            :
                            <div style={{ width: '100%' }}>
                                {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listParticipation) > 0 ?
                                    <table className='table table-striped' style={{ width: "100%" }}>
                                        <tr>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Línea de negocio</span></td>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Experiencia (años)</span></td>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Contribución</span></td>
                                        </tr>
                                        <tbody>
                                            {contextClient.listParticipation.map(this._mapValuesParticipation)}
                                        </tbody>
                                    </table>
                                    :
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                            <span className="form-item">No se han adicionado líneas de negocio</span>
                                        </div>
                                    </Col>
                                }
                            </div>
                        }
                    </Row>
                }
                {
                    allowAccessContextClient &&
                    <Row style={{ marginTop: '20px', marginLeft: '1px' }}>
                        <h3 style={{ width: '100%' }}>Canales de distribución y participación en ventas</h3>
                        {!_.isNull(contextClient) && !_.isUndefined(contextClient) && contextClient.noAppliedDistributionChannel ?
                            <span>No aplica</span>
                            :
                            <div style={{ width: '100%' }}>
                                {!_.isNull(contextClient) && !_.isUndefined(contextClient) && _.size(contextClient.listDistribution) > 0 ?
                                    <table className='table table-striped' style={{ width: "100%" }}>
                                        <tr>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Canal de distribución</span></td>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Participación</span></td>
                                            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Contribución</span></td>
                                        </tr>
                                        <tbody>
                                            {contextClient.listDistribution.map(this._mapValuesDistribution)}
                                        </tbody>
                                    </table>
                                    :
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                            <span className="form-item">No se han adicionado canales de distribución</span>
                                        </div>
                                    </Col>
                                }
                            </div>
                        }
                    </Row>
                }

            </div>
        );
    }
}

ActividadEconomica.PropTypes = {
    infoClient: PropTypes.object.isRequired,
    reducerGlobal: PropTypes.object.isRequired
}

export default ActividadEconomica;
