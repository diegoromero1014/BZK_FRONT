import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col } from 'react-flexbox-grid';
import ButtonOpenHistoricalClient from './buttonOpenHistoricalClient';
import ButtonOpenMainClients from './buttonSaveListMainClients';
import ButtonOpenMainSuppliers from './buttonSaveListMainSuppliers';
import Tooltip from '../../globalComponents/ToolTip';
import { consultParameterServer } from '../../../actionsGlobal';
import { CLIENT_STATUS, MANAGEMENT_BRAND } from '../structuredDelivery/constants';

class ListClientsValidations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statusClient: "",
            managementBrand: ""
        }
        this._mapValuesDeliveryClients = this._mapValuesDeliveryClients.bind(this);
    }

    componentWillMount() {
        const { consultParameterServer } = this.props;

        consultParameterServer(CLIENT_STATUS).then(resolve => {
            if (resolve && resolve.payload && resolve.payload.data) {
                debugger;    
            }
        });
    }


    _mapValuesDeliveryClients(deliveryClient, idx) {
        const { allowAccessContextClient } = this.props;


        const state = {
            stateClient: [
                { message: 'Nit principal', isFulfilled: deliveryClient.mainNit },
                { message: 'Centro de decisión', isFulfilled: deliveryClient.decisionCenter },
                { message: 'Activo', isFulfilled: deliveryClient.clientStatus === "Activo" ? true : false },
                { message: 'Gerenciamiento Continuo', isFulfilled: deliveryClient.managementBrand === "Gerenciamiento Continuo" ? true : false },
            ],

            stateClient2: [
                { message: 'Nit principal', isFulfilled: deliveryClient.mainNit },
                { message: 'Centro de decisión', isFulfilled: deliveryClient.decisionCenter },
            ]
        }

        return (

            <tr key={idx}>
                <td>{deliveryClient.clientNumber}</td>
                <td>{deliveryClient.nameClient}</td>
                <td>{deliveryClient.team}</td>
                <Tooltip options={state.stateClient2}>
                    <td className="collapsing" style={{ textAlign: 'center' }}>
                        <ButtonOpenHistoricalClient deliveryComplete={deliveryClient.deliveryComplete} idClient={deliveryClient.idClient} delivery={deliveryClient} />
                    </td>
                </Tooltip>
                <Tooltip options={state.stateClient}>
                    <td className="collapsing" style={{ textAlign: 'center' }}>
                        {this.renderIcon(deliveryClient)}
                    </td>
                </Tooltip>

                {allowAccessContextClient &&
                    <Tooltip options={state.stateClient2}>
                        <td className="collapsing" style={{ textAlign: 'center' }}>
                            <ButtonOpenMainClients mainClientsComplete={deliveryClient.mainClientsComplete} idClient={deliveryClient.idClient} delivery={deliveryClient} />
                        </td>
                    </Tooltip>
                }
                {allowAccessContextClient &&
                    <Tooltip options={state.stateClient2}>
                        <td className="collapsing" style={{ textAlign: 'center' }}>
                            <ButtonOpenMainSuppliers mainSuppliersComplete={deliveryClient.mainSuppliersComplete} idClient={deliveryClient.idClient} delivery={deliveryClient} />
                        </td>
                    </Tooltip>
                }
            </tr>

        )
    }

    renderIcon = deliveryClient => {
        const { mainNit, decisionCenter, clientStatus, managementBrand, updateClient } = deliveryClient;

        if (updateClient) {
            return (
                <i
                    className="green checkmark icon"
                    title="Cliente actualizado"
                    style={{ cursor: "pointer" }}
                />
            );
        } else {
            if (!mainNit && !decisionCenter && !(clientStatus === "Activo") && !(managementBrand === "Gerenciamiento Continuo")) {
                return (
                    <i
                        className="yellow warning icon"
                        title="El cliente no se encuentra actualizado"
                        style={{ cursor: "pointer" }}
                    />
                );
            } else {
                return (
                    <i
                        className="red remove icon"
                        title="El cliente no se encuentra actualizado"
                        style={{ cursor: "pointer" }}
                    />
                );
            }
        }
    }

    render() {
        const { customerStory, allowAccessContextClient } = this.props;
        return (
            <div className="tab-content break-word" style={{ borderRadius: '3px', overflow: 'initial', position: 'initial', zIndex: "9" }}>
                {customerStory.get('listClientsDelivery').length > 0 ?
                    <div style={{ marginTop: '20px' }}>
                        <Col xs={12} md={12} lg={12}>
                            <table className="ui striped table">
                                <thead>
                                    <tr>
                                        <th>Documento</th>
                                        <th>Razón social</th>
                                        <th>Célula</th>
                                        <th>Historial</th>
                                        <th>Actualización</th>
                                        {allowAccessContextClient && <th style={{ textAlign: 'center' }}>Principales clientes</th>}
                                        {allowAccessContextClient && <th style={{ textAlign: 'center' }}>Principales proveedores</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerStory.get('listClientsDelivery').map(this._mapValuesDeliveryClients)}
                                </tbody>
                            </table>
                        </Col>
                    </div>
                    :
                    <div>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <span className="form-item">No hay clientes para entregar</span>
                            </div>
                        </Col>
                    </div>
                }
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultParameterServer
    }, dispatch);
}

function mapStateToProps({ customerStory }, ownerProps) {
    return {
        customerStory
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsValidations);