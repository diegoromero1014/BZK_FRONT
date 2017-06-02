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
import { getContextClient, saveCreditStudy, validateInfoCreditStudy } from './actions';
import { validateResponse } from '../../../actionsGlobal';
import {
    MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_SAVE_DATA
} from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../dashboard/actions';
import { GOVERNMENT } from '../../clientEdit/constants';
import moment from 'moment';
import {
    A_SHAREHOLDER_WITH_OBSERVATION, ALL_SHAREHOLDERS_WITH_COMMENTS,
    ERROR_MESSAGE_FOR_A_SHAREHOLDER_WITH_OBSERVATION, ERROR_MESSAGE_FOR_ALL_SHAREHOLDER_WITH_OBSERVATION
} from './constants';
import BottonShareholderAdmin from '../../clientDetailsInfo/bottonShareholderAdmin';

const fields = ["customerTypology", "contextClientField", "inventoryPolicy", "participationLB", "participationDC", "participationMC",
    "contextLineBusiness", "experience", "distributionChannel", "nameMainClient", "termMainClient", "relevantInformationMainClient"];

var errorMessageForShareholders = 'La información de los accionistas es válida, ';
var contextClientInfo, numberOfShareholders, infoValidate, showCheckValidateSection;
var showCheckValidateSection, overdueCreditStudy, fechaModString, errorShareholder;

class ComponentStudyCredit extends Component {
    constructor(props) {
        super(props);
        this._closeWindow = this._closeWindow.bind(this);
        this._onConfirmExit = this._onConfirmExit.bind(this);
        this.showFormOut = this.showFormOut.bind(this);
        this._handleChangeValueActivityEconomic = this._handleChangeValueActivityEconomic.bind(this);
        this._handleChangeValueInventoryPolicy = this._handleChangeValueInventoryPolicy.bind(this);
        this._handleChangeValueMainClients = this._handleChangeValueMainClients.bind(this);
        this._createJsonSaveContextClient = this._createJsonSaveContextClient.bind(this);
        this._submitSaveContextClient = this._submitSaveContextClient.bind(this);
        this._closeMessageSuccess = this._closeMessageSuccess.bind(this);
        this._validateInfoStudyCredit = this._validateInfoStudyCredit.bind(this);
        this.state = {
            showConfirmExit: false,
            showSuccessMessage: false,
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

    _createJsonSaveContextClient() {
        const { fields: { contextClientField, inventoryPolicy, customerTypology }, clientInformacion } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        const { contextClient } = infoClient;
        const listLineOfBusiness = clientInformacion.get('listParticipation');
        _.map(listLineOfBusiness, (item) => {
            item.id = item.id.toString().includes('line_') ? null : item.id;
            return item;
        });
        const listDistribution = clientInformacion.get('listDistribution');
        _.map(listDistribution, (item) => {
            item.id = item.id.toString().includes('dist_') ? null : item.id;
            return item;
        });
        const listMainCustomer = clientInformacion.get('listMainCustomer');
        _.map(listMainCustomer, (item) => {
            item.id = item.id.toString().includes('mainC_') ? null : item.id;
            return item;
        });
        const listMainSupplier = clientInformacion.get('listMainSupplier');
        _.map(listMainSupplier, (item) => {
            item.id = item.id.toString().includes('mainS_') ? null : item.id;
            return item;
        });
        const listMainCompetitor = clientInformacion.get('listMainCompetitor');
        _.map(listMainCompetitor, (item) => {
            item.id = item.id.toString().includes('mainCom_') ? null : item.id;
            return item;
        });
        const listOperations = clientInformacion.get('listOperations');
        _.map(listOperations, (item) => {
            item.id = item.id.toString().includes('mainIntO_') ? null : item.id;
            return item;
        });
        const noAppliedLineOfBusiness = clientInformacion.get('noAppliedLineOfBusiness');
        const noAppliedDistributionChannel = clientInformacion.get('noAppliedDistributionChannel');
        const noAppliedMainClients = clientInformacion.get('noAppliedMainClients');
        const noAppliedMainSuppliers = clientInformacion.get('noAppliedMainSuppliers');
        const noAppliedMainCompetitors = clientInformacion.get('noAppliedMainCompetitors');
        const noAppliedIntOperations = clientInformacion.get('noAppliedIntOperations');
        if (_.isUndefined(contextClient) || _.isNull(contextClient)) {
            return {
                'customerTypology': customerTypology.value,
                'id': null,
                'idClient': infoClient.id,
                'context': contextClientField.value,
                'inventoryPolicy': inventoryPolicy.value,
                'listParticipation': listLineOfBusiness,
                'listDistribution': listDistribution,
                'listMainCustomer': listMainCustomer,
                'listMainSupplier': listMainSupplier,
                'listMainCompetitor': listMainCompetitor,
                'listOperations': listOperations,
                noAppliedLineOfBusiness,
                noAppliedDistributionChannel,
                noAppliedMainClients,
                noAppliedMainSuppliers,
                noAppliedMainCompetitors,
                noAppliedIntOperations
            };
        } else {
            contextClient.customerTypology = customerTypology.value;
            contextClient.context = contextClientField.value;
            contextClient.inventoryPolicy = inventoryPolicy.value;
            contextClient.listParticipation = listLineOfBusiness;
            contextClient.listDistribution = listDistribution;
            contextClient.listMainCustomer = listMainCustomer;
            contextClient.listMainSupplier = listMainSupplier;
            contextClient.listMainCompetitor = listMainCompetitor;
            contextClient.listOperations = listOperations;
            contextClient.noAppliedLineOfBusiness = noAppliedLineOfBusiness;
            contextClient.noAppliedDistributionChannel = noAppliedDistributionChannel;
            contextClient.noAppliedMainClients = noAppliedMainClients;
            contextClient.noAppliedMainSuppliers = noAppliedMainSuppliers;
            contextClient.noAppliedMainCompetitors = noAppliedMainCompetitors;
            contextClient.noAppliedIntOperations = noAppliedIntOperations;
            return contextClient;
        }
    }

    _submitSaveContextClient() {
        const { saveCreditStudy, swtShowMessage, changeStateSaveData, studyCreditReducer } = this.props;
        var contextClientInfo = studyCreditReducer.get('contextClient');
        infoValidate = studyCreditReducer.get('validateInfoCreditStudy');
        if (!infoValidate.numberOfValidShareholders) {
            document.getElementById('dashboardComponentScroll').scrollTop = 0;
            swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, debe cumplir con los requisitos de los accionistas para poder guardar.');
        } else {
            if (contextClientInfo.overdueCreditStudy && (!this.state.valueCheckSectionActivityEconomic ||
                !this.state.valueCheckSectionInventoryPolicy || !this.state.valueCheckSectionMainClients)) {
                swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, como la fecha de actualización se encuentra vencida, debe validar que cada una de las secciones se encuentra actualizada.');
            } else {
                changeStateSaveData(true, MESSAGE_LOAD_DATA);
                saveCreditStudy(this._createJsonSaveContextClient()).then((data) => {
                    changeStateSaveData(false, "");
                    if (!validateResponse(data)) {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                    } else {
                        this.setState({
                            showSuccessMessage: true
                        });
                    }
                }, (reason) => {
                    changeStateSaveData(false, "");
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                });
            }
        }
    }

    _closeMessageSuccess() {
        this.setState({
            showSuccessMessage: false
        });
        redirectUrl("/dashboard/clientInformation");
    }

    _validateInfoStudyCredit() {
        const { swtShowMessage, changeStateSaveData, validateInfoCreditStudy } = this.props;
        var idClient = window.localStorage.getItem('idClientSelected');
        validateInfoCreditStudy(idClient).then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    componentWillMount() {
        const { fields: { customerTypology, contextClientField, inventoryPolicy }, updateTitleNavBar, getContextClient, swtShowMessage, changeStateSaveData,
            clientInformacion, selectsReducer, consultListWithParameterUbication,
            getMasterDataFields, validateInfoCreditStudy } = this.props;
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
                    var contextClientInfo = data.payload.data.data;
                    contextClientField.onChange(contextClientInfo.context);
                    inventoryPolicy.onChange(contextClientInfo.inventoryPolicy);
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
            this._validateInfoStudyCredit();
        }
    }

    componentDidMount() {
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
    }

    render() {
        const { selectsReducer, fields: { customerTypology, contextClientField, participationLB, participationDC, participationMC,
            contextLineBusiness, experience, distributionChannel, nameMainClient, termMainClient, relevantInformationMainClient,
            inventoryPolicy }, studyCreditReducer, handleSubmit, getContextClient } = this.props;
        contextClientInfo = studyCreditReducer.get('contextClient');
        infoValidate = studyCreditReducer.get('validateInfoCreditStudy');
        showCheckValidateSection = false;
        overdueCreditStudy = false;
        var fechaModString = '', updatedBy = null, createdBy = null, createdTimestampString = '';
        errorShareholder = false;
        if (contextClientInfo !== null) {
            overdueCreditStudy = contextClientInfo.overdueCreditStudy;
            if (infoValidate !== null && !infoValidate.numberOfValidShareholders) {
                numberOfShareholders = infoValidate.numberOfShareholdersWithComment;
                if (numberOfShareholders.toUpperCase() === A_SHAREHOLDER_WITH_OBSERVATION.toUpperCase()) {
                    errorShareholder = true;
                    errorMessageForShareholders = ERROR_MESSAGE_FOR_A_SHAREHOLDER_WITH_OBSERVATION
                } else {
                    if (numberOfShareholders.toUpperCase() === ALL_SHAREHOLDERS_WITH_COMMENTS.toUpperCase()) {
                        errorShareholder = true;
                        errorMessageForShareholders = ERROR_MESSAGE_FOR_ALL_SHAREHOLDER_WITH_OBSERVATION;
                    }
                }
            }
            if (contextClientInfo.updatedTimestamp !== null) {
                updatedBy = contextClientInfo.updatedBy;
                var fechaModDateMoment = moment(contextClientInfo.updatedTimestamp, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }
            if (contextClientInfo.createdTimestamp !== null) {
                createdBy = contextClientInfo.createdBy;
                var createdTimestamp = moment(contextClientInfo.createdTimestamp, "x").locale('es');
                createdTimestampString = createdTimestamp.format("DD") + " " + createdTimestamp.format("MMM") + " " + createdTimestamp.format("YYYY") + ", " + createdTimestamp.format("hh:mm a");
            }
        }
        return (
            <form id="formComponentCreditStudy" style={{ backgroundColor: "#FFFFFF", paddingBottom: "70px" }} onSubmit={handleSubmit(this._submitSaveContextClient)} >
                <div id="containerCreditStudy">
                    <div>
                        <p style={{ paddingTop: '10px' }}></p>
                        <Row xs={12} md={12} lg={12} style={{
                            border: '1px solid #e5e9ec', backgroundColor: '#F8F8F8',
                            borderRadius: '2px', margin: '0px 28px 0 20px', height: '60px'
                        }}>
                            <Col xs={12} md={12} lg={12} style={{ marginTop: '20px' }}>
                                <div>
                                    <BottonShareholderAdmin errorShareholder={errorShareholder} message={errorMessageForShareholders} functionToExecute={this._validateInfoStudyCredit} />
                                </div>
                            </Col>
                        </Row>
                    </div>
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
                        {overdueCreditStudy &&
                            <Col xs={12} md={12} lg={12}>
                                <input type="checkbox" id="checkSectionActivityEconomic"
                                    checked={this.state.valueCheckSectionActivityEconomic}
                                    onClick={this._handleChangeValueActivityEconomic} />
                                <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                            </Col>
                        }
                    </Row>
                    <ContextEconomicActivity contextClientField={contextClientField} />
                    <ComponentListLineBusiness contextLineBusiness={contextLineBusiness}
                        participation={participationLB} experience={experience}
                        showFormLinebusiness={this.state.showFormAddLineOfBusiness} fnShowForm={this.showFormOut} />
                    <ComponentListDistributionChannel distributionChannel={distributionChannel} participation={participationDC}
                        showFormDistribution={this.state.showFormAddDistribution} fnShowForm={this.showFormOut} />
                    <InventorPolicy inventoryPolicy={inventoryPolicy} showCheckValidateSection={overdueCreditStudy}
                        valueCheckSectionInventoryPolicy={this.state.valueCheckSectionInventoryPolicy}
                        functionChangeInventoryPolicy={this._handleChangeValueInventoryPolicy} />
                    <ComponentListMainClients nameClient={nameMainClient} participation={participationMC}
                        term={termMainClient} relevantInformation={relevantInformationMainClient} showCheckValidateSection={overdueCreditStudy}
                        showFormMainClients={this.state.showFormAddMainClient} fnShowForm={this.showFormOut}
                        valueCheckSectionMainClients={this.state.valueCheckSectionMainClients}
                        functionChangeCheckSectionMainClients={this._handleChangeValueMainClients} />
                    <Row style={{ padding: "10px 10px 0px 20px" }}>
                        <Col xs={6} md={3} lg={3}>
                            {createdBy !== null &&
                                <span style={{ fontWeight: "bold", color: "#818282" }}>Creado por</span>
                            }
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            {createdBy !== null &&
                                <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de creación</span>
                            }
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            {updatedBy !== null &&
                                <span style={{ fontWeight: "bold", color: "#818282" }}>Modificado por</span>
                            }
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            {updatedBy !== null &&
                                <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de modificación</span>
                            }
                        </Col>
                    </Row>
                    <Row style={{ padding: "5px 10px 0px 20px" }}>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ marginLeft: "0px", color: "#818282" }}>{createdBy}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ marginLeft: "0px", color: "#818282" }}>{createdTimestampString}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={{ marginLeft: "0px", color: "#818282" }}>{updatedBy}</span>
                        </Col>
                        <Col xs={6} md={3} lg={3}>
                            <span style={overdueCreditStudy ? { color: "#D9534F" } : { marginLeft: "0px", color: "#818282" }}>{fechaModString}</span>
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
                                type="submit">
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
                        type="success"
                        show={this.state.showSuccessMessage}
                        title="Estudio de crédito"
                        text={"Señor usuario, se ha guardado el estudio de crédito exitosamente"}
                        onConfirm={() => this._closeMessageSuccess()}
                    />
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
                </div>
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
        saveCreditStudy,
        validateInfoCreditStudy
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
