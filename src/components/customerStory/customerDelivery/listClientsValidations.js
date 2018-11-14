import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../globalComponents/actions';
import ButtonOpenHistoricalClient from './buttonOpenHistoricalClient';
import ButtonOpenMainClients from './buttonSaveListMainClients';
import ButtonOpenMainSuppliers from './buttonSaveListMainSuppliers';

class ListClientsValidations extends Component {
    constructor(props) {
        super(props);
        this._mapValuesDeliveryClients = this._mapValuesDeliveryClients.bind(this);
    }

    _mapValuesDeliveryClients(deliveryClient, idx) {
        const { allowAccessContextClient } = this.props;
        return <tr key={idx}>
            <td>{deliveryClient.clientNumber}</td>
            <td>{deliveryClient.nameClient}</td>
            <td>{deliveryClient.team}</td>
            <td className="collapsing" style={{ textAlign: 'center' }}>
                <ButtonOpenHistoricalClient deliveryComplete={deliveryClient.deliveryComplete} idClient={deliveryClient.idClient} />
            </td>
            <td className="collapsing" style={{ textAlign: 'center' }}>
                {deliveryClient.updateClient ?
                    <i className="green checkmark icon" title="Cliente actualizado" style={{ cursor: "pointer" }} />
                    :
                    <i className="red remove icon" title="El cliente no se encuentra actualizado" style={{ cursor: "pointer" }} />
                }
            </td>
            {allowAccessContextClient && <td className="collapsing" style={{ textAlign: 'center' }}>
                <ButtonOpenMainClients mainClientsComplete={deliveryClient.mainClientsComplete} idClient={deliveryClient.idClient} />
            </td>}
            {allowAccessContextClient &&
                <td className="collapsing" style={{ textAlign: 'center' }}>
                    <ButtonOpenMainSuppliers mainSuppliersComplete={deliveryClient.mainSuppliersComplete} idClient={deliveryClient.idClient} />
                </td>
            }
        </tr>
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

    }, dispatch);
}

function mapStateToProps({ customerStory }, ownerProps) {
    return {
        customerStory
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsValidations);