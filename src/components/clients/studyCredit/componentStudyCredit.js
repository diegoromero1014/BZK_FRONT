import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { updateTitleNavBar } from '../../navBar/actions';
import { redirectUrl } from '../../globalComponents/actions';
import SweetAlert from 'sweetalert-react';
import { LINE_OF_BUSINESS, DISTRIBUTION_CHANNEL, MAIN_CLIENTS } from '../../contextClient/constants';
import ClientTypology from '../../contextClient/ClientTypology';
import ContextEconomicActivity from '../../contextClient/contextEconomicActivity';
import ComponentListLineBusiness from '../../contextClient/listLineOfBusiness/componentListLineBusiness';
import ComponentListDistributionChannel from '../../contextClient/listDistributionChannel/componentListDistributionChannel';
import InventorPolicy from '../../contextClient/inventoryPolicy';
import ComponentListMainClients from '../../contextClient/listMainClients/componentListMainClients';
import * as constantsSelects from '../../selectsComponent/constants';
import { consultListWithParameterUbication, getMasterDataFields } from '../../selectsComponent/actions';
import { ORIGIN_STUDY_CREDIT } from '../../contextClient/constants';
import { getContextClient } from './actions';
import { validateResponse } from '../../../actionsGlobal';
import {
    MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_SAVE_DATA
} from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../dashboard/actions';
import { GOVERNMENT } from '../../clientEdit/constants';

const fields = ["customerTypology", "contextClient", "inventoryPolicy"];

class ComponentStudyCredit extends Component {
    constructor(props) {
        super(props);
        this._closeWindow = this._closeWindow.bind(this);
        this._onConfirmExit = this._onConfirmExit.bind(this);
        this.showFormOut = this.showFormOut.bind(this);
        this._handleChangeValueActivityEconomic = this._handleChangeValueActivityEconomic.bind(this);
        this._handleChangeValueInventoryPolicy = this._handleChangeValueInventoryPolicy.bind(this);
        this._handleChangeValueMainClients = this._handleChangeValueMainClients.bind(this);
        this.state = {
            showConfirmExit: false,
            showFormAddLineOfBusiness: false,
            showFormAddDistribution: false,
            showFormAddMainClient: false,
            valueCheckSectionActivityEconomic: false,
            valueCheckSectionInventoryPolicy: false,
            valueCheckSectionMainClients: false,
        }
    }

    _handleChangeValueActivityEconomic() {
        this.setState({
            valueCheckSectionActivityEconomic: !this.state.valueCheckSectionActivityEconomic
        });
    }

    _handleChangeValueInventoryPolicy() {
        this.setState({
            valueCheckSectionInventoryPolicy: !this.state.valueCheckSectionInventoryPolicy
        });
    }

    _handleChangeValueMainClients() {
        this.setState({
            valueCheckSectionMainClients: !this.state.valueCheckSectionMainClients
        });
    }

    showFormOut(property, value) {
        if (_.isEqual(LINE_OF_BUSINESS, property)) {
            this.setState({ showFormAddLineOfBusiness: value });
        } else if (_.isEqual(DISTRIBUTION_CHANNEL, property)) {
            this.setState({ showFormAddDistribution: value });
        } else if (_.isEqual(MAIN_CLIENTS, property)) {
            this.setState({ showFormAddMainClient: value });
        }
    }

    _closeWindow() {
        this.setState({
            showConfirmExit: true
        });
    }

    _onConfirmExit() {
        this.setState({
            showConfirmExit: false
        });
        const { updateTabSeleted } = this.props;
        redirectUrl("/dashboard/clientInformation");
    }

    componentWillMount() {
        const { fields: { customerTypology, contextClient, inventoryPolicy }, updateTitleNavBar, getContextClient, swtShowMessage, changeStateSaveData,
            clientInformacion, selectsReducer, consultListWithParameterUbication,
            getMasterDataFields } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        } else {
            var idClient = window.localStorage.getItem('idClientSelected');
            getMasterDataFields([constantsSelects.SEGMENTS]).then((data) => {
                const value = _.get(_.find(data.payload.data.messageBody.masterDataDetailEntries, ['id', parseInt(infoClient.segment)]), 'value');
                if (!_.isUndefined(value)) {
                    if (_.isEqual(GOVERNMENT, value)) {
                        consultListWithParameterUbication(constantsSelects.CUSTOMER_TYPOLOGY, idSegment).then((data) => {
                            customerTypology.onChange(infoClient.idCustomerTypology);
                        });;
                    } else {
                        getMasterDataFields([constantsSelects.CUSTOMER_TYPOLOGY], true).then((data) => {
                            customerTypology.onChange(infoClient.idCustomerTypology);
                        });;
                    }
                }
            }, (reason) => {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
            updateTitleNavBar("Informe estudio de crédito");
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            getContextClient(idClient).then((data) => {
                changeStateSaveData(false, "");
                if (!validateResponse(data)) {
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                } else {
                    console.log('data', data);
                    var contextClientInfo = data.payload.data.data;
                    contextClient.onChange(contextClientInfo.context);
                    inventoryPolicy.onChange(contextClientInfo.inventoryPolicy);
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
        }
    }

    render() {
        const { selectsReducer, fields: { customerTypology, contextClient, contextLineBusiness, participationLB, experience,
            distributionChannel, participationDC, inventoryPolicy, nameMainClient, participationMC, termMainClient,
            relevantInformationMainClient, studyCreditReducer
        } } = this.props;
        var contextClientInfo = studyCreditReducer.get('contextClient');
        var fechaModString = '';
        if (contextClientInfo.createdTimestamp !== null) {
            var fechaModDateMoment = moment(contextClientInfo.createdTimestamp, "x").locale('es');
            fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
        }
        return (
            <form style={{ backgroundColor: "#FFFFFF", paddingBottom: "70px" }}>
                <Row style={{ paddingTop: "10px", marginLeft: "20px" }}>
                    <ClientTypology customerTypology={customerTypology} data={selectsReducer.get(constantsSelects.CUSTOMER_TYPOLOGY)} />
                </Row>
                <Row style={{ padding: "20px 10px 0px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />

                            <i className="payment icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Actividad económica</span>
                        </div>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <input type="checkbox" id="checkSectionActivityEconomic"
                            checked={this.state.valueCheckSectionActivityEconomic}
                            onClick={this._handleChangeValueActivityEconomic} />
                        <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                    </Col>

                </Row>
                <ContextEconomicActivity contextClientField={contextClient} origin={ORIGIN_STUDY_CREDIT} />
                <ComponentListLineBusiness contextLineBusiness={contextLineBusiness}
                    participation={participationLB} experience={experience}
                    showFormLinebusiness={this.state.showFormAddLineOfBusiness} fnShowForm={this.showFormOut} />
                <ComponentListDistributionChannel distributionChannel={distributionChannel} participation={participationDC}
                    showFormDistribution={this.state.showFormAddDistribution} fnShowForm={this.showFormOut} />
                <InventorPolicy inventoryPolicy={inventoryPolicy} origin={ORIGIN_STUDY_CREDIT}
                    valueCheckSectionInventoryPolicy={this.state.valueCheckSectionInventoryPolicy}
                    functionChangeInventoryPolicy={this._handleChangeValueInventoryPolicy} />
                <ComponentListMainClients nameClient={nameMainClient} participation={participationMC}
                    term={termMainClient} relevantInformation={relevantInformationMainClient} origin={ORIGIN_STUDY_CREDIT}
                    showFormMainClients={this.state.showFormAddMainClient} fnShowForm={this.showFormOut}
                    valueCheckSectionMainClients={this.state.valueCheckSectionMainClients}
                    functionChangeCheckSectionMainClients={this._handleChangeValueMainClients} />
                <Row style={{ padding: "10px 10px 0px 20px" }}>
                    <Col xs={6} md={3} lg={3}>
                        {updatedBy !== null ?
                            <span style={{ fontWeight: "bold", color: "#818282" }}>Modificado por</span>
                            : ''}
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        {updatedBy !== null ?
                            <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de modificación</span>
                            : ''}
                    </Col>
                </Row>
                <Row style={{ padding: "5px 10px 0px 20px" }}>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{contextClientInfo.updatedBy}</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaModString}</span>
                    </Col>
                </Row>
                <div style={{
                    marginTop: "50px", position: "fixed",
                    border: "1px solid #C2C2C2", bottom: "0px", width: "100%", marginBottom: "0px",
                    backgroundColor: "#F8F8F8", height: "50px", background: "rgba(255,255,255,0.75)"
                }}>
                    <div style={{ width: "370px", height: "100%", position: "fixed", right: "0px" }}>
                        <button className="btn"
                            style={{ float: "right", margin: "8px 0px 0px 120px", position: "fixed" }}
                            onClick={this.clickButtonScrollTop} type="submit">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                        </button>
                        <button className="btn btn-secondary modal-button-edit" onClick={this._closeWindow} style={{
                            float: "right",
                            margin: "8px 0px 0px 240px",
                            position: "fixed",
                            backgroundColor: "#C1C1C1"
                        }} type="button">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </div>
                </div>
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmExit}
                    title="Confirmar salida"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text="Señor usuario, perderá los cambios que no haya guardado. ¿Está seguro que desea salir?"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmExit: false })}
                    onConfirm={() => this._onConfirmExit()} />
            </form>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        getContextClient,
        swtShowMessage,
        changeStateSaveData,
        consultListWithParameterUbication,
        getMasterDataFields,
        studyCreditReducer
    }, dispatch);
}

function mapStateToProps({ selectsReducer, clientInformacion, studyCreditReducer }, ownerProps) {
    return {
        selectsReducer,
        clientInformacion,
        studyCreditReducer
    };
}

export default reduxForm({
    form: 'formStudyCredit',
    fields
}, mapStateToProps, mapDispatchToProps)(ComponentStudyCredit);
