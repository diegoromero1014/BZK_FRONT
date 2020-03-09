import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';

import ComboBox from '../../ui/comboBox/comboBoxComponent';
import StructuredDelivery from './structuredDelivery/componentStructuredDelivery';
import ComponentCustomerDelivery from './customerDelivery/componentCustomerDelivery';
import SecurityMessageComponent from './../globalComponents/securityMessageComponent';

import { updateTabSeletedCS, aproveRejectDeliveryClient } from './actions';
import { validateResponse } from '../../actionsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { consultInfoClient } from '../clientInformation/actions';
import { redirectUrl } from '../globalComponents/actions';
import { changeStateSaveData } from '../main/actions';

import { TAB_STORY, TAB_CUSTOMER_DELIVERY } from './constants';
import { VALUES_APROVE, OPTION_REQUIRED, MESSAGE_SAVE_DATA, ENTREGA_ESTRUCTURADA } from '../../constantsGlobal';

import _ from 'lodash';
import moment from 'moment';

class ComponentCustomerStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewStory: true,
            viewCustomerDelivery: false,
            valueAprove: null,
            errorAprove: false
        };
        this._handleSubmitChangeTeam = this._handleSubmitChangeTeam.bind(this);
        this._changeValueComboAprove = this._changeValueComboAprove.bind(this);
    }

    _handleItemClick(module) {
        const { updateTabSeletedCS } = this.props;
        updateTabSeletedCS(module);
    }

    _handleSubmitChangeTeam() {
        const { valueAprove } = this.state;
        if (_.isUndefined(valueAprove) || _.isNull(valueAprove) || _.isEmpty(valueAprove)) {
            this.setState({ errorAprove: OPTION_REQUIRED });
        } else {
            const { aproveRejectDeliveryClient, swtShowMessage, consultInfoClient, changeStateSaveData } = this.props;

            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            aproveRejectDeliveryClient(window.sessionStorage.getItem('idClientSelected'), valueAprove).then((data) => {
                if (validateResponse(data)) {
                    if (_.isEqual(valueAprove, true) || _.isEqual(valueAprove, 'true')) {
                        consultInfoClient();
                        swtShowMessage('success', 'Entrega de clientes', 'Señor usuario, el cambio de célula del cliente se realizó de forma exitosa.');
                    } else {
                        window.sessionStorage.setItem('idClientSelected', null);
                        swtShowMessage('success', 'Entrega de clientes', 'Señor usuario, el cambio de célula del cliente se rechazó de forma exitosa.');
                        redirectUrl("/dashboard/clients");
                    }
                    changeStateSaveData(false, "");
                } else {
                    swtShowMessage('error', 'Error validando clientes', 'Señor usuario, ocurrió un error validando los clientes.');
                }
            });
        }
    }

    _changeValueComboAprove(val) {
        this.setState({
            valueAprove: val,
            errorAprove: false
        });

    }

    render() {
        const { clientInformacion, customerStory, infoClient, reducerGlobal } = this.props;
        const { deliveryClient, nameUserUpdateDelivery, dateUpdateDelivery, reasonTransferClient,
            expectedCelulaId, expectedCelulaName } = clientInformacion.get("responseClientInfo");
        var tabActive = customerStory.get('tabSelected');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            tabActive = TAB_STORY;
        }
        const date = moment(dateUpdateDelivery);

        
        

        const dateString = date.format("DD") + " " + date.format("MMM") + " " + date.format("YYYY");
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
                {!_.isNull(expectedCelulaId) && !_.isUndefined(expectedCelulaId) &&
                    <Row>
                        {_.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), ENTREGA_ESTRUCTURADA), false) &&
                            <Col xs={12} md={12} lg={5}>
                                <table>
                                    <tbody>
                                        <tr><td><span style={{ fontWeight: "bold", color: "#EB984E" }}>Cliente pendiente de aprobación para la célula {expectedCelulaName}</span></td></tr>
                                        <tr><td><span style={{ fontWeight: "bold", color: "#818282" }}>Gestionó: <span style={{ fontWeight: "normal", color: "#818282" }}> {nameUserUpdateDelivery} - {dateString} </span></span></td></tr>
                                        <tr><td><span style={{ fontWeight: "bold", color: "#818282" }}>Motivo: <span style={{ fontWeight: "normal", color: "#818282" }}> {reasonTransferClient} </span></span></td></tr>
                                    </tbody>
                                </table>
                            </Col>
                        }
                        {deliveryClient &&
                            <Col xs={12} md={4} lg={3} >
                                <dt><span>Entrega estructurada </span></dt>
                                <dt>
                                    <ComboBox
                                        name="structuredDelivery"
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={VALUES_APROVE}
                                        value={this.state.valueAprove}
                                        error={this.state.errorAprove}
                                        onChange={(val) => this._changeValueComboAprove(val)}
                                        touched={true}
                                    />
                                </dt>
                            </Col>
                        }
                        {deliveryClient &&
                            <Col xs={12} md={3} lg={2} style={{ paddingTop: '20px' }}>
                                <button className="btn btn-primary" type="button" onClick={this._handleSubmitChangeTeam}
                                    style={{ float: 'right', cursor: 'pointer', marginRight: '10px' }}>
                                    Guardar respuesta
                                </button>
                            </Col>
                        }
                    </Row>
                }
                <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginBottom: "70px" }}>
                    <SecurityMessageComponent />
                    <Menu pointing secondary>
                        <Menu.Item name="Historial" active={tabActive === TAB_STORY} onClick={this._handleItemClick.bind(this, TAB_STORY)} />
                        {_.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), ENTREGA_ESTRUCTURADA), false) &&
                            <Menu.Item name="Entrega clientes" active={tabActive === TAB_CUSTOMER_DELIVERY} onClick={this._handleItemClick.bind(this, TAB_CUSTOMER_DELIVERY)} />
                        }
                    </Menu>
                    <Segment>
                        {tabActive === TAB_STORY && <StructuredDelivery />}
                        {tabActive === TAB_CUSTOMER_DELIVERY && <ComponentCustomerDelivery />}
                    </Segment>
                </div>
            </div >
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTabSeletedCS,
        aproveRejectDeliveryClient,
        swtShowMessage,
        consultInfoClient,
        changeStateSaveData
    }, dispatch);
}

function mapStateToProps({ navBar, customerStory, clientInformacion, reducerGlobal }, ownerProps) {
    return {
        navBar,
        customerStory,
        clientInformacion,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentCustomerStory);