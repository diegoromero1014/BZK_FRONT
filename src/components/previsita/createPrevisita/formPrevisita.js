import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { redirectUrl } from '../../globalComponents/actions';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import { PREVISIT_TYPE } from '../../selectsComponent/constants';
import { consultDataSelect, consultList, getMasterDataFields } from '../../selectsComponent/actions';
import ParticipantesCliente from '../../participantsVisitPre/participantesCliente';
import ParticipantesBancolombia from '../../participantsVisitPre/participantesBancolombia';
import ParticipantesOtros from '../../participantsVisitPre/participantesOtros';
import {
    SAVE_DRAFT, SAVE_PUBLISHED, TITLE_CONCLUSIONS_VISIT, TITLE_OTHERS_PARTICIPANTS,
    TITLE_BANC_PARTICIPANTS, TITLE_CLIENT_PARTICIPANTS, MESSAGE_SAVE_DATA, MESSAGE_ERROR,
    ALLOWS_NEGATIVE_INTEGER, ONLY_POSITIVE_INTEGER, VALUE_XSS_INVALID, REGEX_SIMPLE_XSS,
    VALUE_REQUIERED, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../../constantsGlobal';
import { LAST_PREVISIT_REVIEW } from '../../../constantsParameters';
import { consultParameterServer, formValidateKeyEnter, nonValidateEnter, htmlToText, validateValue, validateResponse, xssValidation } from '../../../actionsGlobal';
import { PROPUEST_OF_BUSINESS } from '../constants';
import { createPrevisit, validateDatePreVisit } from '../actions';
import Challenger from '../../methodologyChallenger/component';
import { changeStateSaveData } from '../../dashboard/actions';
import { MENU_CLOSED } from '../../navBar/constants';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import $ from 'jquery';
import RichText from '../../richText/richTextComponent';
import ToolTip from '../../toolTip/toolTipComponent';
import _ from 'lodash';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import numeral from 'numeral';

const fields = [];
var datePrevisitLastReview;
var titleMethodologyChallenger = "Enseñanza (Oportunidades – Retos): Diligencie de manera resumida los siguientes " +
    "campos. Recuerde que lo importante es la necesidad del cliente, por lo cual no debe hablar de Bancolombia hasta cuando se expone la solución a la situación del cliente.\n" +
    "No es necesario haber asistido previamente a la formación Challenger, el formato entrega las herramientas necesarias para su construcción.";

var titleMessagePendient = "En este campo se deberá registrar los pendientes quejas o reclamos que tenga el cliente y que podrán ser motivo de conversación en la reunión.";

var titleMessageTarget = "En este campo deberá registrar de manera clara cual es propósito de la reunión.\n\n" +
    "Si el tipo de visita es “propuesta comercial”, antes de responder deberá hacerse  las siguientes preguntas y/o reflexiones:\n\n" +
    "1. ¿Cuál es el insight (enseñanza) que desea llevarle al cliente?\n" +
    "a. ¿Por qué esta enseñanza hará pensar de manera distinta al cliente?\n" +
    "b. ¿Cómo crees que esta enseñanza llevará al cliente a la acción?\n" +
    "c. ¿Cómo esta enseñanza conduce hacia una solución que tiene el Grupo Bancolombia?\n\n" +
    "2. ¿Cuáles son los resultados esperados y en cuánto tiempo se verán materializados?";

var titleMessageTypePrevisit = "En este campo se deberá indicar la razón de la visita si es: seguimiento (mantenimiento de la relación con el cliente) o propuesta comercial (cuando lleva un insight o enseñanza al cliente).\n" +
    "Si el tipo de visita es propuesta comercial, se deberá responder la sección Metodología Challenger.";

var dateVisitLastReview;
var showMessageCreatePreVisit = false;
var typeMessage = "success";
var titleMessage = "";
var message = "";
var typeButtonClick;
var valueTypePrevisit = null;
var idTypeVisitAux = null;
var idTypeVisitAuxTwo = null;
var contollerErrorChangeType = false;

const validate = values => {
    const errors = {};
    return errors;
};

class FormPrevisita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showErrorSavePreVisit: false,
            typePreVisit: "",
            typePreVisitError: null,
            datePreVisit: new Date(),
            datePreVisitError: null,
            durationPreVisit: "",
            durationPreVisitError: false,
            lugarPrevisit: "",
            lugarPrevisitError: false,
            showConfirm: false,
            showConfirmChangeTypeVisit: false,
            activeItemTabBanc: '',
            activeItemTabClient: 'active',
            activeItemTabOther: '',
            targetPrevisit: "",
            targetPrevisitError: null,
            pendingPrevisit: "",
            pendingPrevisitError: "",
            clientTeach: "",
            clientTeachTouch: false,
            clientTeachError: "",
            adaptMessage: "",
            adaptMessageTouch: false,
            adaptMessageError: "",
            controlConversation: "",
            controlConversationTouch: false,
            controlConversationError: "",
            constructiveTension: "",
            constructiveTensionTouch: false,
            constructiveTensionError: "",
        }
        this._submitCreatePrevisita = this._submitCreatePrevisita.bind(this);
        this._changeTypePreVisit = this._changeTypePreVisit.bind(this);
        this._changeDatePreVisit = this._changeDatePreVisit.bind(this);
        this._closeMessageCreatePreVisit = this._closeMessageCreatePreVisit.bind(this);
        this._onCloseButton = this._onCloseButton.bind(this);
        this._closeConfirmCloseVisit = this._closeConfirmCloseVisit.bind(this);
        this._changeTargetPrevisit = this._changeTargetPrevisit.bind(this);
        this._changePendingPrevisit = this._changePendingPrevisit.bind(this);
        this._changeClientTeach = this._changeClientTeach.bind(this);
        this._changeControlConversation = this._changeControlConversation.bind(this);
        this._changeAdaptMessage = this._changeAdaptMessage.bind(this);
        this._changeConstructiveTension = this._changeConstructiveTension.bind(this);
        this._changeLugarPreVisit = this._changeLugarPreVisit.bind(this);
        this._closeConfirmChangeType = this._closeConfirmChangeType.bind(this);
        this._closeCancelConfirmChanType = this._closeCancelConfirmChanType.bind(this);
        this._changeDurationPreVisit = this._changeDurationPreVisit.bind(this);
        this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
    }

    _closeMessageCreatePreVisit() {
        if (typeMessage === "success") {
            this.setState({
                showMessageCreatePreVisit: false,
                dateVisit: ""
            });
            redirectUrl("/dashboard/clientInformation");
        } else {
            this.setState({
                showMessageCreatePreVisit: false
            });
        }
    }


    _handleBlurValueNumber(typeValidation, val, allowsDecimal, lengthDecimal) {
        //Elimino los caracteres no validos
        for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
            if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                output += val.toString().charAt(i)
            }
        }
        val = output;

        /* Si typeValidation = 2 es por que el valor puede ser negativo
         Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
         */
        var decimal = '';
        if (val.includes(".")) {
            var vectorVal = val.split(".");
            if (allowsDecimal) {
                val = vectorVal[0] + '.';
                if (vectorVal.length > 1) {
                    decimal = vectorVal[1].substring(0, lengthDecimal);
                }
            } else {
                val = vectorVal[0];
            }
        }

        if (typeValidation === ALLOWS_NEGATIVE_INTEGER) { //Realizo simplemente el formateo
            var pattern = /(-?\d+)(\d{2})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1.$2");
            }
            if (_.isNil(this.state.durationPreVisit)) {
                return (val + decimal);
            } else {
                this.setState({
                    durationPreVisit: val + decimal
                });
            }
        } else { //Valido si el valor es negativo o positivo
            var value = _.isNil(val) ? -1 : numeral(val).format('0');
            if (value >= 0) {
                pattern = /(-?\d+)(\d{2})/;
                while (pattern.test(val)) {
                    val = val.replace(pattern, "$1.$2");
                }
                if (_.isNil(this.state.durationPreVisit)) {
                    return (val + decimal);
                } else {
                    this.setState({
                        durationPreVisit: val + decimal
                    });
                }
            } else {
                if (_.isNil(this.state.durationPreVisit)) {
                    return "";
                } else {
                    this.setState({
                        durationPreVisit: ""
                    });
                }
            }
        }
    }

    _changeTypePreVisit(value) {
        if (value !== undefined && value !== "" && value !== null && value !== idTypeVisitAuxTwo && !contollerErrorChangeType) {
            if (idTypeVisitAux !== null && valueTypePrevisit !== null && valueTypePrevisit === PROPUEST_OF_BUSINESS) {
                contollerErrorChangeType = true;
                idTypeVisitAux = value;
                this.setState({
                    showConfirmChangeTypeVisit: true
                });
            } else {
                contollerErrorChangeType = true;
                idTypeVisitAux = value;
                this._closeConfirmChangeType();
            }
        }
        var lugarSelector = $('.txtLugar');
        var input = lugarSelector.find("input");
        input.focus();
    }

    _closeCancelConfirmChanType() {
        contollerErrorChangeType = false;
        this.setState({ showConfirmChangeTypeVisit: false });
    }

    _closeConfirmChangeType() {
        contollerErrorChangeType = false;
        const { selectsReducer } = this.props;
        idTypeVisitAuxTwo = idTypeVisitAux;
        const typeSeleted = _.filter(selectsReducer.get(PREVISIT_TYPE), ['id', parseInt(idTypeVisitAux)]);
        if (typeSeleted !== null && typeSeleted !== '' && typeSeleted !== undefined) {
            valueTypePrevisit = typeSeleted[0].key;
        }
        this.setState({
            typePreVisit: parseInt(idTypeVisitAux),
            showConfirmChangeTypeVisit: false,
            typePreVisitError: null,
            clientTeach: "",
            clientTeachTouch: false,
            clientTeachError: "",
            adaptMessage: "",
            adaptMessageTouch: false,
            adaptMessageError: "",
            controlConversation: "",
            controlConversationTouch: false,
            controlConversationError: "",
            constructiveTension: "",
            constructiveTensionTouch: false,
            constructiveTensionError: ""
        });
    }

    _changeDatePreVisit(value) {
        this.setState({
            datePreVisit: value,
            datePreVisitError: null
        });
    }

    _changeDatePreVisitOnBlur(value) {
        var date = value.target.value;
        if (date === '' || date === undefined || date === null) {
            this.setState({
                dateVisitError: "Debe seleccionar una opción"
            });
        }
    }

    _changeLugarPreVisit(value) {
        this.setState({
            lugarPrevisit: value,
            lugarPrevisitError: null
        });
    }

    _changeDurationPreVisit(value) {
        this.setState({
            durationPreVisit: value,
            durationPreVisitError: null
        });
    }

    _changeTargetPrevisit(value) {
        this.setState({
            targetPrevisit: value,
            targetPrevisitError: null
        });
    }

    _changePendingPrevisit(value) {
        this.setState({
            pendingPrevisit: value,
            pendingPrevisitError: null
        });
    }

    _changeClientTeach(value) {
        this.setState({
            clientTeach: value,
            clientTeachTouch: true,
            clientTeachError: null
        });
    }

    _changeAdaptMessage(value) {
        this.setState({
            adaptMessage: value,
            adaptMessageTouch: true,
            adaptMessageError: null
        });
    }

    _changeControlConversation(value) {
        this.setState({
            controlConversation: value,
            controlConversationTouch: true,
            controlConversationError: null
        });
    }

    _changeConstructiveTension(value) {
        this.setState({
            constructiveTension: value,
            constructiveTensionTouch: true,
            constructiveTensionError: null
        });
    }

   

    _clickSeletedTab(tab) {
        if (tab === 1) {
            this.setState({
                activeItemTabClient: 'active',
                activeItemTabBanc: '',
                activeItemTabOther: ''
            });
        } else if (tab === 2) {
            this.setState({
                activeItemTabClient: '',
                activeItemTabBanc: 'active',
                activeItemTabOther: ''
            });
        } else {
            this.setState({
                activeItemTabBanc: '',
                activeItemTabClient: '',
                activeItemTabOther: 'active'
            });
        }
    }

    _onCloseButton() {
        message = "¿Está seguro que desea salir de la pantalla de creación de previsita?";
        titleMessage = "Confirmación salida";
        this.setState({ showConfirm: true });
    }

    _closeConfirmCloseVisit() {
        this.setState({ showConfirm: false });
        redirectUrl("/dashboard/clientInformation");
    }

    _submitCreatePrevisita() {
        const { participants, createPrevisit, changeStateSaveData, validateDatePreVisit, swtShowMessage } = this.props;
        var errorInForm = false;
        var errorMessage = "Señor usuario, debe ingresar todos los campos obligatorios.";
        if (this.state.typePreVisit === null || this.state.typePreVisit === undefined || this.state.typePreVisit === "") {
            errorInForm = true;
            this.setState({
                typePreVisitError: "Debe seleccionar una opción"
            });
        }
        if (this.state.datePreVisit === null || this.state.datePreVisit === undefined || this.state.datePreVisit === "") {
            errorInForm = true;
            this.setState({
                datePreVisitError: "Debe seleccionar una opción"
            });
        }
        if (this.state.lugarPrevisit === null || this.state.lugarPrevisit === undefined || this.state.lugarPrevisit === "") {
            errorInForm = true;
            this.setState({
                lugarPrevisitError: "Debe ingresar un valor"
            });
        } else if (xssValidation(this.state.lugarPrevisit)) {
            errorInForm = true;
            this.setState({
                lugarPrevisitError: VALUE_XSS_INVALID
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        if (this.state.durationPreVisit === null || this.state.durationPreVisit === undefined || this.state.durationPreVisit === "") {
            errorInForm = true;
            this.setState({
                durationPreVisitError: "Debe ingresar un valor"
            });

        }



        if (typeButtonClick === SAVE_PUBLISHED) {
            if (_.isEmpty(htmlToText(this.state.targetPrevisit)) || this.state.targetPrevisit === null || this.state.targetPrevisit === undefined || this.state.targetPrevisit === "") {
                errorInForm = true;
                this.setState({
                    targetPrevisitError: "Debe ingresar un valor"
                });
            } else if (xssValidation(this.state.targetPrevisit, true)) {
                errorInForm = true;
                this.setState({
                    targetPrevisitError: VALUE_XSS_INVALID
                });
                errorMessage = REGEX_SIMPLE_XSS_MESAGE;
            }
        }

        //Validaciones de la metodología challenger y si estoy guardando como definitivo
        if (valueTypePrevisit === PROPUEST_OF_BUSINESS && typeButtonClick === SAVE_PUBLISHED) {

            if (_.isEmpty(htmlToText(this.state.clientTeach)) || this.state.clientTeach === null || this.state.clientTeach === undefined || this.state.clientTeach === "") {
                errorInForm = true;
                this.setState({
                    clientTeachError: "Debe ingresar un valor",
                    clientTeachTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.adaptMessage)) || this.state.adaptMessage === null || this.state.adaptMessage === undefined || this.state.adaptMessage === "") {
                errorInForm = true;
                this.setState({
                    adaptMessageError: "Debe ingresar un valor",
                    adaptMessageTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.controlConversation)) || this.state.controlConversation === null || this.state.controlConversation === undefined || this.state.controlConversation === "") {
                errorInForm = true;
                this.setState({
                    controlConversationError: "Debe ingresar un valor",
                    controlConversationTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.constructiveTension)) || this.state.constructiveTension === null || this.state.constructiveTension === undefined || this.state.constructiveTension === "") {
                errorInForm = true;
                this.setState({
                    constructiveTensionError: "Debe ingresar un valor",
                    constructiveTensionTouch: true
                });
            }
            
        } else {
            this.setState({
                clientTeachError: null,
                adaptMessageError: null,
                controlConversationError: null,
                constructiveTensionError: null
            });
        }


        /**
         * Validaciones texto enriquecido
         */
        
        if (xssValidation(this.state.targetPrevisit, true)) {
            errorInForm = true;
            this.setState({
                targetPrevisitError: VALUE_XSS_INVALID
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        
        if (xssValidation(this.state.pendingPrevisit, true)) {
            errorInForm = true;
            this.setState({
                pendingPrevisitError: VALUE_XSS_INVALID
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        if (xssValidation(this.state.clientTeach, true)) {
            errorInForm = true;
            this.setState({
                clientTeachError: VALUE_XSS_INVALID,
                clientTeachTouch: true
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        if (xssValidation(this.state.adaptMessage, true)) {
            errorInForm = true;
            this.setState({
                adaptMessageError: VALUE_XSS_INVALID,
                adaptMessageTouch: true
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        if (xssValidation(this.state.controlConversation, true)) {
            errorInForm = true;
            this.setState({
                controlConversationError: VALUE_XSS_INVALID,
                controlConversationTouch: true
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        if (xssValidation(this.state.constructiveTension, true)) {
            errorInForm = true;
            this.setState({
                constructiveTensionError: VALUE_XSS_INVALID,
                constructiveTensionTouch: true
            });
            errorMessage = REGEX_SIMPLE_XSS_MESAGE;
        }

        



        if (!errorInForm) {
            var dataBanco = [];
            _.map(participants.toArray(),
                function (participant) {
                    if (participant.tipoParticipante === "banco") {
                        var data = {
                            "id": null,
                            "employee": participant.idParticipante,
                            "order": participant.order
                        }
                        dataBanco.push(data)
                    }
                }
            );
            if (dataBanco.length > 0 && dataBanco[0] === undefined) {
                dataBanco = [];
            }
            var dataClient = [];
            _.map(participants.toArray(),
                function (participant) {
                    if (participant.tipoParticipante === "client") {
                        var data = {
                            "id": null,
                            "contact": participant.idParticipante,
                            "order": participant.order
                        }
                        dataClient.push(data);
                    }
                }
            );
            if (dataClient.length > 0 && dataClient[0] === undefined) {
                dataClient = [];
            }
            //Valido que haya por los menos 1 usuairo por parte del banco o si
            //la previsita se está guardando como borrador
            if ((dataBanco.length > 0) || typeButtonClick === SAVE_DRAFT) {
                var dataOthers = [];
                _.map(participants.toArray(),
                    function (participant) {
                        if (participant.tipoParticipante === "other") {
                            var data = {
                                "id": null,
                                "name": participant.nombreParticipante.replace('-', '').trim(),
                                "position": participant.cargo.replace('-', '').trim(),
                                "company": participant.empresa.replace('-', '').trim(),
                                "order": participant.order
                            }
                            dataOthers.push(data);
                        }
                    }
                );
                if (dataOthers.length > 0 && dataOthers[0] === undefined) {
                    dataOthers = [];
                }
                var previsitJson = {
                    "id": null,
                    "client": window.localStorage.getItem('idClientSelected'),
                    "visitTime": parseInt(moment(this.state.datePreVisit).format('x')),
                    "participatingContacts": dataClient.length === 0 ? null : dataClient,
                    "participatingEmployees": dataBanco.length === 0 ? null : dataBanco,
                    "relatedEmployees": dataOthers.length === 0 ? null : dataOthers,
                    "principalObjective": this.state.targetPrevisit,
                    "documentType": this.state.typePreVisit,
                    "visitLocation": this.state.lugarPrevisit,
                    "observations": this.state.pendingPrevisit,
                    "clientTeach": this.state.clientTeach,
                    "adaptMessage": this.state.adaptMessage,
                    "controlConversation": this.state.controlConversation,
                    "constructiveTension": this.state.constructiveTension,
                    "documentStatus": typeButtonClick,
                    "endTime": this.state.durationPreVisit
                }
                validateDatePreVisit(parseInt(moment(this.state.datePreVisit).format('x')), this.state.durationPreVisit).then((data) => {
                    if (validateResponse(data)) {
                        const response = _.get(data, 'payload.data.data', false);
                        if (!response.allowClientPreVisit) {
                            swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', 'Señor usuario, ya existe una previsita registrada en esta fecha y hora para el mismo cliente.');
                        } else {
                            if (!response.allowUserPreVisit) {
                                swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', 'Señor usuario, ya existe una previsita registrada en esta fecha y hora para el mismo usuario.');
                            } else {
                                changeStateSaveData(true, MESSAGE_SAVE_DATA);
                                createPrevisit(previsitJson).then((data) => {
                                    changeStateSaveData(false, "");
                                    if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                                        redirectUrl("/login");
                                    } else {
                                        if ((_.get(data, 'payload.data.status') === 200)) {
                                            typeMessage = "success";
                                            titleMessage = "Creación previsita";
                                            message = "Señor usuario, la previsita se creó de forma exitosa.";
                                            this.setState({ showMessageCreatePreVisit: true });
                                        } else {
                                            typeMessage = "error";
                                            titleMessage = "Creación previsita";
                                            message = "Señor usuario, ocurrió un error creando la previsita.";
                                            this.setState({ showMessageCreatePreVisit: true });
                                        }
                                    }
                                }, (reason) => {
                                    changeStateSaveData(false, "");
                                    typeMessage = "error";
                                    titleMessage = "Creación previsita";
                                    message = "Señor usuario, ocurrió un error creando la previsita.";
                                    this.setState({ showMessageCreateVisit: true });
                                });
                            }
                        }
                    }
                });
            } else {
                
                swtShowMessage('error',"Error participantes","Señor usuario, para guardar una previsita como mínimo debe agregar un participante por parte del Grupo Bancolombia.");
            }
        } else {
            typeMessage = "error";
            titleMessage = "Campos obligatorios";
            message = errorMessage;
            this.setState({ showMessageCreatePreVisit: true });
        }
    }

    componentWillMount() {
        valueTypePrevisit = null;
        idTypeVisitAux = null;
        idTypeVisitAuxTwo = null;
        contollerErrorChangeType = false;
        const { nonValidateEnter, clientInformacion, getMasterDataFields, consultParameterServer } = this.props;
        nonValidateEnter(true);
        const infoClient = clientInformacion.get('responseClientInfo');
        valueTypePrevisit = null;
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        } else {
            getMasterDataFields([PREVISIT_TYPE]);
            consultParameterServer(LAST_PREVISIT_REVIEW).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    datePrevisitLastReview = JSON.parse(data.payload.data.parameter).value;
                    datePrevisitLastReview = moment(datePrevisitLastReview, "DD/MM/YYYY").locale('es').format("DD MMM YYYY");
                }
            });
        }
    }

    render() {
        const {
            fields: { clientTeach, adaptMessage, controlConversation, constructiveTension },
            clientInformacion, selectsReducer, handleSubmit, reducerGlobal, navBar
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this._submitCreatePrevisita)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                className="my-custom-tab"
                style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                <span style={{ marginLeft: "20px" }}>Los campos marcados con asterisco (<span
                    style={{ color: "red" }}>*</span>) son obligatorios.</span>
                <Row style={{ padding: "10px 10px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "20px" }}> Datos de visita</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={6} md={3} lg={3}>
                        <div style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Tipo de visita (</span><span style={{ color: "red" }}>*</span>)
                                <ToolTip text={titleMessageTypePrevisit}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
                                </ToolTip>
                            </dt>
                            <ComboBox
                                name="tipoVisita"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                value={this.state.typePreVisit}
                                touched={true}
                                error={this.state.typePreVisitError}
                                onChange={val => this._changeTypePreVisit(val)}
                                onBlur={() => ''}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(PREVISIT_TYPE) || []}
                            />
                        </div>
                    </Col>
                    <Col xs={6} md={3} lg={3} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Fecha - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)
                        </dt>
                        <dt>
                            <DateTimePickerUi
                                culture='es'
                                format={"DD/MM/YYYY hh:mm a"}
                                time={true}
                                value={this.state.datePreVisit}
                                touched={true}
                                error={this.state.datePreVisitError}
                                onChange={val => this._changeDatePreVisit(val)}
                                onBlur={val => this._changeDatePreVisitOnBlur(val)} />
                        </dt>
                    </Col>
                    <Col xs={6} md={3} lg={3} >
                        <dt>
                            <span>Duración previsita - horas (</span><span style={{ color: "red" }}>*</span>)
                        </dt>
                        <dt>
                            <Input
                                name="txtDuracion"
                                value={this.state.durationPreVisit}
                                min={1}
                                max="4"
                                touched={true}
                                placeholder="Duración previsita"
                                error={this.state.durationPreVisitError}
                                type="text"
                                onChange={val => this._changeDurationPreVisit(val)}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, val, true, 2)}
                            />
                        </dt>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <dt><span>Lugar (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <dt style={{ marginRight: "17px" }}>
                            <Input
                                value={this.state.lugarPrevisit}
                                touched={true}
                                error={this.state.lugarPrevisitError}
                                name="txtLugar"
                                type="text"
                                title="La longitud máxima de caracteres es de 150"
                                max="150"
                                onChange={val => this._changeLugarPreVisit(val)}
                            />
                        </dt>
                    </Col>
                </Row>

                <Row style={{ padding: "20px 23px 20px 20px" }}>
                    <Col xs>
                        <div className="ui top attached tabular menu" style={{ width: "100%" }}>
                            <a className={`${this.state.activeItemTabClient} item`} style={{ width: "33%" }}
                                data-tab="first" onClick={this._clickSeletedTab.bind(this, 1)}>Participantes en la
                                reunión por parte del cliente
                                <ToolTip text={TITLE_CLIENT_PARTICIPANTS}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                </ToolTip>
                            </a>
                            <a className={`${this.state.activeItemTabBanc} item`} style={{ width: "40%" }}
                                data-tab="second" onClick={this._clickSeletedTab.bind(this, 2)}>Participantes en la
                                reunión por parte del Grupo Bancolombia
                                <ToolTip text={TITLE_BANC_PARTICIPANTS}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                </ToolTip>
                            </a>
                            <a className={`${this.state.activeItemTabOther} item`} style={{ width: "26%" }}
                                data-tab="third" onClick={this._clickSeletedTab.bind(this, 3)}>Otros participantes en la
                                reunión
                                <ToolTip text={TITLE_OTHERS_PARTICIPANTS}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                </ToolTip>
                            </a>
                        </div>
                        <div className={`ui bottom attached ${this.state.activeItemTabClient} tab segment`}
                            data-tab="first">
                            <ParticipantesCliente />
                        </div>
                        <div className={`ui bottom attached ${this.state.activeItemTabBanc} tab segment`}
                            data-tab="second">
                            <ParticipantesBancolombia />
                        </div>
                        <div className={`ui bottom attached ${this.state.activeItemTabOther} tab segment`}
                            data-tab="third">
                            <ParticipantesOtros />
                        </div>
                    </Col>
                </Row>

                <Row style={{ padding: "20px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
                            <i className="book icon" style={{ fontSize: "18px" }} />
                            <span style={{ fontSize: "20px" }}> Objetivo de la reunión (<span
                                style={{ color: "red" }}>*</span>)</span>
                            <ToolTip text={titleMessageTarget}>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                            </ToolTip>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <RichText
                            name="targetPrevisit"
                            value={this.state.targetPrevisit}
                            touched={true}
                            onChange={val => this._changeTargetPrevisit(val)}
                            error={this.state.targetPrevisitError}
                            title="Ingrese el objetivo de la reunión"
                            style={{ width: '100%', height: '178px' }}
                        />
                    </Col>
                </Row>

                {valueTypePrevisit === PROPUEST_OF_BUSINESS &&
                    <div>
                        <Row style={{ padding: "10px 10px 20px 20px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                                    <div className="tab-content-row"
                                        style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                                    <i className="browser icon" style={{ fontSize: "20px" }} />
                                    <span style={{ fontSize: "20px" }}> Metodología Challenger </span>
                                    <ToolTip text={titleMethodologyChallenger}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                                    </ToolTip>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 23px 20px 20px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <Challenger
                                    clientTeach={this.state.clientTeach}
                                    clientTeachTouch={this.state.clientTeachTouch}
                                    clientTeachError={this.state.clientTeachError}
                                    onChangeClientTeach={val => this._changeClientTeach(val)}
                                    adaptMessage={this.state.adaptMessage}
                                    adaptMessageTouch={this.state.adaptMessageTouch}
                                    adaptMessageError={this.state.adaptMessageError}
                                    onChangeAdaptMessage={val => this._changeAdaptMessage(val)}
                                    controlConversation={this.state.controlConversation}
                                    controlConversationTouch={this.state.controlConversationTouch}
                                    controlConversationError={this.state.controlConversationError}
                                    onChangeControlConversation={val => this._changeControlConversation(val)}
                                    constructiveTension={this.state.constructiveTension}
                                    constructiveTensionTouch={this.state.constructiveTensionTouch}
                                    constructiveTensionError={this.state.constructiveTensionError}
                                    onChangeConstructiveTension={val => this._changeConstructiveTension(val)}
                                    
                                />
                            </Col>
                        </Row>
                    </div>
                }
                <Row style={{ padding: "20px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
                            <i className="book icon" style={{ fontSize: "18px" }} />
                            <span style={{ fontSize: "20px" }}> Pendientes, quejas y reclamos </span>
                            <ToolTip text={titleMessagePendient}>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                            </ToolTip>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <RichText
                            name="pendingPrevisit"
                            value={this.state.pendingPrevisit}
                            touched={true}
                            onChange={val => this._changePendingPrevisit(val)}
                            error={this.state.pendingPrevisitError}
                            title="Ingrese pendientes, quejas y reclamos"
                            style={{ width: '100%', height: '178px' }}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ textAlign: "left", marginTop: "20px", marginBottom: "20px", marginLeft: "20px" }}>
                            <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha última revisión formato previsita: </span><span
                                style={{ marginLeft: "0px", color: "#818282" }}>{datePrevisitLastReview}</span>
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
                
                <SweetAlert
                    type={typeMessage}
                    show={this.state.showMessageCreatePreVisit}
                    title={titleMessage}
                    text={message}
                    onConfirm={this._closeMessageCreatePreVisit}
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
                    onConfirm={this._closeConfirmCloseVisit} />
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmChangeTypeVisit}
                    title="Tipo de visita"
                    text="Señor usuario, si cambia el “Tipo de visita” la información diligenciada en la sección Metodología Challenger se borrará. ¿Está seguro que desea cambiar el Tipo de visita? "
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={this._closeCancelConfirmChanType}
                    onConfirm={this._closeConfirmChangeType} />
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getMasterDataFields,
        createPrevisit,
        validateDatePreVisit,
        consultParameterServer,
        changeStateSaveData,
        nonValidateEnter,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ clientInformacion, selectsReducer, participants, reducerGlobal, navBar }, ownerProps) {
    return {
        clientInformacion,
        selectsReducer,
        participants,
        reducerGlobal,
        navBar
    };
}

export default reduxForm({
    form: 'submitValidation',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormPrevisita);