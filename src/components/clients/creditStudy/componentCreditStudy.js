import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { updateTitleNavBar } from '../../navBar/actions';
import { redirectUrl } from '../../globalComponents/actions';
import SweetAlert from '../../sweetalertFocus';
import { LINE_OF_BUSINESS, DISTRIBUTION_CHANNEL, MAIN_CLIENTS, MAIN_COMPETITOR, MAIN_SUPPLIER, INT_OPERATIONS } from '../../contextClient/constants';
import ClientTypology from '../../contextClient/ClientTypology';
import ContextEconomicActivity from '../../contextClient/contextEconomicActivity';
import ComponentListLineBusiness from '../../contextClient/listLineOfBusiness/componentListLineBusiness';
import ComponentListDistributionChannel from '../../contextClient/listDistributionChannel/componentListDistributionChannel';
import InventorPolicy from '../../contextClient/inventoryPolicy';
import ControlLinkedPayments from '../../contextClient/controlLinkedPayments';
import ComponentListMainClients from '../../contextClient/listMainClients/componentListMainClients';
import ComponentListMainSupplier from '../../contextClient/listMainSupplier/componentListMainSupplier';
import ComponentListMainCompetitor from '../../contextClient/listMainCompetitor/componentListMainCompetitor';
import ComponentListIntOperations from '../../contextClient/listInternationalOperations/componentListIntOperations';
import * as constantsSelects from '../../selectsComponent/constants';
import { consultListWithParameterUbication, getMasterDataFields } from '../../selectsComponent/actions';
import { ORIGIN_STUDY_CREDIT } from '../../contextClient/constants';
import {
    getContextClient, saveCreditStudy, validateInfoCreditStudy,
    updateNotApplyCreditContact, existsPDFforTheSameDay, generatePDF
} from './actions';
import { validateResponse, stringValidate, getUserBlockingReport, stopBlockToReport, xssValidation } from '../../../actionsGlobal';
import {
    MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, MESSAGE_REPLACE_PDF,
    MESSAGE_SAVE_DATA, YES, VALUE_XSS_INVALID, APP_URL,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT, 
    BLOCK_CREDIT_STUDY, BLOCK_REPORT_CONSTANT, TIME_REQUEST_BLOCK_REPORT, GENERAR_PDF_ESTUDIO_CREDITO
} from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../dashboard/actions';
import { showLoading } from "../../loading/actions";
import { GOVERNMENT, FINANCIAL_INSTITUTIONS } from '../../clientEdit/constants';
import moment from 'moment';
import {
    A_WITH_OBSERVATION, ALL_WITH_COMMENTS, ORIGIN_CREDIT_STUDY,
    ERROR_MESSAGE_FOR_A_SHAREHOLDER_WITH_OBSERVATION, ERROR_MESSAGE_FOR_ALL_SHAREHOLDER_WITH_OBSERVATION,
    ERROR_MESSAGE_FOR_A_BOARD_MEMBERS_WITH_OBSERVATION, ERROR_MESSAGE_FOR_ALL_BOARD_MEMBERS_WITH_OBSERVATION,
    SUCCESS_MESSAGE_FOR_SHAREHOLDER, SUCCESS_MESSAGE_FOR_BOARD_MEMBERS
} from './constants';
import ButtonShareholderAdmin from '../../clientDetailsInfo/bottonShareholderAdmin';
import ButtonContactAdmin from '../../clientDetailsInfo/bottonContactAdmin';
import ButtonBoardMembersAdmin from '../../clientDetailsInfo/buttonBoardMembersAdmin';

const fields = ["customerTypology", "contextClientField", "inventoryPolicy", "participationLB", "participationDC", "participationMC",
    "contextLineBusiness", "experience", "distributionChannel", "nameMainClient", "tbermMainClient", "relevantInformationMainClient",
    "nameMainCompetitor", "participationMComp", "obsevationsCompetitor", "termMainClient", "typeOperationIntOpera", "participationIntOpe",
    "idCountryIntOpe", "participationIntOpeCountry", "customerCoverageIntOpe", "descriptionCoverageIntOpe", "nameMainSupplier",
    "participationMS", "termMainSupplier", "relevantInformationMainSupplier", "notApplyCreditContact", "contributionDC",
    "contributionLB", "controlLinkedPayments"];

var errorMessageForShareholders = SUCCESS_MESSAGE_FOR_SHAREHOLDER;
var errorMessageForBoardMembers = SUCCESS_MESSAGE_FOR_BOARD_MEMBERS;
var messageContact = 'La información de los contactos es válida, ';
var contextClientInfo, numberOfShareholders, infoValidate, showCheckValidateSection, numberOfBoardMembers;
var showCheckValidateSection, overdueCreditStudy, fechaModString, errorShareholder, errorContact, errorBoardMembers;
var infoClient, fechaModString = '', updatedBy = null, createdBy = null, createdTimestampString;


const containerButtons = {
    
    position: "fixed",
    border: "1px solid #C2C2C2",
    bottom: "0px",
    width: "100%",
    marginBottom: "0px",
    backgroundColor: "#F8F8F8",
    height: "50px",
    background: "rgba(255,255,255,0.75)"
};

const paddingButtons = { paddingRight: '7px', paddingLeft: '7px' };

const validate = (values, props) => {
    const errors = {}
    let errorScrollTop = false;

    if (xssValidation(values.contextClientField)) {
        errors.contextClientField = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.contextClientField = null;
    }

    if (xssValidation(values.inventoryPolicy)) {
        errors.inventoryPolicy = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.inventoryPolicy = null;
    }

    return errors;

}

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
        this._handleChangeValueMainCompetitor = this._handleChangeValueMainCompetitor.bind(this);
        this._handleChangeValueMainSupplier = this._handleChangeValueMainSupplier.bind(this);
        this._handleChangeValueIntOperations = this._handleChangeValueIntOperations.bind(this);
        this._handleChangeValueNotApplyCreditContact = this._handleChangeValueNotApplyCreditContact.bind(this);
        this._validateInformationToSave = this._validateInformationToSave.bind(this);
        this.canUserEditBlockedReport = this.canUserEditBlockedReport.bind(this);
        this._closeShowErrorBlockedPrevisit = this._closeShowErrorBlockedPrevisit.bind(this);
        this.handleClickButtonPDF = this.handleClickButtonPDF.bind(this);
        this.callGeneratePDF = this.callGeneratePDF.bind(this);
        
        this._ismounted = false;

        this.state = {
            showConfirmExit: false,
            showSuccessMessage: false,
            showFormAddLineOfBusiness: false,
            showFormAddDistribution: false,
            showFormAddMainClient: false,
            showFormAddMainCompetitor: false,
            showFormAddMainSupplier: false,
            showFormAddIntOperations: false,
            lineofBusinessRequired: false,
            distributionRequired: false,
            mainClientRequired: false,
            mainCompetitorRequired: false,
            mainSupplierRequired: false,
            intOperationsRequired: false,
            valueCheckSectionActivityEconomic: false,
            valueCheckSectionInventoryPolicy: false,
            valueCheckSectionMainClients: false,
            valueCheckSectionMainCompetitor: false,
            valueCheckSectionMainSupplier: false,
            valueCheckSectionIntOperations: false,
            valueCheckNotApplyCreditContact: false,
            fieldContextRequired: false,
            customerTypology: false,
            controlLinkedPaymentsRequired: true,

            isEditable: false,
            showErrorBlockedPreVisit: false,
            intervalId: null,
            userEditingPrevisita: '',
            isComponentMounted: true,
            showButtonPDF: false,
            isPDFGenerated: false

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

    _handleChangeValueMainCompetitor() {
        this.setState({
            valueCheckSectionMainCompetitor: !this.state.valueCheckSectionMainCompetitor
        });
    }

    _handleChangeValueMainSupplier() {
        this.setState({
            valueCheckSectionMainSupplier: !this.state.valueCheckSectionMainSupplier
        });
    }

    _handleChangeValueIntOperations() {
        this.setState({
            valueCheckSectionIntOperations: !this.state.valueCheckSectionIntOperations
        });
    }

    _handleChangeValueNotApplyCreditContact() {
        const { fields: { notApplyCreditContact }, updateNotApplyCreditContact, swtShowMessage,
            changeStateSaveData } = this.props;
        var jsonCreditContact = {
            idClient: window.sessionStorage.getItem('idClientSelected'),
            notApplyCreditContact: !notApplyCreditContact.value
        }
        notApplyCreditContact.onChange(!notApplyCreditContact.value);
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        updateNotApplyCreditContact(jsonCreditContact).then((data) => {
            changeStateSaveData(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                this._validateInfoStudyCredit();
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    showFormOut(property, value) {
        if (_.isEqual(LINE_OF_BUSINESS, property)) {
            this.setState({
                showFormAddLineOfBusiness: value,
                lineofBusinessRequired: false
            });
        } else if (_.isEqual(DISTRIBUTION_CHANNEL, property)) {
            this.setState({
                showFormAddDistribution: value,
                distributionRequired: false
            });
        } else if (_.isEqual(MAIN_CLIENTS, property)) {
            this.setState({
                showFormAddMainClient: value,
                mainClientRequired: false
            });
        } else if (_.isEqual(MAIN_SUPPLIER, property)) {
            this.setState({
                showFormAddMainSupplier: value,
                mainSupplierRequired: false
            });
        } else if (_.isEqual(MAIN_COMPETITOR, property)) {
            this.setState({
                showFormAddMainCompetitor: value,
                mainCompetitorRequired: false
            });
        } else if (_.isEqual(INT_OPERATIONS, property)) {
            this.setState({
                showFormAddIntOperations: value,
                intOperationsRequired: false
            });
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

    _createJsonSaveContextClient(isDraft) {
        const { fields: { contextClientField, inventoryPolicy, customerTypology,
            controlLinkedPayments }, clientInformacion } = this.props;
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
            item.id = item.id === null || item.id.toString().includes('mainIntO_') ? null : item.id;
            _.map(item.listCountryOperations, (country) => {
                country.id = country.id === null || country.id.toString().includes('mainIntO_') ? null : country.id;
                return country;
            });
            return item;
        });
        const noAppliedLineOfBusiness = clientInformacion.get('noAppliedLineOfBusiness');
        const noAppliedDistributionChannel = clientInformacion.get('noAppliedDistributionChannel');
        const noAppliedMainClients = clientInformacion.get('noAppliedMainClients');
        const noAppliedMainSuppliers = clientInformacion.get('noAppliedMainSuppliers');
        const noAppliedMainCompetitors = clientInformacion.get('noAppliedMainCompetitors');
        const noAppliedIntOperations = clientInformacion.get('noAppliedIntOperations');
        const noAppliedControlLinkedPayments = clientInformacion.get('noAppliedControlLinkedPayments');
        if (_.isUndefined(contextClient) || _.isNull(contextClient)) {
            return {
                'customerTypology': customerTypology.value,
                'id': null,
                'idClient': infoClient.id,
                'context': contextClientField.value,
                'inventoryPolicy': inventoryPolicy.value,
                'controlLinkedPayments': noAppliedControlLinkedPayments ? null : controlLinkedPayments.value,
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
                noAppliedIntOperations,
                noAppliedControlLinkedPayments,
                
                isDraft
            };
        } else {
            contextClient.controlLinkedPayments = noAppliedControlLinkedPayments ? null : controlLinkedPayments.value;
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
            contextClient.noAppliedControlLinkedPayments = noAppliedControlLinkedPayments;

            contextClient.isDraft = isDraft;

            return contextClient;
        }
    }

    _validateInformationToSave() {
        const { fields: { contextClientField, customerTypology, controlLinkedPayments, inventoryPolicy }, clientInformacion,
            swtShowMessage, studyCreditReducer } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        const { contextClient } = infoClient;
        var allowSave = true;
        var contextClientInfo = studyCreditReducer.get('contextClient');

        var shouldDisplayMessage = false;
        var contentErrorMessage = "";


        infoValidate = studyCreditReducer.get('validateInfoCreditStudy');
        if (!infoValidate.numberOfValidShareholders) {
            allowSave = false;
            document.getElementById('dashboardComponentScroll').scrollTop = 0;
            swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, debe cumplir con los requisitos de los accionistas para poder guardar.');
        } else {
            if (!infoValidate.numberOfValidBoardMembers) {
                allowSave = false;
                document.getElementById('dashboardComponentScroll').scrollTop = 0;
                swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, debe cumplir con los requisitos de los miembros de junta para poder guardar.');
            } else {
                if (errorContact) {
                    allowSave = false;
                    document.getElementById('dashboardComponentScroll').scrollTop = 0;
                    swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, debe cumplir con los requisitos de los contactos.');
                } else {
                    if (this.state.showFormAddLineOfBusiness || this.state.showFormAddDistribution || this.state.showFormAddMainClient ||
                        this.state.showFormAddMainSupplier || this.state.showFormAddIntOperations || this.state.showFormAddMainCompetitor) {
                        allowSave = false;
                        swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, esta creando o editando un registro en alguna sección, debe terminarlo o cancelarlo para poder guardar.');
                    } else {
                        const listLineOfBusiness = clientInformacion.get('listParticipation');
                        const listDistribution = clientInformacion.get('listDistribution');
                        const listMainCustomer = clientInformacion.get('listMainCustomer');
                        const listMainSupplier = clientInformacion.get('listMainSupplier');
                        const listMainCompetitor = clientInformacion.get('listMainCompetitor');
                        const listOperations = clientInformacion.get('listOperations');
                        const noAppliedLineOfBusiness = clientInformacion.get('noAppliedLineOfBusiness');
                        const noAppliedDistributionChannel = clientInformacion.get('noAppliedDistributionChannel');
                        const noAppliedMainClients = clientInformacion.get('noAppliedMainClients');
                        const noAppliedMainSuppliers = clientInformacion.get('noAppliedMainSuppliers');
                        const noAppliedMainCompetitors = clientInformacion.get('noAppliedMainCompetitors');
                        const noAppliedIntOperations = clientInformacion.get('noAppliedIntOperations');
                        const noAppliedControlLinkedPayments = clientInformacion.get('noAppliedControlLinkedPayments')
                        if (listLineOfBusiness.length === 0 && noAppliedLineOfBusiness === false) {
                            this.setState({
                                showFormAddLineOfBusiness: true,
                                lineofBusinessRequired: true
                            });
                            allowSave = false;

                            shouldDisplayMessage = true;
                            contentErrorMessage = "Es necesario diligenciar todos los campos obligatorios";

                           

                        }
                        if (listDistribution.length === 0 &&
                            (noAppliedDistributionChannel === false || !stringValidate(noAppliedDistributionChannel))) {
                            this.setState({
                                showFormAddDistribution: true,
                                distributionRequired: true
                            });
                            allowSave = false;

                            shouldDisplayMessage = true;
                            contentErrorMessage = "Es necesario diligenciar todos los campos obligatorios";
                        }
                        if (listMainCustomer.length === 0 &&
                            (noAppliedMainClients === false || !stringValidate(noAppliedMainClients))) {
                            this.setState({
                                showFormAddMainClient: true,
                                mainClientRequired: true
                            });
                            allowSave = false;

                            shouldDisplayMessage = true;
                            contentErrorMessage = "Es necesario diligenciar todos los campos obligatorios";
                        }
                        if (listMainSupplier.length === 0 &&
                            (noAppliedMainSuppliers === false || !stringValidate(noAppliedMainSuppliers))) {
                            this.setState({
                                showFormAddMainSupplier: true,
                                mainSupplierRequired: true
                            });
                            allowSave = false;

                            shouldDisplayMessage = true;
                            contentErrorMessage = "Es necesario diligenciar todos los campos obligatorios";
                        }
                        if (listMainCompetitor.length === 0 &&
                            (noAppliedMainCompetitors === false || !stringValidate(noAppliedMainCompetitors))) {
                            this.setState({
                                showFormAddMainCompetitor: true,
                                mainCompetitorRequired: true
                            });
                            allowSave = false;

                            shouldDisplayMessage = true;
                            contentErrorMessage = "Es necesario diligenciar todos los campos obligatorios";
                        }
                        if (_.isEqual(infoClient.operationsForeignCurrency, 1) && listOperations.length === 0 &&
                            (noAppliedIntOperations === false || !stringValidate(noAppliedIntOperations))) {
                            this.setState({
                                showFormAddIntOperations: true,
                                intOperationsRequired: true
                            });
                            allowSave = false;

                            shouldDisplayMessage = true;
                            contentErrorMessage = "Es necesario diligenciar todos los campos obligatorios";
                        }

                        if (!stringValidate(contextClientField.value)) {
                            allowSave = false;
                            this.setState({
                                fieldContextRequired: true
                            });
                        } else if (xssValidation(contextClientField.value)) {
                            allowSave = false;
                        }

                        if (xssValidation(inventoryPolicy.value)) {
                            allowSave = false;
                        }

                        if (!stringValidate(customerTypology.value)) {
                            allowSave = false;
                            this.setState({
                                customerTypology: true
                            });
                        }
                        if (!noAppliedControlLinkedPayments && !stringValidate(controlLinkedPayments.value)) {
                            allowSave = false;
                        }
                        if (contextClientInfo.overdueCreditStudy && (!this.state.valueCheckSectionActivityEconomic ||
                            !this.state.valueCheckSectionInventoryPolicy || !this.state.valueCheckSectionMainClients ||
                            !this.state.valueCheckSectionMainCompetitor || !this.state.valueCheckSectionMainSupplier ||
                            (_.isEqual(infoClient.operationsForeignCurrency, YES) && !this.state.valueCheckSectionIntOperations))) {
                            allowSave = false;
                            swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, como la fecha de actualización se encuentra vencida, debe validar que cada una de las secciones se encuentra actualizada.');
                        }
                    }
                }
            }
        }

        if(shouldDisplayMessage) {
            swtShowMessage('error','Estudio de crédito', contentErrorMessage);
        }
        
        return allowSave;
    }

    _submitSaveContextClient(tipoGuardado) {

        const { getUserBlockingReport, swtShowMessage } = this.props;

        
        showLoading(true, "Cargando...");

        let username = window.localStorage.getItem('userNameFront');

        this.canUserEditBlockedReport(username).then((success) => {

            showLoading(false, "Cargando...");

            let isAvance;

            if( typeof tipoGuardado == 'undefined') {
                isAvance = false;
            }else if(tipoGuardado == "Avance") {
                isAvance = true;
            }else {
                isAvance = false;
            }

            if (isAvance || this._validateInformationToSave()) {
                const { saveCreditStudy, swtShowMessage, changeStateSaveData } = this.props;
                changeStateSaveData(true, MESSAGE_LOAD_DATA);
                saveCreditStudy(this._createJsonSaveContextClient(isAvance)).then((data) => {
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

        }).catch((error) => {
            showLoading(false, "Cargando...");
        })

    }

    _closeMessageSuccess() {
        this.setState({
            showSuccessMessage: false
        });
        redirectUrl("/dashboard/clientInformation");
    }

    _validateInfoStudyCredit() {
        const { swtShowMessage, changeStateSaveData, validateInfoCreditStudy } = this.props;
        var idClient = window.sessionStorage.getItem('idClientSelected');
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

    callGeneratePDF() {
        const { generatePDF, swtShowMessage, showLoading } = this.props;

        showLoading(true, 'Cargando..');

        generatePDF().then((response) => {
            swtShowMessage('success', 'Estudio de crédito', 'Señor usuario, el PDF ha sido generado correctamente');
            this.setState({isPDFGenerated : true});
            window.open(APP_URL + '/getExcelReport?filename=' + response.payload.data.data.filename + '&id=' + response.payload.data.data.sessionToken, '_blank');
        
            showLoading(false, null);
        
        }).catch((error) => {
            showLoading(false, null);
            swtShowMessage('error', 'Estudio de crédito', 'Señor usuario, ocurrió un error generando el PDF.');
        })
    }

    handleClickButtonPDF() {
        const { existsPDFforTheSameDay, swtShowMessage, studyCreditReducer } = this.props;
    
        if (this.state.isPDFGenerated) {
            swtShowMessage(
                "warning", "Advertencia", 
                MESSAGE_REPLACE_PDF, 
                {
                    onConfirmCallback: this.callGeneratePDF, 
                    onCancelCallback: () => {} 
                },
                {
                    confirmButtonText: 'Confirmar'
                }
            );
        } else {
            this.callGeneratePDF();
        }


        

    }


    canUserEditBlockedReport(myUserName) {

        const { getUserBlockingReport, swtShowMessage } = this.props;

        let idClient = window.sessionStorage.getItem('idClientSelected');

        // Envio el id del cliente como primer parametro ya que solo hay un estudio de credito por cliente

        return getUserBlockingReport(idClient, BLOCK_CREDIT_STUDY).then((success) => {

            if (! this._ismounted) {

                clearInterval(this.state.intervalId);
                return;
            }


            if(success.payload.data.data == null) {
                clearInterval(this.state.intervalId);

                this.setState({ showErrorBlockedPreVisit: true, userEditingPrevisita: "Error", shouldRedirect: true })

                return;
            }

            let username = success.payload.data.data.username



            let name = success.payload.data.data.name

            if (_.isNull(username)) {
                // Error servidor
                swtShowMessage(MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT);

                return Promise.reject(new Error('Error interno del servidor'))

            } else if (username.toUpperCase() === myUserName.toUpperCase()) {
                // Usuario pidiendo permiso es el mismo que esta bloqueando
                if (!this.state.isEditable) {
                    // Tengo permiso de editar y no estoy editando
                    this.setState({
                        showErrorBlockedPreVisit: false,
                        showMessage: false,
                        isEditable: true,
                        intervalId: setInterval(() => { this.canUserEditBlockedReport(myUserName) }, TIME_REQUEST_BLOCK_REPORT)
                    })

                }

            } else {
                // El reporte esta siendo editado por otra persona
                if (this.state.isEditable) {
                    // Estoy editando pero no tengo permisos
                    // Salir de edicion y detener intervalo

              
                    clearInterval(this.state.intervalId);
                    this.setState({ showErrorBlockedPreVisit: true, userEditingPrevisita: name, shouldRedirect: true, isEditable: false })
                    
                } else {
                    // Mostar mensaje de el usuario que tiene bloqueado el informe

                    this.setState({ showErrorBlockedPreVisit: true, userEditingPrevisita: name, shouldRedirect: false })
                }

                return Promise.reject(new Error('el reporte se encuentra bloqueado por otro usuario'));
            }

            return success
        })

    }

    _closeShowErrorBlockedPrevisit() {
        this.setState({ showErrorBlockedPreVisit: false })
        redirectUrl("/dashboard/clientInformation")
    }

    componentWillUnmount() {

        const { stopBlockToReport, id } = this.props;

        let idClient = window.sessionStorage.getItem('idClientSelected');

        this._ismounted = false;

        // Detener envio de peticiones para bloquear el informe
        clearInterval(this.state.intervalId)
        // Informar al backend que el informe se puede liberar

        if (this.state.isEditable) {

            stopBlockToReport(idClient, BLOCK_CREDIT_STUDY).then((success) => {

            }).catch((error) => {
    
            })
        }        

    }


    componentWillMount() {
        const { fields: { customerTypology, contextClientField, inventoryPolicy, controlLinkedPayments }, updateTitleNavBar, getContextClient, swtShowMessage, changeStateSaveData,
            clientInformacion, selectsReducer, consultListWithParameterUbication,
            getMasterDataFields, validateInfoCreditStudy, getUserBlockingReport, reducerGlobal, studyCreditReducer } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        } else {

            let logUser = window.localStorage.getItem('userNameFront');
            var idClient = window.sessionStorage.getItem('idClientSelected');

            

            
            
            this.canUserEditBlockedReport(logUser);
            getMasterDataFields([constantsSelects.SEGMENTS, constantsSelects.FILTER_COUNTRY]).then((data) => {
                const value = _.get(_.find(data.payload.data.messageBody.masterDataDetailEntries, ['id', parseInt(infoClient.segment)]), 'value');
                if (!_.isUndefined(value)) {
                    if (_.isEqual(GOVERNMENT, value) || _.isEqual(FINANCIAL_INSTITUTIONS, value)) {
                        consultListWithParameterUbication(constantsSelects.CUSTOMER_TYPOLOGY, infoClient.segment).then((data) => {
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
                    controlLinkedPayments.onChange(contextClientInfo.controlLinkedPayments);
                }

                const showButtonPDF = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), GENERAR_PDF_ESTUDIO_CREDITO), false) && data.payload.data.data.id != null;

                this.setState({isPDFGenerated : data.payload.data.data.isPDFGenerated, showButtonPDF});

            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
            this._validateInfoStudyCredit();
        }
    }

    componentDidMount() {
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
        const { fields: { notApplyCreditContact }, clientInformacion } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        notApplyCreditContact.onChange(infoClient.notApplyCreditContact);

        this._ismounted = true;
    }

    render() {
        const { selectsReducer, fields: { customerTypology, contextClientField, participationLB, participationDC, participationMC,
            contextLineBusiness, experience, distributionChannel, nameMainClient, termMainClient, relevantInformationMainClient,
            inventoryPolicy, nameMainCompetitor, participationMComp, obsevationsCompetitor, typeOperationIntOpera, participationIntOpe,
            idCountryIntOpe, participationIntOpeCountry, customerCoverageIntOpe, descriptionCoverageIntOpe, nameMainSupplier,
            participationMS, termMainSupplier, relevantInformationMainSupplier, valueCheckCreditContact, notApplyCreditContact,
            contributionDC, contributionLB, controlLinkedPayments },
            studyCreditReducer, handleSubmit, getContextClient, clientInformacion } = this.props;
        contextClientInfo = studyCreditReducer.get('contextClient');
        infoValidate = studyCreditReducer.get('validateInfoCreditStudy');
        showCheckValidateSection = false;
        overdueCreditStudy = false;
        infoClient = clientInformacion.get('responseClientInfo');
        fechaModString = '', updatedBy = null, createdBy = null, createdTimestampString = '';
        errorShareholder = false;
        errorBoardMembers = false;
        if (contextClientInfo !== null) {
            overdueCreditStudy = contextClientInfo.overdueCreditStudy;
            if (infoValidate !== null) {
                if (!infoValidate.numberOfValidShareholders) {
                    numberOfShareholders = infoValidate.numberOfShareholdersWithComment;
                    if (numberOfShareholders.toUpperCase() === A_WITH_OBSERVATION.toUpperCase()) {
                        errorShareholder = true;
                        errorMessageForShareholders = ERROR_MESSAGE_FOR_A_SHAREHOLDER_WITH_OBSERVATION + ' ';
                    } else {
                        if (numberOfShareholders.toUpperCase() === ALL_WITH_COMMENTS.toUpperCase()) {
                            errorShareholder = true;
                            errorMessageForShareholders = ERROR_MESSAGE_FOR_ALL_SHAREHOLDER_WITH_OBSERVATION + ' ';
                        }
                    }
                } else {
                    errorMessageForShareholders = SUCCESS_MESSAGE_FOR_SHAREHOLDER;
                }

                if (!infoValidate.numberOfValidBoardMembers) {
                    numberOfBoardMembers = infoValidate.numberOfBoardMembersWithComent;
                    if (numberOfBoardMembers.toUpperCase() === A_WITH_OBSERVATION.toUpperCase()) {
                        errorBoardMembers = true;
                        errorMessageForBoardMembers = ERROR_MESSAGE_FOR_A_BOARD_MEMBERS_WITH_OBSERVATION + ' ';
                    } else {
                        if (numberOfBoardMembers.toUpperCase() === ALL_WITH_COMMENTS.toUpperCase()) {
                            errorBoardMembers = true;
                            errorMessageForBoardMembers = ERROR_MESSAGE_FOR_ALL_BOARD_MEMBERS_WITH_OBSERVATION + ' ';
                        }
                    }
                } else {
                    errorMessageForBoardMembers = SUCCESS_MESSAGE_FOR_BOARD_MEMBERS;
                }

                if (infoValidate.validContacts === true) {
                    errorContact = false;
                    messageContact = "La información de los contactos es válida, ";
                } else {
                    errorContact = true;
                    messageContact = "Falta un contacto con función 'Estudio de crédito' ";
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
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={{ marginLeft: '20px', paddingTop: '10px' }}>
                        <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                    </Col>
                </Row>
                <div>
                    <Row xs={12} md={12} lg={12} style={{
                        border: '1px solid #e5e9ec', backgroundColor: '#F8F8F8',
                        borderRadius: '2px', margin: '10px 28px 0 20px', height: '90px'
                    }}>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '20px' }}>
                            <div>
                                <ButtonContactAdmin errorContact={errorContact} message={messageContact}
                                    functionToExecute={this._validateInfoStudyCredit}
                                />
                                <ButtonShareholderAdmin errorShareholder={errorShareholder}
                                    message={errorMessageForShareholders} functionToExecute={this._validateInfoStudyCredit}
                                />
                                <ButtonBoardMembersAdmin errorBoardMembers={errorBoardMembers}
                                    message={errorMessageForBoardMembers} functionToExecute={this._validateInfoStudyCredit}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row style={{ paddingTop: "10px", marginLeft: "10px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <input type="checkbox" id="checkNotApplyCreditContact" style={{ marginLeft: '10px' }}
                            checked={notApplyCreditContact.value}
                            onClick={this._handleChangeValueNotApplyCreditContact} />
                        <span >No aplican contactos con función estudio de crédito</span>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        
                        <ClientTypology customerTypology={customerTypology}
                            data={selectsReducer.get(constantsSelects.CUSTOMER_TYPOLOGY)}
                            fieldRequiered={this.state.customerTypology}
                            origin={ORIGIN_CREDIT_STUDY} />
                    </Col>
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
                <ContextEconomicActivity contextClientField={contextClientField}
                    fieldRequiered={this.state.fieldContextRequired}
                    origin={ORIGIN_CREDIT_STUDY} />
                <ComponentListLineBusiness contextLineBusiness={contextLineBusiness}
                    participation={participationLB} experience={experience}
                    registrationRequired={this.state.lineofBusinessRequired} contribution={contributionLB}
                    showFormLinebusiness={this.state.showFormAddLineOfBusiness}
                    fnShowForm={this.showFormOut} origin={ORIGIN_CREDIT_STUDY} />
                <ComponentListDistributionChannel distributionChannel={distributionChannel} participation={participationDC}
                    showFormDistribution={this.state.showFormAddDistribution} fnShowForm={this.showFormOut}
                    registrationRequired={this.state.distributionRequired} origin={ORIGIN_CREDIT_STUDY}
                    contribution={contributionDC} />
                <InventorPolicy inventoryPolicy={inventoryPolicy} showCheckValidateSection={overdueCreditStudy}
                    valueCheckSectionInventoryPolicy={this.state.valueCheckSectionInventoryPolicy}
                    functionChangeInventoryPolicy={this._handleChangeValueInventoryPolicy}
                    controlLinkedPayments={controlLinkedPayments} controlLinkedPaymentsRequired={this.state.controlLinkedPaymentsRequired} />

                <ControlLinkedPayments controlLinkedPayments={controlLinkedPayments} controlLinkedPaymentsRequired={this.state.controlLinkedPaymentsRequired}/>
                
                <ComponentListMainClients nameClient={nameMainClient} participation={participationMC}
                    term={termMainClient} relevantInformation={relevantInformationMainClient} showCheckValidateSection={overdueCreditStudy}
                    showFormMainClients={this.state.showFormAddMainClient} fnShowForm={this.showFormOut}
                    valueCheckSectionMainClients={this.state.valueCheckSectionMainClients}
                    functionChangeCheckSectionMainClients={this._handleChangeValueMainClients}
                    registrationRequired={this.state.mainClientRequired} origin={ORIGIN_CREDIT_STUDY} />
                <ComponentListMainSupplier nameSupplier={nameMainSupplier} participation={participationMS}
                    term={termMainSupplier} relevantInformation={relevantInformationMainSupplier}
                    showFormMainSupplier={this.state.showFormAddMainSupplier} fnShowForm={this.showFormOut}
                    showCheckValidateSection={overdueCreditStudy} registrationRequired={this.state.mainSupplierRequired}
                    valueCheckSectionMainSupplier={this.state.valueCheckSectionMainSupplierr}
                    functionChangeMainSupplier={this._handleChangeValueMainSupplier} origin={ORIGIN_CREDIT_STUDY} />
                <ComponentListMainCompetitor nameCompetitor={nameMainCompetitor} participation={participationMComp}
                    observations={obsevationsCompetitor} showFormMainCompetitor={this.state.showFormAddMainCompetitor}
                    fnShowForm={this.showFormOut} showCheckValidateSection={overdueCreditStudy}
                    valueCheckSectionMainCompetitor={this.state.valueCheckSectionMainCompetitor}
                    functionChangeMainCompetitor={this._handleChangeValueMainCompetitor}
                    registrationRequired={this.state.mainCompetitorRequired} origin={ORIGIN_CREDIT_STUDY} />

                {_.isEqual(infoClient.operationsForeignCurrency, YES) &&
                    <ComponentListIntOperations typeOperation={typeOperationIntOpera} participation={participationIntOpe}
                        idCountry={idCountryIntOpe} participationCountry={participationIntOpeCountry} customerCoverage={customerCoverageIntOpe}
                        descriptionCoverage={descriptionCoverageIntOpe} showFormIntOperations={this.state.showFormAddIntOperations}
                        fnShowForm={this.showFormOut} origin={ORIGIN_CREDIT_STUDY} registrationRequired={this.state.intOperationsRequired}
                        valueCheckSectionIntOperations={this.state.valueCheckSectionIntOperations}
                        showCheckValidateSection={overdueCreditStudy}
                        functionChangeIntOperations={this._handleChangeValueIntOperations} />
                }
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
                <div className="" style={containerButtons}>
                        <div style={{
                            right: '0px',
                            position: 'fixed',
                            paddingRight: '15px'
                        }}>
                            <Row style={{ paddingTop: '8px' }}>


                                    <Col style={paddingButtons} onClick={ () => this._submitSaveContextClient("Avance") } >
                                        <button className="btn" type="button" style={ { backgroundColor: "#00B5AD" } } ><span >Guardar Avance</span></button>
                                    </Col>

                                    <Col style={paddingButtons}   >
                                        <button className="btn" type="submit"  ><span>Guardar Definitivo</span></button>
                                    </Col>

                                    { this.state.showButtonPDF && 
                                        <Col style={paddingButtons} onClick={() => this.handleClickButtonPDF()} >
                                            <button className="btn" type="button" style={{backgroundColor: "#eb984e"}}><span>Generar PDF</span></button>
                                        </Col> 
                                    }
                                
                                    <Col style={paddingButtons} onClick={this._closeWindow} >
                                        <button className="btn btn-secondary modal-button-edit" type="button"><span >Cancelar</span></button>
                                    </Col>

                                    
                                
                            </Row>
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

                <SweetAlert
                    type="error"
                    show={this.state.showErrorBlockedPreVisit}
                    title="Error al editar el estudio de crédito"
                    text={"Señor usuario, en este momento el estudio de crédito esta siendo editado por " + this.state.userEditingPrevisita
                        + ". Por favor intentar mas tarde"}
                    onConfirm={this._closeShowErrorBlockedPrevisit}

                />

            </form>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        getContextClient,
        existsPDFforTheSameDay,
        generatePDF,
        swtShowMessage,
        changeStateSaveData,
        consultListWithParameterUbication,
        getMasterDataFields,
        saveCreditStudy,
        validateInfoCreditStudy,
        updateNotApplyCreditContact,
        getUserBlockingReport,
        stopBlockToReport,
        showLoading
    }, dispatch);
}

function mapStateToProps({ selectsReducer, clientInformacion, studyCreditReducer, reducerGlobal }, ownerProps) {
    return {
        selectsReducer,
        clientInformacion,
        studyCreditReducer,
        reducerGlobal
    };
}

export default reduxForm({
    form: 'formStudyCredit',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ComponentStudyCredit);
