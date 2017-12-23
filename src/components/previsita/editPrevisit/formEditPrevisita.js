import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import { redirectUrl } from "../../globalComponents/actions";
import { Col, Row } from "react-flexbox-grid";
import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import { PREVISIT_TYPE } from "../../selectsComponent/constants";
import { getMasterDataFields } from "../../selectsComponent/actions";
import ParticipantesCliente from "../../participantsVisitPre/participantesCliente";
import ParticipantesBancolombia from "../../participantsVisitPre/participantesBancolombia";
import ParticipantesOtros from "../../participantsVisitPre/participantesOtros";
import {
    EDITAR,
    MESSAGE_SAVE_DATA,
    SAVE_DRAFT,
    SAVE_PUBLISHED,
    TITLE_BANC_PARTICIPANTS,
    TITLE_CLIENT_PARTICIPANTS,
    TITLE_OTHERS_PARTICIPANTS,
    MESSAGE_ERROR,
    ALLOWS_NEGATIVE_INTEGER, ONLY_POSITIVE_INTEGER, VALUE_XSS_INVALID, REGEX_SIMPLE_XSS,
    VALUE_REQUIERED
} from "../../../constantsGlobal";
import { consultParameterServer, formValidateKeyEnter, htmlToText, nonValidateEnter, validateResponse } from "../../../actionsGlobal";
import { PROPUEST_OF_BUSINESS } from "../constants";
import { addParticipant, addListParticipant } from "../../participantsVisitPre/actions";
import { createPrevisit, detailPrevisit, pdfDescarga, validateDatePreVisit } from "../actions";
import Challenger from "../../methodologyChallenger/component";
import { changeStateSaveData } from "../../dashboard/actions";
import { MENU_CLOSED } from "../../navBar/constants";
import SweetAlert from "sweetalert-react";
import moment from "moment";
import $ from "jquery";
import RichText from "../../richText/richTextComponent";
import _ from "lodash";
import Tooltip from "../../toolTip/toolTipComponent";
import { showLoading } from "../../loading/actions";
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

let dateVisitLastReview;
let showMessageCreatePreVisit = false;
let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick;
let valueTypePrevisit = null;
let idTypeVisitAux = null;
let idTypeVisitAuxTwo = null;
let contollerErrorChangeType = false;

let fechaModString = '';
let fechaCreateString = '';
let createdBy = '';
let updatedBy = '';
let positionCreatedBy = '';
let positionUpdatedBy = '';
let firstLoadInfo = false;

const validate = values => {
    const errors = {};
    return errors;
};

class FormEditPrevisita extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: "",
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
            acondicionamiento: "",
            acondicionamientoTouch: false,
            acondicionamientoError: "",
            replanteamiento: "",
            replanteamientoTouch: false,
            replanteamientoError: "",
            ahogamiento: "",
            ahogamientoTouch: false,
            ahogamientoError: "",
            impacto: "",
            impactoTouch: false,
            impactoError: "",
            nuevoModo: "",
            nuevoModoTouch: false,
            nuevoModoError: "",
            nuestraSolucion: "",
            nuestraSolucionTouch: false,
            nuestraSolucionError: "",
        };
        this._submitCreatePrevisita = this._submitCreatePrevisita.bind(this);
        this._changeTypePreVisit = this._changeTypePreVisit.bind(this);
        this._changeDatePreVisit = this._changeDatePreVisit.bind(this);
        this._closeMessageCreatePreVisit = this._closeMessageCreatePreVisit.bind(this);
        this._onCloseButton = this._onCloseButton.bind(this);
        this._closeConfirmCloseVisit = this._closeConfirmCloseVisit.bind(this);
        this._changeTargetPrevisit = this._changeTargetPrevisit.bind(this);
        this._changePendingPrevisit = this._changePendingPrevisit.bind(this);
        this._changeAcondicionamiento = this._changeAcondicionamiento.bind(this);
        this._changeAhogamiento = this._changeAhogamiento.bind(this);
        this._changeReplanteamiento = this._changeReplanteamiento.bind(this);
        this._changeImpacto = this._changeImpacto.bind(this);
        this._changeNuevoModo = this._changeNuevoModo.bind(this);
        this._changeNuestraSolucion = this._changeNuestraSolucion.bind(this);
        this._editPreVisit = this._editPreVisit.bind(this);
        this._onClickPDF = this._onClickPDF.bind(this);
        this._changeLugarPreVisit = this._changeLugarPreVisit.bind(this);
        this._closeConfirmChangeType = this._closeConfirmChangeType.bind(this);
        this._closeCancelConfirmChanType = this._closeCancelConfirmChanType.bind(this);
        this._changeDurationPreVisit = this._changeDurationPreVisit.bind(this);
        this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
    }

    _editPreVisit() {
        this.setState({
            showMessage: false,
            isEditable: !this.state.isEditable
        });
    }

    _onClickPDF() {
        const { pdfDescarga, id } = this.props;
        pdfDescarga(window.localStorage.getItem('idClientSelected'), id);
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
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1,$2");
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
                pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(val)) {
                    val = val.replace(pattern, "$1,$2");
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
        if (value !== undefined && value !== "" && value !== null && value !== idTypeVisitAuxTwo && !contollerErrorChangeType && firstLoadInfo) {
            if (valueTypePrevisit === PROPUEST_OF_BUSINESS) {
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
        } else {
            firstLoadInfo = true;
        }
        let lugarSelector = $('.txtLugar');
        let input = lugarSelector.find("input");
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
            acondicionamiento: "",
            acondicionamientoTouch: false,
            acondicionamientoError: "",
            replanteamiento: "",
            replanteamientoTouch: false,
            replanteamientoError: "",
            ahogamiento: "",
            ahogamientoTouch: false,
            ahogamientoError: "",
            impacto: "",
            impactoTouch: false,
            impactoError: "",
            nuevoModo: "",
            nuevoModoTouch: false,
            nuevoModoError: "",
            nuestraSolucion: "",
            nuestraSolucionTouch: false,
            nuestraSolucionError: "",
        });
    }

    _changeDatePreVisit(value) {
        this.setState({
            datePreVisit: value,
            datePreVisitError: null
        });
    }

    _changeDatePreVisitOnBlur(value) {
        let date = value.target.value;
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
            pendingPrevisit: value
        });
    }

    _changeAcondicionamiento(value) {
        this.setState({
            acondicionamiento: value,
            acondicionamientoTouch: true,
            acondicionamientoError: null
        });
    }

    _changeReplanteamiento(value) {
        this.setState({
            replanteamiento: value,
            replanteamientoTouch: true,
            replanteamientoError: null
        });
    }

    _changeAhogamiento(value) {
        this.setState({
            ahogamiento: value,
            ahogamientoTouch: true,
            ahogamientoError: null
        });
    }

    _changeImpacto(value) {
        this.setState({
            impacto: value,
            impactoTouch: true,
            impactoError: null
        });
    }

    _changeNuevoModo(value) {
        this.setState({
            nuevoModo: value,
            nuevoModoTouch: true,
            nuevoModoError: null
        });
    }

    _changeNuestraSolucion(value) {
        this.setState({
            nuestraSolucion: value,
            nuestraSolucionTouch: true,
            nuestraSolucionError: null
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
        message = "¿Está seguro que desea salir de la pantalla de edición de previsita?";
        titleMessage = "Confirmación salida";
        this.setState({ showConfirm: true });
    }

    _closeConfirmCloseVisit() {
        this.setState({ showConfirm: false });
        redirectUrl("/dashboard/clientInformation");
    }

    _submitCreatePrevisita() {
        const { participants, createPrevisit, changeStateSaveData, id, validateDatePreVisit, swtShowMessage } = this.props;
        let errorInForm = false;
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
        }
        if (typeButtonClick === SAVE_PUBLISHED) {
            if (this.state.durationPreVisit === null || this.state.durationPreVisit === undefined || this.state.durationPreVisit === "") {
                errorInForm = true;
                this.setState({
                    durationPreVisitError: "Debe ingresar un valor"
                });
            }
        }
        if (typeButtonClick === SAVE_PUBLISHED) {
            if (_.isEmpty(htmlToText(this.state.targetPrevisit)) || this.state.targetPrevisit === null || this.state.targetPrevisit === undefined || this.state.targetPrevisit === "") {
                errorInForm = true;
                this.setState({
                    targetPrevisitError: "Debe ingresar un valor"
                });
            }
        }

        //Validaciones de la metodología challenger y si estoy guardando como definitivo
        if (valueTypePrevisit === PROPUEST_OF_BUSINESS && typeButtonClick === SAVE_PUBLISHED) {
            if (_.isEmpty(htmlToText(this.state.acondicionamiento)) || this.state.acondicionamiento === null || this.state.acondicionamiento === undefined || this.state.acondicionamiento === "") {
                errorInForm = true;
                this.setState({
                    acondicionamientoError: "Debe ingresar un valor",
                    acondicionamientoTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.replanteamiento)) || this.state.replanteamiento === null || this.state.replanteamiento === undefined || this.state.replanteamiento === "") {
                errorInForm = true;
                this.setState({
                    replanteamientoError: "Debe ingresar un valor",
                    replanteamientoTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.ahogamiento)) || this.state.ahogamiento === null || this.state.ahogamiento === undefined || this.state.ahogamiento === "") {
                errorInForm = true;
                this.setState({
                    ahogamientoError: "Debe ingresar un valor",
                    ahogamientoTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.impacto)) || this.state.impacto === null || this.state.impacto === undefined || this.state.impacto === "") {
                errorInForm = true;
                this.setState({
                    impactoError: "Debe ingresar un valor",
                    impactoTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.nuevoModo)) || this.state.nuevoModo === null || this.state.nuevoModo === undefined || this.state.nuevoModo === "") {
                errorInForm = true;
                this.setState({
                    nuevoModoError: "Debe ingresar un valor",
                    nuevoModoTouch: true
                });
            }
            if (_.isEmpty(htmlToText(this.state.nuestraSolucion)) || this.state.nuestraSolucion === null || this.state.nuestraSolucion === undefined || this.state.nuestraSolucion === "") {
                errorInForm = true;
                this.setState({
                    nuestraSolucionError: "Debe ingresar un valor",
                    nuestraSolucionTouch: true
                });
            }
        } else {
            this.setState({
                acondicionamientoError: null,
                replanteamientoError: null,
                ahogamientoError: null,
                impactoError: null,
                nuevoModoError: null,
                nuestraSolucionError: null
            });
        }
        if (!errorInForm) {
            let dataBanco = [];
            _.map(participants.toArray(),
                function (participant) {
                    if (participant.tipoParticipante === "banco") {
                        let data = {
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

            let dataClient = [];
            _.map(participants.toArray(),
                function (participant) {
                    if (participant.tipoParticipante === "client") {
                        let data = {
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
                let dataOthers = [];
                _.map(participants.toArray(),
                    function (participant) {
                        if (participant.tipoParticipante === "other") {
                            const data = {
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
                const previsitJson = {
                    "id": id,
                    "client": window.localStorage.getItem('idClientSelected'),
                    "visitTime": parseInt(moment(this.state.datePreVisit).format('x')),
                    "participatingContacts": dataClient.length === 0 ? null : dataClient,
                    "participatingEmployees": dataBanco.length === 0 ? null : dataBanco,
                    "relatedEmployees": dataOthers.length === 0 ? null : dataOthers,
                    "principalObjective": this.state.targetPrevisit,
                    "documentType": this.state.typePreVisit,
                    "visitLocation": this.state.lugarPrevisit,
                    "observations": this.state.pendingPrevisit,
                    "conditioning": this.state.acondicionamiento,
                    "rethinking": this.state.replanteamiento,
                    "rationalDrowning": this.state.ahogamiento,
                    "emotionalImpact": this.state.impacto,
                    "newWay": this.state.nuevoModo,
                    "ourSolution": this.state.nuestraSolucion,
                    "documentStatus": typeButtonClick,
                    "endTime": this.state.durationPreVisit
                };

                validateDatePreVisit(parseInt(moment(this.state.datePreVisit).format('x')), this.state.durationPreVisit).then((data) => {
                    if (validateResponse(data)) {
                        const response = _.get(data, 'payload.data.data', false);
                        if (!response.allowClientPreVisit) {
                            swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', 'Señor usuario, ya existe una previsita registrada en esta fecha para el mismo cliente, por favor complemente el informe ya creado o modifique la fecha.');
                        } else {
                            if (!response.allowUserPreVisit) {
                                swtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', 'Señor usuario, ya existe una previsita registrada en esta fecha para el mismo usuario, por favor complemente el informe ya creado o modifique la fecha.');
                            } else {
                                changeStateSaveData(true, MESSAGE_SAVE_DATA);
                                createPrevisit(previsitJson).then((data) => {
                                    changeStateSaveData(false, "");
                                    if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                                        redirectUrl("/login");
                                    } else {
                                        if ((_.get(data, 'payload.data.status') === 200)) {
                                            typeMessage = "success";
                                            titleMessage = "Edición previsita";
                                            message = "Señor usuario, la previsita se editó de forma exitosa.";
                                            this.setState({ showMessageCreatePreVisit: true });
                                        } else {
                                            typeMessage = "error";
                                            titleMessage = "Edición previsita";
                                            message = "Señor usuario, ocurrió un error editando la previsita.";
                                            this.setState({ showMessageCreatePreVisit: true });
                                        }
                                    }
                                }, (reason) => {
                                    changeStateSaveData(false, "");
                                    typeMessage = "error";
                                    titleMessage = "Edición previsita";
                                    message = "Señor usuario, ocurrió un error editando la previsita.";
                                    this.setState({ showMessageCreatePreVisit: true });
                                });
                            }
                        }
                    }
                });
            } else {
                this.setState({ showErrorSavePreVisit: true });
            }
        } else {
            typeMessage = "error";
            titleMessage = "Campos obligatorios";
            message = "Señor usuario, debe ingresar todos los campos obligatorios.";
            this.setState({ showMessageCreatePreVisit: true });
        }
    }

    componentWillMount() {
        firstLoadInfo = false;
        valueTypePrevisit = null;
        idTypeVisitAux = null;
        idTypeVisitAuxTwo = null;
        contollerErrorChangeType = false;
        const { nonValidateEnter, clientInformacion, getMasterDataFields, id, detailPrevisit, addParticipant, consultParameterServer, showLoading } = this.props;
        nonValidateEnter(true);
        const infoClient = clientInformacion.get('responseClientInfo');
        if (_.isEmpty(infoClient)) {
            redirectUrl("/dashboard/clientInformation");
        } else {
            getMasterDataFields([PREVISIT_TYPE]);
            showLoading(true, 'Cargando...');
            detailPrevisit(id).then((result) => {
                const { fields: { participantesCliente }, addListParticipant, addParticipant, visitReducer, contactsByClient } = this.props;
                let part = result.payload.data.data;
                let listParticipants = [];
                datePrevisitLastReview = moment(part.reviewedDate, "x").locale('es').format("DD MMM YYYY");
                valueTypePrevisit = part.keyDocumentType;
                this.setState({
                    typePreVisit: part.documentType,
                    datePreVisit: new Date(moment(part.visitTime, "x")),
                    targetPrevisit: part.principalObjective === null ? "" : part.principalObjective,
                    pendingPrevisit: part.observations === null ? "" : part.observations,
                    lugarPrevisit: part.visitLocation === null ? "" : part.visitLocation,

                    acondicionamiento: part.conditioning === null ? "" : part.conditioning,
                    replanteamiento: part.rethinking === null ? "" : part.rethinking,
                    ahogamiento: part.rationalDrowning === null ? "" : part.rationalDrowning,
                    impacto: part.emotionalImpact === null ? "" : part.emotionalImpact,
                    nuevoModo: part.newWay === null ? "" : part.newWay,
                    nuestraSolucion: part.ourSolution === null ? "" : part.ourSolution,
                    durationPreVisit: part.endTime === null ? "" : part.endTime
                });

                //Adicionar participantes por parte del cliente
                _.forIn(part.participatingContacts, function (value, key) {
                    const uuid = _.uniqueId('participanClient_');
                    let clientParticipant = {
                        tipoParticipante: 'client',
                        idParticipante: value.contact,
                        nombreParticipante: value.contactName,
                        cargo: value.contactPositionName === null || value.contactPositionName === undefined || value.contactPositionName === '' ? ''
                            : ' - ' + value.contactPositionName,
                        empresa: '',
                        estiloSocial: value.socialStyleName === null || value.socialStyleName === undefined || value.socialStyleName === '' ? ''
                            : ' - ' + value.socialStyleName,
                        actitudBanco: value.attitudeOverGroupName === null || value.attitudeOverGroupName === undefined || value.attitudeOverGroupName === '' ? ''
                            : ' - ' + value.attitudeOverGroupName,
                        fecha: Date.now(),
                        uuid,
                        order: _.isNull(value.order) ? 0 : value.order
                    }
                    listParticipants.push(clientParticipant);
                });

                //Adicionar participantes por parte de bancolombia
                _.forIn(part.participatingEmployees, function (value, key) {
                    const uuid = _.uniqueId('participanBanco_');
                    let clientParticipant = {
                        tipoParticipante: 'banco',
                        idParticipante: value.employee,
                        nombreParticipante: value.employeeName,
                        cargo: value.positionName === null || value.positionName === undefined || value.positionName === '' ? ''
                            : ' - ' + value.positionName,
                        empresa: value.lineBusinessName === null || value.lineBusinessName === undefined || value.lineBusinessName === '' ? ''
                            : ' - ' + value.lineBusinessName,
                        estiloSocial: '',
                        actitudBanco: '',
                        fecha: Date.now(),
                        uuid,
                        order: _.isNull(value.order) ? 0 : value.order
                    }
                    listParticipants.push(clientParticipant);
                });

                //Adicionar otros participantes
                _.forIn(part.relatedEmployees, function (value, key) {
                    const uuid = _.uniqueId('participanOther_');
                    let otherParticipant = {
                        tipoParticipante: 'other',
                        idParticipante: value.id,
                        nombreParticipante: value.name,
                        cargo: value.position === null || value.position === undefined || value.position === '' ? ''
                            : ' - ' + value.position,
                        empresa: value.company === null || value.company === undefined || value.company === '' ? ''
                            : ' - ' + value.company,
                        estiloSocial: '',
                        actitudBanco: '',
                        fecha: Date.now(),
                        uuid,
                        order: _.isNull(value.order) ? 0 : value.order
                    }

                    listParticipants.push(otherParticipant);
                });
                addListParticipant(listParticipants);
                //Adicionar tareas
                _.forIn(part.userTasks, function (value, key) {
                    const uuid = _.uniqueId('task_');
                    let task = {
                        uuid,
                        tarea: value.task,
                        idResponsable: value.employee,
                        responsable: value.employeeName,
                        fecha: moment(value.closingDate).format('DD/MM/YYYY')
                    }
                    addTask(task);
                });
                showLoading(false, null);
            });
        }
    }

    render() {
        const {
            fields: { acondicionamiento, replanteamiento, ahogamiento, impacto, nuevoModo, nuestraSolucion },
            clientInformacion, selectsReducer, handleSubmit, previsitReducer, reducerGlobal, navBar
        } = this.props;
        const ownerDraft = previsitReducer.get('ownerDraft');
        const detailPrevisit = previsitReducer.get('detailPrevisit');
        fechaModString = '';
        if (detailPrevisit !== undefined && detailPrevisit !== null && detailPrevisit !== '' && !_.isEmpty(detailPrevisit)) {
            createdBy = detailPrevisit.data.createdByName;
            updatedBy = detailPrevisit.data.updatedByName;
            positionCreatedBy = detailPrevisit.data.positionCreatedBy;
            positionUpdatedBy = detailPrevisit.data.positionUpdatedBy;
            if (detailPrevisit.data.updatedTimestamp !== null) {
                let fechaModDateMoment = moment(detailPrevisit.data.updatedTimestamp, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }
            if (detailPrevisit.data.createdTimestamp !== null) {
                let fechaCreateDateMoment = moment(detailPrevisit.data.createdTimestamp, "x").locale('es');
                fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
            }
        }

        return (
            <form onSubmit={handleSubmit(this._submitCreatePrevisita)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                className="my-custom-tab"
                style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                <Row style={{ padding: "5px 10px 0px 20px" }}>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        {_.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), EDITAR), false) &&
                            <button type="button" onClick={this._editPreVisit}
                                className={'btn btn-primary modal-button-edit'}
                                style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>Editar <i
                                    className={'icon edit'}></i></button>
                        }
                    </Col>
                </Row>
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
                                <Tooltip text={titleMessageTypePrevisit}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
                                </Tooltip>
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
                                disabled={this.state.isEditable ? '' : 'disabled'}
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
                                onBlur={val => this._changeDatePreVisitOnBlur(val)}
                                disabled={this.state.isEditable ? '' : 'disabled'}
                            />
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
                                max="5"
                                placeholder="Duración previsita"
                                error={_.isEmpty(this.state.durationPreVisitError) ? VALUE_REQUIERED : (REGEX_SIMPLE_XSS.test(this.state.durationPreVisitError) ? VALUE_XSS_INVALID : null)}
                                error={this.state.durationPreVisitError}
                                type="text"
                                onChange={val => this._changeDurationPreVisit(val)}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, this.state.durationPreVisit, true, 2)}
                                disabled={this.state.isEditable ? '' : 'disabled'}
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
                                disabled={this.state.isEditable ? '' : 'disabled'}
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
                                <Tooltip text={TITLE_CLIENT_PARTICIPANTS}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                </Tooltip>
                            </a>
                            <a className={`${this.state.activeItemTabBanc} item`} style={{ width: "40%" }}
                                data-tab="second" onClick={this._clickSeletedTab.bind(this, 2)}>Participantes en la
                                reunión por parte del Grupo Bancolombia
                                <Tooltip text={TITLE_BANC_PARTICIPANTS}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                </Tooltip>
                            </a>
                            <a className={`${this.state.activeItemTabOther} item`} style={{ width: "26%" }}
                                data-tab="third" onClick={this._clickSeletedTab.bind(this, 3)}>Otros participantes en la
                                reunión
                                <Tooltip text={TITLE_OTHERS_PARTICIPANTS}>
                                    <i className="help circle icon blue"
                                        style={{ fontSize: "18px", cursor: "pointer", marginLeft: "5px" }} />
                                </Tooltip>
                            </a>
                        </div>
                        <div className={`ui bottom attached ${this.state.activeItemTabClient} tab segment`}
                            data-tab="first">
                            <ParticipantesCliente disabled={this.state.isEditable ? '' : 'disabled'} />
                        </div>
                        <div className={`ui bottom attached ${this.state.activeItemTabBanc} tab segment`}
                            data-tab="second">
                            <ParticipantesBancolombia disabled={this.state.isEditable ? '' : 'disabled'} />
                        </div>
                        <div className={`ui bottom attached ${this.state.activeItemTabOther} tab segment`}
                            data-tab="third">
                            <ParticipantesOtros disabled={this.state.isEditable ? '' : 'disabled'} />
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
                            <Tooltip text={titleMessageTarget}>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                            </Tooltip>
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
                            readOnly={!this.state.isEditable}
                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                    <Tooltip text={titleMethodologyChallenger}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                                    </Tooltip>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 23px 20px 20px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <Challenger
                                    acondicionamiento={this.state.acondicionamiento}
                                    acondicionamientoTouch={this.state.acondicionamientoTouch}
                                    acondicionamientoError={this.state.acondicionamientoError}
                                    onChangeAcondicionamiento={val => this._changeAcondicionamiento(val)}
                                    replanteamiento={this.state.replanteamiento}
                                    replanteamientoTouch={this.state.replanteamientoTouch}
                                    replanteamientoError={this.state.replanteamientoError}
                                    onChangeReplanteamiento={val => this._changeReplanteamiento(val)}
                                    ahogamiento={this.state.ahogamiento}
                                    ahogamientoTouch={this.state.ahogamientoTouch}
                                    ahogamientoError={this.state.ahogamientoError}
                                    onChangeAhogamiento={val => this._changeAhogamiento(val)}
                                    impacto={this.state.impacto}
                                    impactoTouch={this.state.impactoTouch}
                                    impactoError={this.state.impactoError}
                                    onChangeImpacto={val => this._changeImpacto(val)}
                                    nuevoModo={this.state.nuevoModo}
                                    nuevoModoTouch={this.state.nuevoModoTouch}
                                    nuevoModoError={this.state.nuevoModoError}
                                    onChangeNuevoModo={val => this._changeNuevoModo(val)}
                                    nuestraSolucion={this.state.nuestraSolucion}
                                    nuestraSolucionTouch={this.state.nuestraSolucionTouch}
                                    nuestraSolucionError={this.state.nuestraSolucionError}
                                    onChangeNuestraSolucion={val => this._changeNuestraSolucion(val)}
                                    disabled={this.state.isEditable ? '' : 'disabled'}
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
                            <Tooltip text={titleMessagePendient}>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                            </Tooltip>
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
                            title="Ingrese pendientes, quejas y reclamos"
                            style={{ width: '100%', height: '178px' }}
                            readOnly={!this.state.isEditable}
                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                    show={this.state.showErrorSavePreVisit}
                    title="Error participantes"
                    text="Señor usuario, para guardar una visita como mínimo debe agregar un participante por parte del Grupo Bancolombia."
                    onConfirm={() => this.setState({ showErrorSavePreVisit: false })}
                />
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
                    text="Señor usuario, si cambia el “Tipo de visita” la información diligenciada en la sección Metodología Challenger se borrará. ¿Está seguro que desea cambiar el Tipo de visita?"
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
        pdfDescarga,
        detailPrevisit,
        addParticipant,
        createPrevisit,
        validateDatePreVisit,
        consultParameterServer,
        changeStateSaveData,
        nonValidateEnter,
        showLoading,
        addListParticipant,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ clientInformacion, selectsReducer, participants, previsitReducer, reducerGlobal, navBar }, ownerProps) {
    return {
        clientInformacion,
        selectsReducer,
        participants,
        previsitReducer,
        reducerGlobal,
        navBar
    };
}

export default reduxForm({
    form: 'submitValidation',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormEditPrevisita);