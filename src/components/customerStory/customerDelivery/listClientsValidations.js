import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../globalComponents/actions';

class ListClientsValidations extends Component {
    constructor(props) {
        super(props);
        this._mapValuesDeliveryClients = this._mapValuesDeliveryClients.bind(this);
        this._openModalHistoryClient = this._openModalHistoryClient.bind(this);
    }

    _openModalHistoryClient(){
        console.log("Abrir modal de historial del cliente");
    }

    _mapValuesDeliveryClients(deliveryClient, idx) {
        return <tr key={idx}>
            <td>{deliveryClient.clientNumber}</td>
            <td>{deliveryClient.nameClient}</td>
            <td>{deliveryClient.team}</td>
            <td className="collapsing" style={{ textAlign: 'center' }}>
                {deliveryClient.deliveryComplete ?
                    <i className="green checkmark icon" title="Historial del cliente completo" 
                        style={{ cursor: "pointer" }} onClick={this._openModalHistoryClient} />
                    :
                    <i className="red remove icon" title="El historial del cliente está incompleto" 
                        style={{ cursor: "pointer" }} onClick={this._openModalHistoryClient} />
                }
            </td>
            <td className="collapsing" style={{ textAlign: 'center' }}>
                {deliveryClient.updateClient ?
                    <i className="green checkmark icon" title="Cliente actualizado" style={{ cursor: "pointer" }} />
                    :
                    <i className="red remove icon" title="El cliente no se encuentra actualizado" style={{ cursor: "pointer" }} />
                }
            </td>
        </tr>
    }

    render() {
        const { customerStory } = this.props;
        return (
            <div className="tab-content break-word" style={{ borderRadius: '3px', overflow: 'initial', position: 'initial' }}>
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