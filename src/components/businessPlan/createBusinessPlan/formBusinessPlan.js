import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import _ from 'lodash';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import NeedBusiness from '../need/needBusiness';
import AreaBusiness from '../area/areaBusiness';
import SweetAlertFocus from '../../sweetalertFocus';
import Tooltip from "../../toolTip/toolTipComponent";
import RichText from "../../richText/richTextComponent";
import PermissionUserReports from "../../commercialReport/permissionsUserReports";
import { redirectUrl } from '../../globalComponents/actions';
import { setConfidential } from '../../commercialReport/actions';
import { buildJsoncommercialReport } from '../../commercialReport/functionsGenerics';
import { getMasterDataFields } from '../../selectsComponent/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../main/actions';
import { createBusiness, validateRangeDates } from '../actions';
import {
    consultParameterServer, formValidateKeyEnter, htmlToText,
    onSessionExpire
} from '../../../actionsGlobal';
import { LAST_BUSINESS_REVIEW } from '../../../constantsParameters';
import { OBJECTIVE_BUSINESS } from '../constants';
import {
    TITLE_OPPORTUNITY_BUSINESS, SAVE_DRAFT, SAVE_PUBLISHED, MESSAGE_SAVE_DATA, MESSAGE_ERROR, DATE_FORMAT, REQUEST_SUCCESS, REQUEST_INVALID_INPUT, REQUEST_ERROR
} from '../../../constantsGlobal';

const fields = ["initialValidityDate", "finalValidityDate", "dateBusiness", "objectiveBusiness", "opportunities"];

let dateBusinessLastReview;
let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick;
const validate = values => {
    let errors = {};
    return errors;
};
export class FormBusinessPlan extends Component {

    constructor(props) {
        super(props);
        this._changeDateBusiness = this._changeDateBusiness.bind(this);
        this._changeDateBusinessOnBlur = this._changeDateBusinessOnBlur.bind(this);
        this._changeObjective = this._changeObjective.bind(this);
        this._closeConfirmClose = this._closeConfirmClose.bind(this);
        this._onCloseButton = this._onCloseButton.bind(this);
        this._closeMessageCreateBusiness = this._closeMessageCreateBusiness.bind(this);
        this._submitCreateBusiness = this._submitCreateBusiness.bind(this);
        this._onSelectFieldDate = this._onSelectFieldDate.bind(this);
        this.processValidation = this.processValidation.bind(this);
        this.state = {
            showErrorSaveBusiness: null,
            showConfirm: false,
            dateBusiness: new Date(),
            dateBusinessError: null,
            objectiveBusiness: "",
            objectiveBusinessError: null,
            opportunities: "",
            opportunitiesError: null,
            initialDateError: null,
            finalDateError: null
        }
    }

    _closeMessageCreateBusiness() {
        if (typeMessage === "success") {
            this.setState({
                showMessageCreateBusiness: false,
                dateVisit: ""
            });
            redirectUrl("/dashboard/clientInformation");
        } else {
            this.setState({
                showMessageCreateBusiness: false
            });
        }
    }


    _submitCreateBusiness() {
        const { fields: { initialValidityDate, finalValidityDate }, needs, areas, usersPermission, confidentialReducer } = this.props;
        let errorInForm = false;
        if (_.isNil(initialValidityDate.value) || _.isEmpty(initialValidityDate.value) || !moment(initialValidityDate.value, 'DD/MM/YYYY').isValid()) {
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
            if (this.state.dateBusiness === null || this.state.dateBusiness === undefined || this.state.dateBusiness === "") {
                errorInForm = true;
                this.setState({
                    dateBusinessError: "Debe seleccionar una fecha"
                });
            }

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
                    let data = {
                        "id": null,
                        "clientNeed": need.needIdType,
                        "needDescription": need.descriptionNeed,
                        "productFamily": need.productFamilyId,
                        "product": need.needIdProduct,
                        "implementationTimeline": need.needIdImplementation,
                        "expectedBenefits": need.needBenefits,
                        "userTask": {
                            "id": null,
                            "task": need.needTask,
                            "employeeResponsible": Number(need.needIdResponsable),
                            "closingDate": Number(moment(need.needDate, DATE_FORMAT).format('x')),
                            "status": Number(need.statusIdNeed)
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
                        "estimatedClosing": Number(moment(area.areaDate, DATE_FORMAT).format('x'))
                    }
                    areasB.push(data);
                }
            );

            let businessJson = {
                "id": null,
                "client": window.sessionStorage.getItem('idClientSelected'),
                "initialValidityDate": Number(moment(initialValidityDate.value, DATE_FORMAT).format('x')),
                "finalValidityDate": Number(moment(finalValidityDate.value, DATE_FORMAT).format('x')),
                "opportunitiesAndThreats": this.state.opportunities,
                "objective": this.state.objectiveBusiness,
                "documentStatus": typeButtonClick,
                "clientNeedFulfillmentPlan": needsbB,
                "relatedInternalParties": areasB,
                "commercialReport": buildJsoncommercialReport(null, usersPermission.toArray(), confidentialReducer.get('confidential'), typeButtonClick)
            };
            //Se realiza la validación de fechas y se realiza la acción de guardado si aplica
            this._onSelectFieldDate(moment(initialValidityDate.value, DATE_FORMAT), moment(finalValidityDate.value, DATE_FORMAT), null, true, businessJson);
        }

    }

    _closeConfirmClose() {
        this.setState({ showConfirm: false });
        redirectUrl("/dashboard/clientInformation");
    }

    _changeDateBusiness(value) {
        this.setState({
            dateBusiness: value,
            dateBusinessError: null
        });
    }

    _changeObjective(value) {

        this.setState({
            objectiveBusiness: value,
            objectiveBusinessError: null
        });
    }

    _changeDateBusinessOnBlur(value) {
        let date = value.target.value;
        if (date === '' || date === undefined || date === null) {
            this.setState({
                dateBusinessError: "Debe seleccionar una fecha"
            });
        }
    }

    _changeOpportunities(value) {
        this.setState({
            opportunities: value,
            opportunitiesError: null
        });
    }

    _onCloseButton() {
        message = "¿Está seguro que desea salir de la pantalla de creación de plan de negocio?";
        titleMessage = "Confirmación salida";
        this.setState({ showConfirm: true });
    }

    componentWillMount() {
        const { clientInformacion, getMasterDataFields, consultParameterServer, setConfidential } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        setConfidential(false);
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        } else {
            getMasterDataFields([OBJECTIVE_BUSINESS]);
            consultParameterServer(LAST_BUSINESS_REVIEW).then((data) => {
                if (data.payload.data.data !== null && data.payload.data.data !== "" && data.payload.data.data !== undefined) {
                    dateBusinessLastReview = data.payload.data.data.value;
                    dateBusinessLastReview = moment(dateBusinessLastReview, DATE_FORMAT).locale('es').format(DATE_FORMAT);
                }
            });
        }
    }

    //Método que valida las fechas ingresadas, que la inicial no sea mayor que la final y que el rango no se encuentre registrado ya
    //Además realiza la acción de guardado si el parámetro makeSaveBusiness llega en true
    _onSelectFieldDate(valueInitialDate, valueFinalDate, fieldDate, makeSaveBusiness, businessJson) {
        const { swtShowMessage, validateRangeDates, changeStateSaveData, createBusiness } = this.props;
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
                validateRangeDates(moment(initialDate, DATE_FORMAT).format('x'), moment(finalDate, DATE_FORMAT).format('x'), null).then((data) => {
                    const response = _.get(data, 'payload.data', false);                    
                    if (response.status === REQUEST_ERROR) {
                        swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', response.data);
                    } else if (makeSaveBusiness) {
                        changeStateSaveData(true, MESSAGE_SAVE_DATA);
                        createBusiness(businessJson).then((data) => {
                            changeStateSaveData(false, "");
                            if ((_.get(data, 'payload.data.validateLogin') === 'false')) {
                                onSessionExpire();
                            } else {
                                if ((_.get(data, 'payload.data.status') === REQUEST_SUCCESS)) {
                                    typeMessage = "success";
                                    titleMessage = "Creación plan de negocio";
                                    message = "Señor usuario, el plan de negocio se creó de forma exitosa.";
                                    this.setState({ showMessageCreateBusiness: true });
                                } else {
                                    if ((_.get(data, 'payload.data.status') === REQUEST_INVALID_INPUT)) {
                                        const validationsErrorFromServer = _.get(data, 'payload.data.data[0].detail');
                                        _.forEach(validationsErrorFromServer, (field) => {
                                            this.processValidation(field);
                                        });
                                    } else {
                                        typeMessage = "error";
                                        titleMessage = "Creación plan de negocio";
                                        message = "Señor usuario, ocurrió un error creando el plan de negocio.";
                                        this.setState({ showMessageCreateBusiness: true });
                                    }
                                }
                            }
                        }, (reason) => {
                            changeStateSaveData(false, "");
                            typeMessage = "error";
                            titleMessage = "Creación plan de negocio";
                            message = "Señor usuario, ocurrió un error creando el plan de negocio.";
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
        if (field) {
            switch (field.field) {
                case "opportunitiesAndThreats":
                    this.setState({ opportunitiesError: field.message[0] });
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        const { fields: { initialValidityDate, finalValidityDate }, selectsReducer, handleSubmit, reducerGlobal } = this.props;
        return (
            <form onSubmit={handleSubmit(this._submitCreateBusiness)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                className="my-custom-tab"
                style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                <span style={{ marginLeft: "20px" }}>Los campos marcados con asterisco (<span
                    style={{ color: "red" }}>*</span>) son obligatorios.</span>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <PermissionUserReports />
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
                                />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
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
                        />
                    </Col>
                </Row>
                <NeedBusiness />
                <AreaBusiness />
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
                        <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT} style={{
                            float: "right",
                            margin: "8px 0px 0px 8px",
                            position: "fixed",
                            backgroundColor: "#00B5AD"
                        }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                        </button>
                        <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED}
                            style={{ float: "right", margin: "8px 0px 0px 250px", position: "fixed" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar definitivo</span>
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
                <SweetAlertFocus
                    type="error"
                    show={this.state.showErrorSaveBusiness}
                    title="Error necesidades"
                    text="Señor usuario, para guardar un plan de negocio como definitivo debe agregar como mínimo una necesidad."
                    onConfirm={() => this.setState({ showErrorSaveBusiness: false })}
                />
                <SweetAlertFocus
                    type={typeMessage}
                    show={this.state.showMessageCreateBusiness}
                    title={titleMessage}
                    text={message}
                    onConfirm={this._closeMessageCreateBusiness}
                />
                <SweetAlertFocus
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
        createBusiness,
        changeStateSaveData,
        swtShowMessage,
        validateRangeDates,
        setConfidential
    }, dispatch);
}

function mapStateToProps({ clientInformacion, selectsReducer, reducerGlobal, confidentialReducer, usersPermission, needs, areas, navBar }, ownerProps) {
    return {
        clientInformacion,
        selectsReducer,
        reducerGlobal,
        confidentialReducer,
        usersPermission,
        needs,
        areas,
        navBar
    };
}

export default reduxForm({
    form: 'formBusinessPlanCreate',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormBusinessPlan);