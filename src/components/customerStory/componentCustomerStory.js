import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { TAB_STORY, TAB_CUSTOMER_DELIVERY } from './constants';
import { updateTabSeletedCS, aproveRejectDeliveryClient } from './actions';
import { VALUES_APROVE, OPTION_REQUIRED, MESSAGE_SAVE_DATA } from '../../constantsGlobal';
import { validateResponse } from '../../actionsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import ComponentCustomerDelivery from './customerDelivery/componentCustomerDelivery';
import { consultInfoClient } from '../clientInformation/actions';
import { redirectUrl } from '../globalComponents/actions';
import { changeStateSaveData } from '../dashboard/actions';
import _ from 'lodash';

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
            aproveRejectDeliveryClient(window.localStorage.getItem('idClientSelected'), valueAprove).then((data) => {
                if (validateResponse(data)) {
                    if ( _.isEqual(valueAprove, true) || _.isEqual(valueAprove, 'true') ) {
                        consultInfoClient();
                        swtShowMessage('success', 'Entrega de clientes', 'Señor usuario, el cambio de célula del cliente se realizó de forma exitosa.');
                    } else {
                        window.localStorage.setItem('idClientSelected', null);
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

    _changeValueComboAprove( val ){
        console.log('valueAprove', val);
        this.setState({
            valueAprove: val,
            errorAprove: false
        });

    }

    render() {
        const { clientInformacion, customerStory, infoClient } = this.props;
        const { deliveryClient, expectedCelulaId, expectedCelulaName } = clientInformacion.get("responseClientInfo");
        var tabActive = customerStory.get('tabSelected');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            tabActive = TAB_STORY;
        }
        return (
            <div>
                {!_.isNull(expectedCelulaId) && !_.isUndefined(expectedCelulaId) &&
                    <Row style={{ marginTop: '9px', paddingTop: '15px' }}>
                        <Col xs={12} md={12} lg={5} style={{ paddingTop: '20px' }}>
                            <span style={{ fontWeight: 'bold', color: '#EB984E' }}>Cliente pendiente de aprobación para la célula {expectedCelulaName}</span>
                        </Col>
                        {deliveryClient &&
                            <Col xs={12} md={4} lg={3} >
                                <dt><span>Entrega estructura </span></dt>
                                <dt>
                                    <ComboBox
                                        name="structuredDelivery"
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={VALUES_APROVE}
                                        value={this.state.valueAprove}
                                        error={this.state.errorAprove}
                                        onChange={ (val) => this._changeValueComboAprove(val) }
                                        onBlur= {() => console.log()}
                                        touched={true}
                                    />
                                </dt>
                            </Col>
                        }
                        {deliveryClient &&
                            <Col xs={12} md={3} lg={2} style={{ paddingTop: '20px' }}>
                                <button className="btn btn-primary" type="button" onClick={this._handleSubmitChangeTeam}
                                    style={{ float: 'right', cursor: 'pointer', marginRight: '10px' }}>
                                    Realizar cambio
                                </button>
                            </Col>
                        }
                    </Row>
                }
                <div className="tab-pane quickZoomIn animated"
                    style={{ width: "100%", marginTop: "10px", marginBottom: "70px" }}>
                    <Menu pointing secondary>
                        <Menu.Item name="Historial" active={tabActive === TAB_STORY} onClick={this._handleItemClick.bind(this, TAB_STORY)} />
                        <Menu.Item name="Entrega clientes" active={tabActive === TAB_CUSTOMER_DELIVERY} onClick={this._handleItemClick.bind(this, TAB_CUSTOMER_DELIVERY)} />
                    </Menu>
                    <Segment>
                        {tabActive === TAB_STORY && <span>Holaaaaaaaaaa 1</span>}
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

function mapStateToProps({ navBar, customerStory, clientInformacion }, ownerProps) {
    return {
        navBar,
        customerStory,
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentCustomerStory);