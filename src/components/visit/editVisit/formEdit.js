import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import moment from "moment";
import _ from "lodash";

import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import ParticipantesCliente from "../../participantsVisitPre/participantesCliente";
import ParticipantesBancolombia from "../../participantsVisitPre/participantesBancolombia";
import ParticipantesOtros from "../../participantsVisitPre/participantesOtros";
import TaskVisit from "../tasks/taskVisit";
import RaitingInternal from "../../clientInformation/ratingInternal";
import SweetAlert from "../../sweetalertFocus";
import RichText from "../../richText/richTextComponent";
import ToolTip from "../../toolTip/toolTipComponent";
import ButtonAssociateComponent from "../createVisit/associateVisit";
import SecurityMessageComponent from './../../globalComponents/securityMessageComponent';
import PermissionUserReports from "../../commercialReport/permissionsUserReports"

import { redirectUrl } from "../../globalComponents/actions";
import { createVisti, detailVisit, pdfDescarga, clearIdPrevisit, changeIdPrevisit } from "../actions";
import { consultDataSelect, consultList, getMasterDataFields } from "../../selectsComponent/actions";
import { addParticipant, filterUsersBanco, addListParticipant, clearParticipants } from "../../participantsVisitPre/actions";
import { downloadFilePdf } from "../../clientInformation/actions";
import { changeStateSaveData } from "../../main/actions";
import {addTask, prepareTasksNotes} from "../tasks/actions";
import { showLoading } from "../../loading/actions";
import { detailPrevisit } from "../../previsita/actions";
import { addUsers, setConfidential } from "../../commercialReport/actions";
import {
    formValidateKeyEnter,
    nonValidateEnter,
    validateValueExist
} from "../../../actionsGlobal";

import { VISIT_TYPE } from "../../selectsComponent/constants";
import {
    AEC_NO_APLIED,
    EDITAR,
    FILE_OPTION_SHOPPING_MAP,
    MESSAGE_SAVE_DATA,
    SAVE_DRAFT,
    SAVE_PUBLISHED,
    TITLE_BANC_PARTICIPANTS,
    TITLE_CLIENT_PARTICIPANTS,
    TITLE_CONCLUSIONS_VISIT,
    TITLE_OTHERS_PARTICIPANTS,
    NAME_FILE_SHOPPING_MAP
} from "../../../constantsGlobal";
import {
    KEY_PARTICIPANT_CLIENT,
    KEY_PARTICIPANT_BANCO,
    KEY_PARTICIPANT_OTHER
} from "../../participantsVisitPre/constants";
import { KEY_TYPE_VISIT } from "../constants";

import { buildJsoncommercialReport, fillUsersPermissions } from "../../commercialReport/functionsGenerics";
import {
    checkRequired, checkRichTextRequired
} from './../../../validationsFields/rulesField';
import { swtShowMessage } from "../../sweetAlertMessages/actions";

const fields = ["tipoVisita", "fechaVisita", "desarrolloGeneral", "participantesCliente", "participantesBanco", "participantesOtros", "pendientes"];
let dateVisitLastReview;
let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick;
let idPrevisitSeleted = null;

const validate = values => {
    let errors = {};
    return errors;
};

class FormEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessageCreateVisit: false,
            showErrorSaveVisit: false,
            showConfirm: false,
            idVisit: "",
            isEditable: false,
            activeItemTabBanc: '',
            activeItemTabClient: 'active',
            activeItemTabOther: '',
            conclusionsVisit: "",
            conclusionsVisitError: null,
        };
        this._submitCreateVisita = this._submitCreateVisita.bind(this);
        this._onClickButton = this._onClickButton.bind(this);
        this._editVisit = this._editVisit.bind(this);
        this._closeMessageCreateVisit = this._closeMessageCreateVisit.bind(this);
        this._onCloseButton = this._onCloseButton.bind(this);
        this._closeConfirmCloseVisit = this._closeConfirmCloseVisit.bind(this);
        this._onClickPDF = this._onClickPDF.bind(this);
        this._changeTypeVisit = this._changeTypeVisit.bind(this);
        this._changeDateVisit = this._changeDateVisit.bind(this);
        this._changeDateVisitOnBlur = this._changeDateVisitOnBlur.bind(this);
        this._downloadFileShoppingMap = this._downloadFileShoppingMap.bind(this);
        this._changeConclusionsVisit = this._changeConclusionsVisit.bind(this);
        this._consultInfoPrevisit = this._consultInfoPrevisit.bind(this);
        this._addParticipantsToReducer = this._addParticipantsToReducer.bind(this);
        this._executeFunctionFromAssociatePrevisit = this._executeFunctionFromAssociatePrevisit.bind(this);
    }

    _editVisit() {
        this.setState({
            showMessage: false,
            isEditable: !this.state.isEditable
        });
    }

    _downloadFileShoppingMap() {
        const { dispatchDownloadFilePdf, dispatchChangeStateSaveData, dispatchSwtShowMessage } = this.props;
        dispatchDownloadFilePdf(FILE_OPTION_SHOPPING_MAP, NAME_FILE_SHOPPING_MAP, dispatchChangeStateSaveData, dispatchSwtShowMessage );
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

    _closeMessageCreateVisit() {
        if (typeMessage === "success") {
            this.setState({
                showMessageCreateVisit: false
            });
            redirectUrl("/dashboard/clientInformation");
        } else {
            this.setState({
                showMessageCreateVisit: false
            });
        }
    }

    _onClickPDF() {
        const { pdfDescarga, changeStateSaveData } = this.props;
        pdfDescarga(changeStateSaveData, this.state.idVisit);
    }

    _closeConfirmCloseVisit() {
        this.setState({ showConfirm: false });
        redirectUrl("/dashboard/clientInformation");
    }

    _submitCreateVisita() {
        const { participants, visitReducer, tasks,
            changeStateSaveData, clearIdPrevisit, usersPermission,
            confidentialReducer, dispatchPrepareTasksNotes
        } = this.props;
        const detailVisit = visitReducer.get('detailVisit');
        let errorInForm = false;
        let errorMessageTitle = "Campos obligatorios";
        let errorMessage = "Señor usuario, debe ingresar todos los campos obligatorios.";

        const messageRequiredTypePrevisit = checkRequired(this.state.typeVisit);
        if (!_.isNull(messageRequiredTypePrevisit)) {
            errorInForm = true;
            this.setState({
                typeVisitError: messageRequiredTypePrevisit
            });
        }

        const messageRequiredDatePrevisit = checkRequired(this.state.dateVisit);
        if (!_.isNull(messageRequiredDatePrevisit)) {
            errorInForm = true;
            this.setState({
                dateVisitError: messageRequiredDatePrevisit
            });
        }

        if (typeButtonClick === SAVE_PUBLISHED) {
            const messageRequiredTargetPrevisit = checkRichTextRequired(this.state.conclusionsVisit);
            if (!_.isNull(messageRequiredTargetPrevisit)) {
                errorInForm = true;
                this.setState({
                    conclusionsVisitError: messageRequiredTargetPrevisit
                });
            }
        }

        if (!errorInForm) {
            let dataClient = [], dataBanco = [], dataOthers = [];
            _.forEach(participants.toArray(), function (value) {
                if (_.isEqual(value.tipoParticipante, KEY_PARTICIPANT_CLIENT)) {
                    let contactParticipantCliente = null;
                    if (value.idParticipante !== null && value.idParticipante !== '' && value.idParticipante !== undefined) {
                        contactParticipantCliente = _.filter(detailVisit.data.participatingContacts, ['id', value.idParticipante]);
                    }
                    dataClient.push({
                        "id": (contactParticipantCliente && contactParticipantCliente.length > 0) ? value.idParticipante : null,
                        "contact": value.idParticipante,
                        "order": value.order
                    });
                } else {
                    if (_.isEqual(value.tipoParticipante, KEY_PARTICIPANT_BANCO)) {
                        let contactParticipantBanco = null;
                        if (value.idParticipante !== null && value.idParticipante !== '' && value.idParticipante !== undefined) {
                            contactParticipantBanco = _.filter(detailVisit.data.participatingEmployees, ['id', value.idParticipante]);
                        }
                        dataBanco.push({
                            "id": (contactParticipantBanco && contactParticipantBanco.length > 0) ? value.idParticipante : null,
                            "employee": value.idParticipante,
                            "order": value.order
                        });
                    } else {
                        if (_.isEqual(value.tipoParticipante, KEY_PARTICIPANT_OTHER)) {
                            dataOthers.push({
                                "id": value.idParticipante,
                                "name": value.nombreParticipante.replace('-', ''),
                                "position": value.cargo.replace('-', ''),
                                "company": value.empresa.replace('-', ''),
                                "order": value.order
                            });
                        }
                    }
                }
            });

            if (dataBanco.length > 0 || typeButtonClick === SAVE_DRAFT) {
                let tareas = [];
                dispatchPrepareTasksNotes();
                _.map(tasks.toArray(),
                    function (task) {
                        let data = {
                            "id": task.id,
                            "task": task.tarea,
                            "employee": task.idResponsable,
                            "employeeName": task.responsable,
                            "closingDate": moment(task.fecha, "DD/MM/YYYY").format('x'),
                            "commercialReport": buildJsoncommercialReport(task.commercialReport, usersPermission.toArray(), confidentialReducer.get('confidential'), typeButtonClick),
                            "notes": task.notes
                        };
                        tareas.push(data);
                    }
                );

                let visitJson = {
                    "id": detailVisit.data.id,
                    "client": window.sessionStorage.getItem('idClientSelected'),
                    "visitTime": moment(this.state.dateVisit).format('x'),
                    "participatingContacts": dataClient.length === 0 ? null : dataClient,
                    "participatingEmployees": dataBanco,
                    "relatedEmployees": dataOthers.length === 0 ? null : dataOthers,
                    "comments": this.state.conclusionsVisit,
                    "visitType": this.state.typeVisit,
                    "userTasks": tareas,
                    "documentStatus": typeButtonClick,
                    "preVisitId": idPrevisitSeleted,
                    "commercialReport": buildJsoncommercialReport(this.state.commercialReport, usersPermission.toArray(), confidentialReducer.get('confidential'), typeButtonClick)
                };
                const { createVisti } = this.props;
                const that = this;
                changeStateSaveData(true, MESSAGE_SAVE_DATA);
                clearIdPrevisit();
                createVisti(visitJson).then((data) => {
                    changeStateSaveData(false, "");
                    if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                        redirectUrl("/login");
                    } else {
                        if (data.payload.data.status === 200) {
                            typeMessage = "success";
                            titleMessage = "Edición visita";
                            message = "Señor usuario, la visita se editó de forma exitosa.";
                            this.setState({ showMessageCreateVisit: true });
                        } else if ((_.get(data, 'payload.data.status') === 500)) {
                            const validationFromServer = _.get(data, 'payload.data.data');

                            _.forEach(validationFromServer, function (field) {
                                that.processValidation(field);
                            });

                            typeMessage = "error";
                            swtShowMessage('error', "Creación previsita", "Señor usuario, los datos enviados contienen caracteres invalidos que deben ser corregidos.", { onConfirmCallback: this._closeMessageCreateVisit });
                        } else {
                            typeMessage = "error";
                            titleMessage = "Edición visita";
                            message = "Señor usuario, ocurrió un error editando la visita.";
                            this.setState({ showMessageCreateVisit: true });
                        }
                    }
                }, () => {
                    changeStateSaveData(false, "");
                    typeMessage = "error";
                    titleMessage = "Edición visita";
                    message = "Señor usuario, ocurrió un error editando la visita.";
                    this.setState({ showMessageCreateVisit: true });
                });
            } else {
                this.setState({ showErrorSaveVisit: true });
            }
        } else {
            typeMessage = "error";
            titleMessage = errorMessageTitle;
            message = errorMessage;
            this.setState({ showMessageCreateVisit: true });
        }
    }

    processValidation(field) {
        if (field && field.fieldName) {
            if (_.isEqual(field.fieldName, 'comments')) {
                this.setState({ conclusionsVisitError: field.message });
            }
        }
    }

    _onClickButton(buttonClick) {
        typeButtonClick = buttonClick;
    }

    _onCloseButton() {
        message = "¿Está seguro que desea salir de la pantalla de edición de visita?";
        titleMessage = "Confirmación salida";
        this.setState({ showConfirm: true });
    }

    _changeTypeVisit(value) {
        this.setState({
            typeVisit: value,
            typeVisitError: null
        });
    }

    _changeDateVisit(value) {
        this.setState({
            dateVisit: value,
            dateVisitError: null
        });
    }

    _changeDateVisitOnBlur(value) {
        let date = value.target.value;
        if (date === '' || date === undefined || date === null) {
            this.setState({
                dateVisitError: "Debe seleccionar una opción"
            });
        }
    }

    _changeConclusionsVisit(value) {
        this.setState({
            conclusionsVisit: value,
            conclusionsVisitError: null
        });
    }

    _executeFunctionFromAssociatePrevisit() {
        const { visitReducer } = this.props;
        //Verifico si la visita se asocia a una previsita, para así cargar los datos
        if (!_.isUndefined(visitReducer.get("idPrevisit")) && !_.isNull(visitReducer.get("idPrevisit")) && visitReducer.get("idPrevisit") > 0) {
            idPrevisitSeleted = visitReducer.get("idPrevisit");
            this._consultInfoPrevisit();
        } else {
            idPrevisitSeleted = null;
        }
    }

    componentWillMount() {
        const {
            nonValidateEnter, getMasterDataFields, id, detailVisit, changeIdPrevisit, addTask, showLoading, 
            setConfidential, addUsers
        } = this.props;

        nonValidateEnter(true);
        idPrevisitSeleted = null;
        this.setState({ idVisit: id });
        getMasterDataFields([VISIT_TYPE]);
        showLoading(true, 'Cargando...');
        detailVisit(id).then((result) => {
            const {  addListParticipant } = this.props;
            let part = result.payload.data.data;
            let listParticipants = [];
            dateVisitLastReview = moment(part.reviewedDate, "x").locale('es').format("DD MMM YYYY");
            idPrevisitSeleted = part.preVisitId;
            changeIdPrevisit(part.preVisitId);

            this.setState({
                typeVisit: part.visitType,
                dateVisit: new Date(moment(part.visitTime, "x")),
                conclusionsVisit: part.comments,
                commercialReport: part.commercialReport
            });

            if (part.commercialReport) {
                setConfidential(part.commercialReport.isConfidential);
                fillUsersPermissions(part.commercialReport.usersWithPermission, addUsers);
            }

            //Adicionar participantes por parte del cliente
            _.forIn(part.participatingContacts, function (value) {
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
            _.forIn(part.participatingEmployees, function (value) {
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
            _.forIn(part.userTasks, function (value) {
                const uuid = _.uniqueId('task_');
                let task = {
                    uuid,
                    id: value.id,
                    tarea: value.task,
                    textTarea: value.taskText,
                    idResponsable: value.employee,
                    responsable: value.employeeName,
                    fecha: moment(value.closingDate).format('DD/MM/YYYY'),
                    fechaForm: moment(value.closingDate).format('DD/MM/YYYY'),
                    commercialReport: value.commercialReport,
                    taskAsignator: value.taskAsignator,
                    notes: value.notes
                };
                addTask(task);
            });
            showLoading(false, null);
        });
    }

    componentWillUnmount() {
        const { clearParticipants } = this.props;
        clearParticipants();
    }

    _consultInfoPrevisit() {
        const { detailPrevisit, selectsReducer, participants } = this.props;
        detailPrevisit(idPrevisitSeleted).then((result) => {
            var previsitConsult = result.payload.data.data;
            const listParticipants = {
                _client: [],
                _banco: [],
                _others: []
            };
            const typeVisitSeleted = _.filter(selectsReducer.get(VISIT_TYPE), ['key', KEY_TYPE_VISIT]);
            this.setState({
                typeVisit: typeVisitSeleted[0].id,
                dateVisit: new Date(moment(previsitConsult.visitTime, "x"))
            });


            //Validar si debo agregar participantes por parte del cliente. banco y otros
            const lists = _.groupBy(participants.toArray(), 'tipoParticipante');
            const valuesClient = _.get(lists, KEY_PARTICIPANT_CLIENT, null);
            const valuesBanco = _.get(lists, KEY_PARTICIPANT_BANCO, null);
            const valuesOthers = _.get(lists, KEY_PARTICIPANT_OTHER, null);

            //Solo agrego los participantes de la previsita si no se han adicionado ningúno en la visita
            if (_.isNull(valuesClient) || _.size(valuesClient) <= 0) {
                //Adicionar participantes por parte del cliente
                _.forIn(previsitConsult.participatingContacts, function (value) {
                    const uuid = _.uniqueId('participanClient_');
                    var clientParticipant = {
                        tipoParticipante: KEY_PARTICIPANT_CLIENT,
                        idParticipante: value.contact,
                        nombreParticipante: value.contactName,
                        cargo: !validateValueExist(value.contactPositionName) ? '' : ' - ' + value.contactPositionName,
                        empresa: '',
                        estiloSocial: !validateValueExist(value.socialStyleName) ? '' : ' - ' + value.socialStyleName,
                        actitudBanco: !validateValueExist(value.attitudeOverGroupName) ? '' : ' - ' + value.attitudeOverGroupName,
                        fecha: Date.now(),
                        uuid,
                        order: _.isNull(value.participantOrder) ? 0 : value.participantOrder
                    }
                    listParticipants._client.push(clientParticipant);
                });
                this._addParticipantsToReducer(listParticipants._client);
            }

            if (_.isNull(valuesBanco) || _.size(valuesBanco) <= 0) {
                //Adicionar participantes por parte de bancolombia
                _.forIn(previsitConsult.participatingEmployees, function (value) {
                    const uuid = _.uniqueId('participanBanco_');
                    var clientParticipant = {
                        tipoParticipante: KEY_PARTICIPANT_BANCO,
                        idParticipante: value.employee,
                        nombreParticipante: value.employeeName,
                        cargo: !validateValueExist(value.positionName) ? '' : ' - ' + value.positionName,
                        empresa: !validateValueExist(value.lineBusinessName) ? '' : ' - ' + value.lineBusinessName,
                        estiloSocial: '',
                        actitudBanco: '',
                        fecha: Date.now(),
                        uuid,
                        order: _.isNull(value.participantOrder) ? 0 : value.participantOrder
                    }
                    listParticipants._banco.push(clientParticipant);
                });
                this._addParticipantsToReducer(listParticipants._banco);
            }

            if (_.isNull(valuesOthers) || _.size(valuesOthers) <= 0) {
                //Adicionar otros participantes
                _.forIn(previsitConsult.relatedEmployees, function (value) {
                    const uuid = _.uniqueId('participanOther_');
                    var otherParticipant = {
                        tipoParticipante: KEY_PARTICIPANT_OTHER,
                        idParticipante: null,
                        nombreParticipante: value.name,
                        cargo: !validateValueExist(value.position) ? '' : ' - ' + value.position,
                        empresa: !validateValueExist(value.company) ? '' : ' - ' + value.company,
                        estiloSocial: '',
                        actitudBanco: '',
                        fecha: Date.now(),
                        uuid,
                        order: _.isNull(value.participantOrder) ? 0 : value.participantOrder
                    }
                    listParticipants._others.push(otherParticipant);
                });

                this._addParticipantsToReducer(listParticipants._others);
            }

        });
    }

    _addParticipantsToReducer(list) {
        const { addParticipant } = this.props;
        _.map(list, (participant) => {
            addParticipant(participant);
        });
    }


    render() {
        const {
            selectsReducer, handleSubmit, visitReducer, clientInformacion, reducerGlobal
        } = this.props;
        const ownerDraft = visitReducer.get('ownerDraft');
        const detailVisit = visitReducer.get('detailVisit');
        const infoClient = clientInformacion.get('responseClientInfo');
        const { aecStatus } = infoClient;
        let showAECNoAplica = false;
        let showAECNivel = true;
        if (aecStatus === undefined || aecStatus === null || aecStatus === AEC_NO_APLIED) {
            showAECNoAplica = true;
            showAECNivel = false;
        }
        let fechaModString = '';
        let fechaCreateString = '';
        let createdBy = '';
        let updatedBy = '';
        let positionCreatedBy = '';
        let positionUpdatedBy = '';

        if (detailVisit !== undefined && detailVisit !== null && detailVisit !== '' && !_.isEmpty(detailVisit)) {
            createdBy = detailVisit.data.createdByName;
            updatedBy = detailVisit.data.updatedByName;
            positionCreatedBy = detailVisit.data.positionCreatedBy;
            positionUpdatedBy = detailVisit.data.positionUpdatedBy;
            if (detailVisit.data.updatedTimestamp !== null) {
                let fechaModDateMoment = moment(detailVisit.data.updatedTimestamp, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }
            if (detailVisit.data.createdTimestamp !== null) {
                let fechaCreateDateMoment = moment(detailVisit.data.createdTimestamp, "x").locale('es');
                fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
            }
        }
        return (
            <form onSubmit={handleSubmit(this._submitCreateVisita)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                className="my-custom-tab"
                style={{
                    backgroundColor: "#FFFFFF",
                    marginTop: "0px",
                    paddingTop: "10px",
                    width: "100%",
                    paddingBottom: "50px"
                }}>
                <SecurityMessageComponent />
                <header className="header-client-detail" style={{ padding: '10px' }}>
                    <div className="company-detail" style={{ marginLeft: "20px", marginRight: "20px" }}>
                        <div>
                            <h3 style={{ wordBreak: 'keep-all' }} className="inline title-head">
                                {infoClient.clientName}
                            </h3>
                            {infoClient.isProspect &&
                                <span style={{
                                    borderRadius: "2px",
                                    fontSize: "15px",
                                    height: "30px",
                                    display: "inline !important",
                                    textTransform: "none !important",
                                    marginLeft: "10px"
                                }}
                                    className="label label-important bounceIn animated prospect">Prospecto</span>
                            }
                            {showAECNivel &&
                                <span style={{
                                    borderRadius: "2px",
                                    fontSize: "15px",
                                    height: "30px",
                                    display: "inline !important",
                                    textTransform: "none !important",
                                    marginLeft: "10px",
                                    backgroundColor: "#ec5f48"
                                }}
                                    className="label label-important bounceIn animated aec-status">{aecStatus}</span>
                            }
                            {showAECNoAplica &&
                                <span style={{
                                    borderRadius: "2px",
                                    fontSize: "15px",
                                    height: "30px",
                                    display: "inline !important",
                                    textTransform: "none !important",
                                    marginLeft: "10px",
                                    backgroundColor: "#3498db"
                                }}
                                    className="label label-important bounceIn animated aec-normal">AEC: No aplica</span>
                            }
                            <div style={{ width: "150px", display: "inline-flex" }}>
                                <span style={{ marginLeft: "10px" }}><RaitingInternal
                                    valueRaiting={infoClient.internalRatingKey} /></span>
                            </div>
                        </div>
                    </div>
                </header>
                <Row style={{ padding: "5px 10px 0px 20px" }}>
                    <Col xs={12} sm={8} md={this.state.isEditable ? 8 : 10} lg={this.state.isEditable ? 8 : 10}>
                        <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                    </Col>
                    <Col xs={4} sm={3} md={2} lg={2} style={{ paddingRight: '0px' }}>
                        {_.get(reducerGlobal.get('permissionsVisits'), _.indexOf(reducerGlobal.get('permissionsVisits'), EDITAR), false) &&
                            <button type="button" onClick={this._editVisit} className={'btn btn-primary modal-button-edit'}
                                style={!this.state.isEditable ? {
                                    float: 'right',
                                    marginTop: '-15px',
                                    marginRight: '20px'
                                } : { float: 'right', marginTop: '-15px', marginRight: '-20px' }}>Editar
                            <i className={'icon edit'} />
                            </button>
                        }
                    </Col>
                    {_.get(reducerGlobal.get('permissionsVisits'), _.indexOf(reducerGlobal.get('permissionsVisits'), EDITAR), false) && this.state.isEditable &&
                        <ButtonAssociateComponent fnExecute={this._executeFunctionFromAssociatePrevisit} edit={true} />
                    }
                </Row>
                <Row style={{ padding: "5px 10px 20px 20px" }}>
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
                            <span style={{ fontSize: "20px" }}> Datos de la reunión</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Tipo de reunión (</span><span style={{ color: "red" }}>*</span>)
                        </dt>
                        <dt>
                            <ComboBox
                                name="tipoVisita"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                value={this.state.typeVisit}
                                touched={true}
                                error={this.state.typeVisitError}
                                onChange={val => this._changeTypeVisit(val)}
                                onBlur={() => ''}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(VISIT_TYPE) || []}
                                disabled={this.state.isEditable ? '' : 'disabled'}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Fecha de reunión - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)
                        </dt>
                        <dt>
                            <DateTimePickerUi
                                culture='es'
                                format={"DD/MM/YYYY hh:mm a"}
                                time={true}
                                value={this.state.dateVisit}
                                touched={true}
                                error={this.state.dateVisitError}
                                onChange={val => this._changeDateVisit(val)}
                                onBlur={val => this._changeDateVisitOnBlur(val)}
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
                            <span style={{ fontSize: "20px" }}> Conclusiones de la reunión - acuerdos y compromisos de las partes (<span
                                style={{ color: "red" }}>*</span>)</span>
                            <ToolTip text={TITLE_CONCLUSIONS_VISIT}>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "18px", cursor: "pointer", marginLeft: "0px" }} />
                            </ToolTip>
                            <ToolTip text="Descargar pdf mapa de compras">
                                <i onClick={this._downloadFileShoppingMap}
                                    style={{ marginLeft: "2px", cursor: "pointer", fontSize: "18px" }}
                                    className="red file pdf outline icon" />
                            </ToolTip>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 23px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <RichText
                            name="desarrolloGeneral"
                            value={this.state.conclusionsVisit}
                            touched={true}
                            error={this.state.conclusionsVisitError}
                            onChange={val => this._changeConclusionsVisit(val)}
                            placeholder="Ingrese las conclusiones de la reunión"
                            style={{ width: '100%', height: '178px' }}
                            readOnly={!this.state.isEditable}
                            disabled={this.state.isEditable ? '' : 'disabled'}
                        />
                    </Col>
                </Row>
                <TaskVisit disabled={this.state.isEditable ? '' : 'disabled'} />
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
                            <span style={{
                                fontWeight: "bold",
                                color: "#818282"
                            }}>Fecha última revisión formato visita: </span><span
                                style={{ marginLeft: "0px", color: "#818282" }}>{dateVisitLastReview}</span>
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
                    show={this.state.showErrorSaveVisit}
                    title="Error participantes"
                    text="Señor usuario, para guardar una visita como mínimo debe agregar un participante por parte del Grupo Bancolombia."
                    onConfirm={() => this.setState({ showErrorSaveVisit: false })}
                />
                <SweetAlert
                    type={typeMessage}
                    show={this.state.showMessageCreateVisit}
                    title={titleMessage}
                    text={message}
                    onConfirm={this._closeMessageCreateVisit}
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
            </form>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultDataSelect,
        consultList,
        pdfDescarga,
        getMasterDataFields,
        createVisti,
        addParticipant,
        detailVisit,
        filterUsersBanco,
        addTask,
        nonValidateEnter,
        showLoading,
        addListParticipant,
        clearIdPrevisit,
        detailPrevisit,
        changeIdPrevisit,
        addUsers,
        setConfidential,
        clearParticipants,
        dispatchPrepareTasksNotes: prepareTasksNotes,
        dispatchDownloadFilePdf : downloadFilePdf,
        dispatchChangeStateSaveData : changeStateSaveData,
        dispatchSwtShowMessage : swtShowMessage
    }, dispatch);
}

function mapStateToProps({ selectsReducer, visitReducer, participants, contactsByClient, tasks, clientInformacion, reducerGlobal, navBar, usersPermission, confidentialReducer }) {
    const detailVisit = visitReducer.get('detailVisit');
    if (detailVisit !== undefined && detailVisit !== null && detailVisit !== '' && !_.isEmpty(detailVisit)) {
        let visitTime = detailVisit.data.visitTime;
        return {
            initialValues: {
                tipoVisita: detailVisit.data.visitType,
                fechaVisita: visitTime !== '' && visitTime !== null && visitTime !== undefined ? moment(visitTime, "x").format('DD/MM/YYYY HH:mm') : null,
                desarrolloGeneral: detailVisit.data.comments,
                participantesBanco: _.toArray(detailVisit.data.participatingEmployees),
                participantesOtros: _.toArray(detailVisit.data.relatedEmployees),
                pendientes: detailVisit.data.userTasks
            },
            selectsReducer,
            visitReducer,
            contactsByClient,
            participants,
            tasks,
            clientInformacion,
            reducerGlobal,
            navBar,
            usersPermission,
            confidentialReducer
        };
    } else {
        return {
            initialValues: {
                tipoVisita: '',
                fechaVisita: '',
                desarrolloGeneral: '',
                participantesCliente: '',
                participantesBanco: '',
                participantesOtros: '',
                pendientes: ''
            },
            selectsReducer,
            visitReducer,
            contactsByClient,
            participants,
            tasks,
            clientInformacion,
            reducerGlobal,
            navBar,
            usersPermission,
            confidentialReducer
        };
    }
}

export default reduxForm({
    form: 'submitValidation',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormEdit);