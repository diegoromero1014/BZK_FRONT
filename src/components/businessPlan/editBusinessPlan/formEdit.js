import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import moment from "moment";
import _ from "lodash";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import NeedBusiness from "../need/needBusiness";
import AreaBusiness from "../area/areaBusiness";
import SweetAlert from "../../sweetalertFocus";
import Tooltip from "../../toolTip/toolTipComponent";
import RichText from "../../richText/richTextComponent";
import BlockingComponent from '../../blockingComponent/blockingComponent';
import PermissionUserReports from "../../commercialReport/permissionsUserReports";
import { redirectUrl } from "../../globalComponents/actions";
import { getMasterDataFields } from "../../selectsComponent/actions";
import { addUsers, setConfidential } from "../../commercialReport/actions";
import { buildJsoncommercialReport, fillUsersPermissions } from '../../commercialReport/functionsGenerics';
import { consultParameterServer, formValidateKeyEnter, htmlToText, nonValidateEnter, onSessionExpire } from "../../../actionsGlobal";
import { changeStateSaveData } from "../../main/actions";
import { createBusiness, detailBusiness, pdfDescarga, validateRangeDates } from "../actions";
import { addNeed } from "../need/actions";
import { addArea } from "../area/actions";
import { showLoading } from '../../loading/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import {
    EDITAR, MESSAGE_SAVE_DATA, SAVE_DRAFT, SAVE_PUBLISHED, TITLE_OPPORTUNITY_BUSINESS, DATE_FORMAT, MESSAGE_ERROR, REQUEST_INVALID_INPUT, REQUEST_SUCCESS
} from "../../../constantsGlobal";
import { OBJECTIVE_BUSINESS } from "../constants";
import { BLOCK_BUSINESS_PLAN, REQUEST_ERROR } from '../../../constantsGlobal';

const fields = ["initialValidityDate", "finalValidityDate", "objectiveBusiness", "opportunities"];
let dateBusinessLastReview;
let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick;
const validate = values => {
    let errors = {};
    return errors;
};

export class FormEdit extends Component {

    constructor(props) {
        super(props);
        this._changeObjective = this._changeObjective.bind(this);
        this._closeConfirmClose = this._closeConfirmClose.bind(this);
        this._onCloseButton = this._onCloseButton.bind(this);
        this._editBusiness = this._editBusiness.bind(this);
        this._submitCreateBusiness = this._submitCreateBusiness.bind(this);
        this._closeMessageCreateBusiness = this._closeMessageCreateBusiness.bind(this);
        this._onClickPDF = this._onClickPDF.bind(this);
        this._onSelectFieldDate = this._onSelectFieldDate.bind(this);
        this.processValidation = this.processValidation.bind(this);
        this.state = {
            showErrorSaveBusiness: null,
            showConfirm: false,
            objectiveBusiness: "",
            objectiveBusinessError: null,
            opportunities: "",
            opportunitiesError: null,
            isEditable: false,
            initialDateError: null,
            finalDateError: null
        }
    }

    _editBusiness() {
        this.setState({
            showMessage: false,
            isEditable: !this.state.isEditable
        });
    }

    _closeMessageCreateBusiness() {
        if (typeMessage === "success") {
            this.setState({
                showMessageCreateBusiness: false
            });
            redirectUrl("/dashboard/clientInformation");
        } else {
            this.setState({
                showMessageCreateBusiness: false
            });
        }
    }

    _onClickPDF() {
        const {  dispatchChangeStateSaveData, pdfDescarga, id } = this.props;
        pdfDescarga( dispatchChangeStateSaveData, id);
    }

    _closeConfirmClose() {
        this.setState({ showConfirm: false });
        redirectUrl("/dashboard/clientInformation");
    }

    _changeObjective(value) {
        this.setState({
            objectiveBusiness: value,
            objectiveBusinessError: null
        });
    }

    _changeOpportunities(value) {
        this.setState({
            opportunities: value,
            opportunitiesError: null
        });
    }

    _onCloseButton() {
        message = "¿Está seguro que desea salir de la pantalla de edición de plan de negocio?";
        titleMessage = "Confirmación salida";
        this.setState({ showConfirm: true });
    }

    _submitCreateBusiness() {
        const { fields: { initialValidityDate, finalValidityDate }, needs, areas, businessPlanReducer, usersPermission, canUserEditBlockedReport, confidentialReducer } = this.props;

        let errorInForm = false;
        const detailBusiness = businessPlanReducer.get('detailBusiness');

        canUserEditBlockedReport()
            .then(() => {

                if (_.isNil(initialValidityDate.value) || _.isEmpty(initialValidityDate.value || !moment(initialValidityDate.value, 'DD/MM/YYYY').isValid())) {
                    errorInForm = true;
                    this.setState({
                        initialDateError: "Debe seleccionar una fecha"
                    });
                }
                if (_.isNil(finalValidityDate.value) || _.isEmpty(finalValidityDate.value) || !moment(finalValidityDate.value, 'DD/MM/YYYY').isValid()) {
                    errorInForm = true;
                    this.setState({
                        finalDateError: "Debe seleccionar una fecha"
                    });
                }
                if (typeButtonClick === SAVE_PUBLISHED) {
                    if (this.state.objectiveBusiness === null || this.state.objectiveBusiness === undefined || this.state.objectiveBusiness === "") {
                        errorInForm = true;
                        this.setState({
                            objectiveBusinessError: "Debe seleccionar una opción"
                        });
                    }
                    if (_.isEmpty(htmlToText(this.state.opportunities)) || this.state.opportunities === null || this.state.opportunities === undefined || this.state.opportunities === "") {
                        errorInForm = true;
                        this.setState({
                            opportunitiesError: "Debe ingresar un valor"
                        });
                    }
                    let needsBusiness = needs.toArray();
                    if (needsBusiness.length === 0) {
                        errorInForm = true;
                        this.setState({ showErrorSaveBusiness: true });
                    }
                }

                if (!errorInForm) {
                    let needsbB = [];
                    _.map(needs.toArray(),
                    function (need) {
                            let idNeed = (need.userTask !== null && need.userTask !== undefined  && need.userTask.id !== undefined) ? need.userTask.id : null;
                            let data = {
                                "id": need.id,
                                "clientNeed": need.needIdType,
                                "needDescription": need.descriptionNeed,
                                "productFamily": need.productFamilyId,
                                "product": need.needIdProduct,
                                "implementationTimeline": need.needIdImplementation,
                                "expectedBenefits": need.needBenefits,
                                "userTask": {
                                    "id": idNeed,
                                    "task": need.needTask,
                                    "employeeResponsible": need.needIdResponsable,
                                    "closingDate": Number(moment(need.needDate, "DD/MM/YYYY").format('x')),
                                    "status": need.statusIdNeed,
                                    "advance": need.userTask.advance
                                }
                            }
                            needsbB.push(data);
                        }
                    );
                    let areasB = [];
                    _.map(areas.toArray(),
                        function (area) {
                            let data = {
                                "id": null,
                                "relatedInternalParty": area.areaDes,
                                "actionNeeded": area.actionArea,
                                "employeeResponsible": area.areaResponsable,
                                "employeeResponsibleId": area.areaIdResponsable,
                                "needFulfillmentStatus": area.statusIdArea,
                                "actionStatus": area.needBenefits,
                                "estimatedClosing": Number(moment(area.areaDate, "DD/MM/YYYY").format('x'))
                            }
                            areasB.push(data);
                        }
                    );

                    let businessJson = {
                        "id": detailBusiness.data.id,
                        "client": window.sessionStorage.getItem('idClientSelected'),
                        "initialValidityDate": Number(moment(initialValidityDate.value, DATE_FORMAT).format('x')),
                        "finalValidityDate": Number(moment(finalValidityDate.value, DATE_FORMAT).format('x')),
                        "opportunitiesAndThreats": this.state.opportunities,
                        "objective": this.state.objectiveBusiness,
                        "documentStatus": typeButtonClick,
                        "clientNeedFulfillmentPlan": needsbB.length === 0 ? null : needsbB,
                        "relatedInternalParties": areasB.length === 0 ? null : areasB,
                        "commercialReport": buildJsoncommercialReport(this.state.commercialReport, usersPermission.toArray(), confidentialReducer.get('confidential'), typeButtonClick)
                    };
                    //Se realiza la validación de fechas y se realiza la acción de guardado si aplica
                    this._onSelectFieldDate(moment(initialValidityDate.value, DATE_FORMAT), moment(finalValidityDate.value, DATE_FORMAT), null, true, businessJson);

                }

            })
            .catch((reason) => { });

    }

    componentDidUpdate(prevProps, prevState) {
        const { hasAccess, swtShowMessage, userEditing } = this.props;
        if (!hasAccess) {
            swtShowMessage(MESSAGE_ERROR, 'Error', 'Señor usuario, en este momento el formulario esta siendo editado por ' + userEditing + '. Por favor intente mas tarde', { onConfirmCallback: this._closeConfirmClose });
        }
    }

    componentWillMount() {
        const {
            fields: {
                initialValidityDate, finalValidityDate
            }, nonValidateEnter, clientInformacion, getMasterDataFields, detailBusiness, id, addNeed, addArea, showLoading, setConfidential, addUsers
        } = this.props;

        nonValidateEnter(true);
        setConfidential(false);
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        } else {
            getMasterDataFields([OBJECTIVE_BUSINESS]);
            showLoading(true, 'Cargando...');
            detailBusiness(id).then((result) => {
                
                let part = result.payload.data.data;
                this.setState({
                    objectiveBusiness: part.objective,
                    opportunities: part.opportunitiesAndThreats,
                    commercialReport: part.commercialReport
                });

                if (!_.isNil(part.initialValidityDate)) {
                    initialValidityDate.onChange(moment(part.initialValidityDate, "x").format(DATE_FORMAT));
                }

                if (!_.isNil(part.finalValidityDate)) {
                    finalValidityDate.onChange(moment(part.finalValidityDate, "x").format(DATE_FORMAT));
                }

                _.forIn(part.clientNeedFulfillmentPlan, function (value, key) {
                    const uuid = _.uniqueId('need_');
                    let need = {
                        uuid,
                        needIdType: value.clientNeed,
                        id: value.id,
                        needType: value.need,
                        descriptionNeed: value.needDescription,
                        descriptionNeedText: htmlToText(value.needDescription),
                        productFamilyId: value.productFamily,
                        productFamily: value.productFamilyName,
                        needIdProduct: value.product,
                        needProduct: value.productName,
                        needIdImplementation: value.implementationTimeline,
                        needImplementation: value.implementationTimelineName,
                        needTask: value.userTask.task,
                        needBenefits: value.expectedBenefits,
                        needIdResponsable: value.userTask.employeeResponsible,
                        needResponsable: value.userTask.responsibleName,
                        needDate: moment(value.userTask.closingDate).format('DD/MM/YYYY'),
                        needFormat: moment(value.userTask.closingDate).format('DD/MM/YYYY'),
                        statusIdNeed: value.userTask.status,
                        statusNeed: value.userTask.nameStatus,
                        userTask: value.userTask
                    }
                    addNeed(need);
                });
                _.forIn(part.relatedInternalParties, function (value, key) {
                    const uuid = _.uniqueId('area_');
                    let area = {
                        uuid,
                        areaDes: value.relatedInternalParty,
                        actionArea: value.actionNeeded,
                        areaIdResponsable: value.employeeResponsibleId,
                        areaResponsable: value.employeeResponsibleId !== null ? value.employeeResponsibleIdName : value.employeeResponsible,
                        areaDate: moment(value.estimatedClosing).format('DD/MM/YYYY'),
                        areaFormat: moment(value.estimatedClosing).format('DD/MM/YYYY'),
                        statusIdArea: value.needFulfillmentStatus,
                        statusArea: value.actionStatus
                    };
                    addArea(area);
                });

                if (part.commercialReport) {
                    setConfidential(part.commercialReport.isConfidential);
                    fillUsersPermissions(part.commercialReport.usersWithPermission, addUsers);
                }
                showLoading(false, null);
            });

        }
    }

    //Método que valida las fechas ingresadas, que la inicial no sea mayor que la final y que el rango no se encuentre registrado ya
    //Además realiza la acción de guardado si el parámetro makeSaveBusiness llega en true
    _onSelectFieldDate(valueInitialDate, valueFinalDate, fieldDate, makeSaveBusiness, businessJson) {
        const { swtShowMessage, validateRangeDates, businessPlanReducer,  dispatchChangeStateSaveData, createBusiness } = this.props;
        const initialDate = _.isNil(valueInitialDate) || _.isEmpty(valueInitialDate) ? null : valueInitialDate;
        const finalDate = _.isNil(valueFinalDate) || _.isEmpty(valueFinalDate) ? null : valueFinalDate;
        if (!_.isNull(initialDate) && !_.isNull(finalDate)) {
            this.setState({
                initialDateError: false,
                finalDateError: false,
            });
            if (moment(initialDate, DATE_FORMAT).isAfter(moment(finalDate, DATE_FORMAT))) {
                if (!_.isNil(fieldDate)) {
                    fieldDate.onChange(null);
                }
                swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', 'Señor usuario, la fecha inicial tiene que ser menor o igual a la final.');
            } else {
                const detailBusiness = businessPlanReducer.get('detailBusiness');
                validateRangeDates(moment(initialDate, DATE_FORMAT).format('x'), moment(finalDate, DATE_FORMAT).format('x'), detailBusiness.data.id).then((data) => {
                    const response = _.get(data, 'payload.data', false);                    
                    if (response.status === REQUEST_ERROR) {
                        swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', response.data);
                    } else if (makeSaveBusiness) {
                         dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);
                        createBusiness(businessJson).then((data) => {
                             dispatchChangeStateSaveData(false, "");
                            if ((_.get(data, 'payload.data.validateLogin') === 'false')) {
                                onSessionExpire();
                            } else {
                                if ((_.get(data, 'payload.data.status') === REQUEST_SUCCESS)) {
                                    typeMessage = "success";
                                    titleMessage = "Edición plan de negocio";
                                    message = "Señor usuario, el plan de negocio se editó de forma exitosa.";
                                    this.setState({ showMessageCreateBusiness: true });
                                } else {
                                    if ((_.get(data, 'payload.data.status') === REQUEST_INVALID_INPUT)) {
                                        const validationsErrorFromServer = _.get(data, 'payload.data.data[0].detail');
                                        _.forEach(validationsErrorFromServer, (field) => {
                                            this.processValidation(field);
                                        });
                                    } else {

                                        typeMessage = "error";
                                        titleMessage = "Edición plan de negocio";
                                        message = "Señor usuario, ocurrió un error editando el plan de negocio.";
                                        this.setState({ showMessageCreateBusiness: true });
                                    }
                                }
                            }
                        }, (reason) => {
                             dispatchChangeStateSaveData(false, "");
                            typeMessage = "error";
                            titleMessage = "Edición plan de negocio";
                            message = "Señor usuario, ocurrió un error editando el plan de negocio.";
                            this.setState({ showMessageCreateBusiness: true });
                        });
                    }
                });
            }
        } else {
            if (!_.isNull(initialDate)) {
                this.setState({
                    initialDateError: false
                });
            } else {
                this.setState({
                    finalDateError: false
                });
            }
        }
    }

    processValidation(field) {
        if (field && field.field && field.field  == "opportunitiesAndThreats") {
            this.setState({ opportunitiesError: field.message[0] });
        }
    }

    render() {
        let fechaModString = '';
        let fechaCreateString = '';
        let createdBy = '';
        let updatedBy = '';
        let positionCreatedBy = '';
        let positionUpdatedBy = '';
        const { fields: { initialValidityDate, finalValidityDate }, selectsReducer, handleSubmit, businessPlanReducer, reducerGlobal } = this.props;
        const ownerDraft = businessPlanReducer.get('ownerDraft');
        const detailBusiness = businessPlanReducer.get('detailBusiness');
        if (detailBusiness !== undefined && detailBusiness !== null && detailBusiness !== '' && !_.isEmpty(detailBusiness)) {
            createdBy = detailBusiness.data.createdByName;
            updatedBy = detailBusiness.data.updatedByName;
            positionCreatedBy = detailBusiness.data.positionCreatedBy;
            positionUpdatedBy = detailBusiness.data.positionUpdatedBy;
            if (detailBusiness.data.updatedTimestamp !== null) {
                let fechaModDateMoment = moment(detailBusiness.data.updatedTimestamp, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }
            if (detailBusiness.data.createdTimestamp !== null) {
                let fechaCreateDateMoment = moment(detailBusiness.data.createdTimestamp, "x").locale('es');
                fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
            }
            if (detailBusiness.data.reviewedDate !== null) {
                let dateBusinessLastReviewD = moment(detailBusiness.data.reviewedDate, "x").locale('es');
                dateBusinessLastReview = moment(dateBusinessLastReviewD, "YYYY/DD/MM").locale('es').format("DD MMM YYYY");
            }
        }
        return (
            <form onSubmit={handleSubmit(this._submitCreateBusiness)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                className="my-custom-tab"
                style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                <Row style={{ padding: "5px 10px 0px 20px" }}>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        {_.get(reducerGlobal.get('permissionsBussinessPlan'), _.indexOf(reducerGlobal.get('permissionsBussinessPlan'), EDITAR), false) &&
                            <button type="button" onClick={this._editBusiness}
                                className={'btn btn-primary modal-button-edit'}
                                style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>Editar <i
                                    className={'icon edit'}></i></button>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <PermissionUserReports disabled={this.state.isEditable ? '' : 'disabled'} />
                    </Col>
                </Row>
                <Row style={{ padding: "10px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "18px" }} />
                            <span style={{ fontSize: "20px" }}> Datos del plan de negocio</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={5} lg={5} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Vigencia - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)
                        </dt>
                        <div style={{ display: "flex" }}>
                            <DateTimePickerUi
                                culture='es'
                                format={DATE_FORMAT}
                                style={{ width: '200px' }}
                                placeholder="Fecha inicial"
                                time={false}
                                touched={true}
                                {...initialValidityDate}
                                onSelect={(val) => this._onSelectFieldDate(moment(val).format(DATE_FORMAT), finalValidityDate.value, finalValidityDate, false)}
                                error={this.state.initialDateError}
                                disabled={this.state.isEditable ? '' : 'disabled'}
                            />
                            <div style={{ marginLeft: '20px' }}>
                                <DateTimePickerUi
                                    culture='es'
                                    style={{ width: '200px' }}
                                    format={DATE_FORMAT}
                                    placeholder="Fecha final"
                                    time={false}
                                    touched={true}
                                    {...finalValidityDate}
                                    onSelect={(val) => this._onSelectFieldDate(initialValidityDate.value, moment(val).format(DATE_FORMAT), initialValidityDate, false)}
                                    error={this.state.finalDateError}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Objetivo del plan de negocios (</span><span style={{ color: "red" }}>*</span>)
                        </dt>
                        <dt>
                            <ComboBox
                                name="objectiveBusiness"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                value={this.state.objectiveBusiness}
                                touched={true}
                                error={this.state.objectiveBusinessError}
                                onChange={val => this._changeObjective(val)}
                                onBlur={() => ''}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(OBJECTIVE_BUSINESS) || []}
                                disabled={this.state.isEditable ? '' : 'disabled'}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "20px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
                            <i className="book icon" style={{ fontSize: "18px" }} />
                            <span style={{ fontSize: "20px" }}> Oportunidades y amenazas externas de la compañía (<span
                                style={{ color: "red" }}>*</span>)</span>
                            <Tooltip text={TITLE_OPPORTUNITY_BUSINESS}>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <RichText
                            name="opportunities"
                            placeholder="Ingrese oportunidades y amenazas externas de la compañía"
                            style={{ width: '100%', height: '178px' }}
                            value={this.state.opportunities}
                            touched={true}
                            error={this.state.opportunitiesError}
                            onChange={val => this._changeOpportunities(val)}
                            disabled={this.state.isEditable ? '' : 'disabled'}
                            readOnly={!this.state.isEditable}
                        />
                    </Col>
                </Row>
                <NeedBusiness disabled={this.state.isEditable ? '' : 'disabled'} />
                <AreaBusiness disabled={this.state.isEditable ? '' : 'disabled'} />
                <Row style={{ padding: "10px 10px 0px 20px" }}>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ fontWeight: "bold", color: "#818282" }}>Creado por</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de creación</span>
                    </Col>
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
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{createdBy}</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaCreateString}</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{updatedBy}</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaModString}</span>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={6} md={6} lg={6}>
                        <span style={{ marginLeft: "0px", color: "#A7ADAD" }}>{positionCreatedBy}</span>
                    </Col>
                    <Col xs={6} md={6} lg={6}>
                        <span style={{ marginLeft: "0px", color: "#A7ADAD" }}>{positionUpdatedBy}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{
                            textAlign: "left",
                            marginTop: "20px",
                            marginBottom: "20px",
                            marginLeft: "20px",
                            color: "#818282"
                        }}>
                            <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha última revisión formato plan de negocio:  </span><span
                                style={{ marginLeft: "0px", color: "#818282" }}>{dateBusinessLastReview}</span>
                        </div>
                    </Col>
                </Row>
                <div className="" style={{
                    position: "fixed",
                    border: "1px solid #C2C2C2",
                    bottom: "0px",
                    width: "100%",
                    marginBottom: "0px",
                    backgroundColor: "#F8F8F8",
                    height: "50px",
                    background: "rgba(255,255,255,0.75)"
                }}>
                    <div style={{ width: "580px", height: "100%", position: "fixed", right: "0px" }}>
                        <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT}
                            style={this.state.isEditable === true && ownerDraft === 0 ? {
                                float: "right",
                                margin: "8px 0px 0px -120px",
                                position: "fixed",
                                backgroundColor: "#00B5AD"
                            } : { display: "none" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                        </button>
                        <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED}
                            style={this.state.isEditable === true ? {
                                float: "right",
                                margin: "8px 0px 0px 107px",
                                position: "fixed"
                            } : { display: "none" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar definitivo</span>
                        </button>
                        <button className="btn" type="button" onClick={this._onClickPDF} style={{
                            float: "right",
                            margin: "8px 0px 0px 292px",
                            position: "fixed",
                            backgroundColor: "#eb984e"
                        }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Descargar pdf</span>
                        </button>
                        <button className="btn" type="button" onClick={this._onCloseButton} style={{
                            float: "right",
                            margin: "8px 0px 0px 450px",
                            position: "fixed",
                            backgroundColor: "rgb(193, 193, 193)"
                        }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </div>
                </div>
                <SweetAlert
                    type="error"
                    show={this.state.showErrorSaveBusiness}
                    title="Error necesidades"
                    text="Señor usuario, para guardar un plan de negocio como definitivo debe agregar como mínimo una necesidad."
                    onConfirm={() => this.setState({ showErrorSaveBusiness: false })}
                />
                <SweetAlert
                    type={typeMessage}
                    show={this.state.showMessageCreateBusiness}
                    title={titleMessage}
                    text={message}
                    onConfirm={this._closeMessageCreateBusiness}
                />
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirm}
                    title={titleMessage}
                    text={message}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirm: false })}
                    onConfirm={this._closeConfirmClose} />
            </form>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMasterDataFields,
        consultParameterServer,
        detailBusiness,
        addNeed,
        addArea,
        createBusiness,
        pdfDescarga,
        dispatchChangeStateSaveData: changeStateSaveData,
        nonValidateEnter,
        showLoading,
        validateRangeDates,
        swtShowMessage,
        addUsers,
        setConfidential
    }, dispatch);
}

function mapStateToProps({ clientInformacion, selectsReducer, usersPermission, needs, businessPlanReducer, reducerGlobal, areas, navBar, confidentialReducer }, ownerProps) {
    return {
        clientInformacion,
        selectsReducer,
        businessPlanReducer,
        reducerGlobal,
        needs,
        areas,
        navBar,
        usersPermission,
        confidentialReducer
    };
}
const FormEditRedux = reduxForm({
    form: 'submitValidation',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormEdit);

export default BlockingComponent(FormEditRedux, BLOCK_BUSINESS_PLAN);