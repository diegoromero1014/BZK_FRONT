import React, { Component } from "react";
import SweetAlert from "../sweetalertFocus";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import { reduxForm } from "redux-form";
import numeral from "numeral";
import _ from "lodash";
import $ from "jquery";
import moment from "moment";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import MultipleSelect from "../../ui/multipleSelect/multipleSelectComponent";
import Input from "../../ui/input/inputComponent";
import Textarea from "../../ui/textarea/textareaComponent";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import NotesClient from "./notes/notesClient";
import ProductsClient from "./products/productList";
import BottonContactAdmin from "../clientDetailsInfo/bottonContactAdmin";
import BottonShareholderAdmin from "../clientDetailsInfo/bottonShareholderAdmin";
import ModalErrorsUpdateClient from "./modalErrorsUpdateClient";
import ContextEconomicActivity from "../contextClient/contextEconomicActivity";
import ComponentListLineBusiness from "../contextClient/listLineOfBusiness/whiteListLineBusiness";
import ComponentListDistributionChannel from "../contextClient/listDistributionChannel/componentListDistributionChannel";
import InventorPolicy from "../contextClient/inventoryPolicy";
import ControlLinkedPayments from "../contextClient/controlLinkedPayments";
import ComponentListMainClients from "../contextClient/listMainClients/componentListMainClients";
import ComponentListMainSupplier from "../contextClient/listMainSupplier/componentListMainSupplier";
import ComponentListMainCompetitor from "../contextClient/listMainCompetitor/componentListMainCompetitor";
import ComponentListIntOperations from "../contextClient/listInternationalOperations/componentListIntOperations";
import ComponentInfoClient from './components/InfoClient';
import ActividadEconomica from './components/ActividadEconomica';
import SecurityMessageComponent from '../globalComponents/securityMessageComponent';
import Objetivos from '../fieldList/Objetives/Objetives';
import {listName} from '../fieldList/Objetives/utils';
import SectionOpportunitiesWeaknesses from '../opportunitiesWeaknesses/SectionOpportunitiesWeaknesses';

import { clearProducts, setProducts } from "./products/actions";
import { clearNotes, deleteNote, setNotes } from "./notes/actions";
import { createProspect } from "../propspect/actions";
import { changeStateSaveData } from "../main/actions";
import { swtShowMessage } from "../sweetAlertMessages/actions";
import { showLoading } from "../loading/actions";
import { saveCreditStudy } from "../clients/creditStudy/actions";
import {
    onSessionExpire,
    replaceCommaInNumber,
    stringValidate,
    validateResponse,
    validateWhileListResponse
} from "../../actionsGlobal";
import { updateTitleNavBar } from "../navBar/actions";
import {
    seletedButton,
    sendErrorsUpdate,
    updateClient,
    updateErrorsNotes,
    validateContactShareholder
} from "../clientDetailsInfo/actions";
import { goBack, redirectUrl } from "../globalComponents/actions";
import {
    clearValuesAdressess,
    consultDataSelect,
    consultList,
    consultListWithParameter,
    consultListWithParameterUbication,
    economicGroupsByKeyword,
    getMasterDataFields
} from "../selectsComponent/actions";
import { BUTTON_EDIT, BUTTON_UPDATE, UPDATE } from "../clientDetailsInfo/constants";
import * as constants from "../selectsComponent/constants";
import {
    EDIT_METHOD,
    KEY_DESMONTE,
    KEY_EXCEPCION,
    KEY_EXCEPCION_NO_GERENCIADO,
    KEY_EXCEPCION_NO_NECESITA_LME,
    KEY_OPTION_OTHER_OPERATIONS_FOREIGNS,
    KEY_OPTION_OTHER_ORIGIN_GOODS,
    KEY_OPTION_OTHER_ORIGIN_RESOURCE,
    MAXIMUM_OPERATIONS_FOREIGNS,
    UPDATE_METHOD
} from "./constants";
import {
    ALLOWS_NEGATIVE_INTEGER,
    INFO_ESTUDIO_CREDITO,
    MESSAGE_ERROR_INVALID_INPUT,
    MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_LOAD_DATA,
    MESSAGE_SAVE_DATA,
    ONLY_POSITIVE_INTEGER,
    OPTION_REQUIRED,
    TITLE_ERROR_SWEET_ALERT
} from '../../constantsGlobal';
import {
    DISTRIBUTION_CHANNEL,
    INT_OPERATIONS,
    LINE_OF_BUSINESS,
    MAIN_CLIENTS,
    MAIN_COMPETITOR,
    MAIN_SUPPLIER
} from "../contextClient/constants";
import { fields, validations as validate } from './fieldsAndRulesClientEditUpdate';

import { 
    createClientDetailRequestFromReducer,
    clientInformationToReducer
} from '../fieldList/mapListsToEntities';

import {
    changeListState
} from '../fieldList/actions';

let idButton;
let errorContact;
let errorShareholder;
let messageAlertSuccess;
var notesArray = [];
var countOperationsForeign = 0;
var countOriginGoods = 0;
var countOriginResource = 0;
var initValueJustifyNonGeren = false;
var initValueJustifyNonLME = false;
var messageShareholder = '', messageContact = '';

//Data para los select de respuesta "Si" - "No"
const valuesYesNo = [
    { 'id': '', 'value': "Seleccione..." },
    { 'id': true, 'value': "Si" },
    { 'id': false, 'value': "No" }
];

//Establece si el cliente a editar es prospecto o no para controlar las validaciones de campos
let isProspect = false;
//Guarda el anterior valor de la justificación no gerenciamiento para saber cuándo cambia de desmonte a otro
let oldJustifyGeren = '';
//Guarda el anterior valor de la justificación no necesita LME para saber cuándo cambia de excepción a otro
let oldJustifyNoNeedLME = '';
//Controla si es la primer vez que se setea información en el campo justificationForNoRM
let infoJustificationForNoRM = true;
//Controla si es la primer vez que se setea información en el campo justification need LME
let infoJustificationNeedLME = true;
//Controla si es la primer vez que se setea información en el campo marcGeren
let infoMarcaGeren = true;
//Controla que el componente suba el scroll, solo cuando hallan errores y se de click en el botón de guardar, o actualizar
var clickButttonSave = false;
//Valida si es necesario la justificacion para la marca de gerenciamiento
let validateMarcManagement = true;


//Controla las validaciones cuando se esta en edicion de clientes
let isMethodEditClient = false;

let otherOperationsForeignEnable = 'disabled';
let otherOriginGoodsEnable = 'disabled';
let otherOriginResourceEnable = 'disabled';

let isPersonaNatural = false;

const EDIT_STYLE = {
    border: '1px solid #e5e9ec',
    backgroundColor: '#F8F8F8',
    borderRadius: '2px',
    margin: '0px 28px 0 20px',
    height: '60px'
};

const UPDATE_STYLE = {
    border: '1px solid #e5e9ec',
    backgroundColor: '#F8F8F8',
    borderRadius: '2px',
    margin: '0px 28px 0 20px',
    height: '110px'
};

const requiredField = <span>(<span style={{ color: "red" }}>*</span>)</span>;

const drawRequiredField = (condition) => {
    if (condition) {
        return requiredField;
    }
}

const changeObjectiveState = changeListState(listName);

//Componente genérico para cargar los selects de justificación
function SelectsJustificacion(props) {
    if (props.visible !== undefined && props.visible !== null && props.visible.toString() === "false") {
        return <Col xs={12} md={4} lg={4}>
            <dt>
                {props.title} {drawRequiredField(props.obligatory)}
            </dt>
            <dt>
                <ComboBox
                    labelInput={props.labelInput}
                    onBlur={props.onBlur}
                    valueProp={props.valueProp}
                    textProp={props.textProp}
                    {...props.justify}
                    data={props.data}
                    touched={true}
                    parentId="dashboardComponentScroll"
                    onChange={props.onChange}
                    showEmptyObject={true}
                />
            </dt>
        </Col>;
    } else {
        return <div></div>;
    }
}

class clientEdit extends Component {
    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this.state = {
            show: false,
            showConfirmSave: false,
            showEx: false,
            showExitoSaveNotUpdate: false,
            showEr: false,
            sumErrorsForm: false,
            showErrorClientExists: false,
            messageError: '',
            otherOperationsForeignEnable: 'disabled',
            otherOriginGoodsEnable: 'disabled',
            otherOriginResourceEnable: 'disabled',
            showFormAddLineOfBusiness: false,
            showFormAddDistribution: false,
            showFormAddMainClient: false,
            showFormAddMainSupplier: false,
            showFormAddMainCompetitor: false,
            showFormAddIntOperatrions: false,
            showJustifyNoGeren: true,
            shouldUpdate: false,
            showAlertListObjetcActive: false
        };
        this._saveClient = this._saveClient.bind(this);
        this._submitEditClient = this._submitEditClient.bind(this);

        this._onChangeOperationsForeigns = this._onChangeOperationsForeigns.bind(this);
        this._onChangeOriginGoods = this._onChangeOriginGoods.bind(this);
        this._onChangeOriginResource = this._onChangeOriginResource.bind(this);
        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        this._closeWindow = this._closeWindow.bind(this);
        this._onConfirmExit = this._onConfirmExit.bind(this);
        this._closeError = this._closeError.bind(this);
        this._closeSuccess = this._closeSuccess.bind(this);
        this._closeSuccessSaveUpdate = this._closeSuccessSaveUpdate.bind(this);
        this._handleGroupEconomicFind = this._handleGroupEconomicFind.bind(this);
        this._onChangeGroupEconomic = this._onChangeGroupEconomic.bind(this);
        this._onChangeJustifyNoGeren = this._onChangeJustifyNoGeren.bind(this);
        this._onChangeValueJustifyNoNeedLME = this._onChangeValueJustifyNoNeedLME.bind(this);
        this._onChangeValueNeedLME = this._onChangeValueNeedLME.bind(this);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this._onConfirmSaveJustClient = this._onConfirmSaveJustClient.bind(this);
        this.clickButtonScrollTop = this.clickButtonScrollTop.bind(this);
        this._createJsonSaveContextClient = this._createJsonSaveContextClient.bind(this);
        this.showFormOut = this.showFormOut.bind(this);

        let _componentScroll = document.getElementById('dashboardComponentScroll');
        if (_componentScroll) {
            _componentScroll.scrollTop = 0;
        }

    }

    _closeWindow() {
        this.setState({ show: true });
    }

    _onConfirmExit() {
        const { sendErrorsUpdate, updateErrorsNotes } = this.props;
        sendErrorsUpdate([]);
        this.setState({ show: false });
        countOperationsForeign = 0;
        countOriginGoods = 0;
        countOriginResource = 0;
        isProspect = false;
        updateErrorsNotes(false);
        oldJustifyGeren = '';
        oldJustifyNoNeedLME = '';
        infoJustificationForNoRM = true;
        infoJustificationNeedLME = true;
        clickButttonSave = false;
        otherOperationsForeignEnable = 'disabled';
        otherOriginGoodsEnable = 'disabled';
        otherOriginResourceEnable = 'disabled';
        initValueJustifyNonGeren = false;
        initValueJustifyNonLME = false;
        goBack();
    }

    showFormOut(property, value) {
        if (_.isEqual(LINE_OF_BUSINESS, property)) {
            this.setState({ showFormAddLineOfBusiness: value });
        } else if (_.isEqual(DISTRIBUTION_CHANNEL, property)) {
            this.setState({ showFormAddDistribution: value });
        } else if (_.isEqual(MAIN_CLIENTS, property)) {
            this.setState({ showFormAddMainClient: value });
        } else if (_.isEqual(MAIN_SUPPLIER, property)) {
            this.setState({ showFormAddMainSupplier: value });
        } else if (_.isEqual(MAIN_COMPETITOR, property)) {
            this.setState({ showFormAddMainCompetitor: value });
        } else if (_.isEqual(INT_OPERATIONS, property)) {
            this.setState({ showFormAddIntOperatrions: value });
        }
    }

    _closeError() {
        this.setState({ show: false, showEx: false, showEr: false, showErrorClientExists: false });
    }

    _closeSuccess() {
        const { sendErrorsUpdate, updateErrorsNotes } = this.props;
        sendErrorsUpdate([]);
        this.setState({ show: false, showEx: false, showEr: false });
        countOperationsForeign = 0;
        countOriginGoods = 0;
        countOriginResource = 0;
        isProspect = false;
        updateErrorsNotes(false);
        oldJustifyGeren = '';
        oldJustifyNoNeedLME = '';
        infoJustificationForNoRM = true;
        infoJustificationNeedLME = true;
        clickButttonSave = false;
        otherOperationsForeignEnable = 'disabled';
        otherOriginGoodsEnable = 'disabled';
        otherOriginResourceEnable = 'disabled';
        initValueJustifyNonGeren = false;
        initValueJustifyNonLME = false;
        goBack();
    }

    _closeSuccessSaveUpdate() {
        this.setState({ showExitoSaveNotUpdate: false });
    }

    _onChangeGroupEconomic(e) {
        const { fields: { economicGroupName, nitPrincipal, groupEconomic }, economicGroupsByKeyword } = this.props;
        if (_.isNil(e.target.value) || _.isEqual(e.target.value, "")) {
            nitPrincipal.onChange("");
            groupEconomic.onChange('');
        }
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            economicGroupsByKeyword(economicGroupName.value);
            economicGroupName.onChange('');
            groupEconomic.onChange('');
        } else {
            economicGroupName.onChange(e.target.value);
        }
    }

    updateKeyValueUsersBanco(e) {
        const { fields: { groupEconomic, economicGroupName, nitPrincipal }, economicGroupsByKeyword } = this.props;
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            groupEconomic.onChange('');
            nitPrincipal.onChange('');
            e.preventDefault();
            if (economicGroupName.value !== "" && economicGroupName.value !== null && economicGroupName.value !== undefined) {
                $('.ui.search.participantBanc').toggleClass('loading');
                economicGroupsByKeyword(economicGroupName.value).then((data) => {
                    let economicGroup1 = _.get(data, 'payload.data.data');
                    _.forEach(economicGroup1, function (data1) {
                        data1.title = data1.group;
                        data1.description = data1.nitPrincipal != null ? data1.nitPrincipal : '';
                    });
                    $('.ui.search.participantBanc')
                        .search({
                            cache: false,
                            source: economicGroup1,
                            searchFields: [
                                'title',
                                'description',
                                'id',
                                'relationshipManagerId'
                            ],
                            onSelect: function (event) {
                                economicGroupName.onChange(event.group);
                                groupEconomic.onChange(event.id);
                                nitPrincipal.onChange(event.nitPrincipal);
                                return 'default';
                            }
                        });
                    $('.ui.search.participantBanc').toggleClass('loading');
                    $('.prompt').focus();
                }
                );
            }
        }
    }

    _updateValue(value) {
        let userSelected;
        _.map(contactClient, contact => {
            if (contact.id.toString() === value) {
                userSelected = contact;
                return contact;
            }
        });
        if (userSelected !== null && userSelected !== undefined) {
            idUsuario.onChange(userSelected.id);
            nameUsuario.onChange(userSelected.nameComplet);
        }
    }

    _onChangeMarcGeren(val) {
        // Traer el selectReducer con el select de campos
        // Buscar el key que tenga el val
        const { selectsReducer, clientInformacion } = this.props;
        const optionMarcMagnament = selectsReducer.get(constants.MANAGEMENT_BRAND);

        let optionSelected = null;

        if (typeof optionMarcMagnament == 'undefined') {
            var infoClient = clientInformacion.get('responseClientInfo');
            // Crear el objeto optionSelected
            optionSelected = { key: infoClient.isManagedByRmKey };
        } else {
            for (let i = 0; i < optionMarcMagnament.length; i++) {
                let option = optionMarcMagnament[i];


                if (val == option.id) {
                    optionSelected = option;
                    break;
                }
            }
        }

        // Si el key es Gerenciamiento a Demanda.
        if (optionSelected == null) {
            validateMarcManagement = true;
            this.setState({ showJustifyNoGeren: true });
        } else if (optionSelected.key === 'Gerenciamiento a Demanda') {
            validateMarcManagement = false;
            this.setState({ showJustifyNoGeren: false });
        } else {
            validateMarcManagement = true;
            this.setState({ showJustifyNoGeren: true });
        }
        if (!infoMarcaGeren && validateMarcManagement === true) {
            var dataTypeNote, idExcepcionNoGerenciado;
            const { selectsReducer, deleteNote, notes, updateErrorsNotes } = this.props;
            dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            idExcepcionNoGerenciado = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_GERENCIADO]), '[0].id');
            const notesWithoutNoGeren = _.remove(notes.toArray(), (note) => {
                if (idExcepcionNoGerenciado === parseInt(note.combo)) {
                    deleteNote(note.uid);
                    return false;
                } else {
                    return true
                }
            });
            let isValidNotesDescription = true;
            _.forEach(notesWithoutNoGeren, (note) => {
                isValidNotesDescription = !_.isEmpty(note.body)
            });
            if (isValidNotesDescription) {
                updateErrorsNotes(false);
            }
        } else {
            infoMarcaGeren = false;
        }
        if (validateMarcManagement === true && initValueJustifyNonGeren) {
            const { fields: { justifyNoGeren } } = this.props;
            justifyNoGeren.onChange('');
        } else {
            initValueJustifyNonGeren = true;
        }
    }

    _onChangeValueNeedLME(val) {
        const {
            fields: { necesitaLME, justifyNoLME },
            selectsReducer, deleteNote, notes, updateErrorsNotes
        } = this.props;
        if (val === 'true' || val && initValueJustifyNonLME) {
            justifyNoLME.onChange('');
            const dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            const idNotNeedExceptionLME = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_NECESITA_LME]), '[0].id');
            var notesWithoutNoNeedLME = _.remove(notes.toArray(), (note) => {
                if (idNotNeedExceptionLME === parseInt(note.combo)) {
                    deleteNote(note.uid);
                    return false;
                } else {
                    return true
                }
            });
            let isValidNotesDescription = true;
            _.forEach(notesWithoutNoNeedLME, (note) => {
                isValidNotesDescription = !_.isEmpty(note.body)
            });
            if (isValidNotesDescription) {
                updateErrorsNotes(false);
            }
            justifyNoLME.onChange('');
        } else {
            initValueJustifyNonLME = true;
        }
        necesitaLME.onChange(val);
    }

    _onChangeJustifyNoGeren(val) {
        const { selectsReducer, clientInformacion, notes, updateErrorsNotes, setNotes, deleteNote } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        if (!infoJustificationForNoRM || infoClient.justificationForNoRM !== val) {
            let dataJustifyNoGeren = selectsReducer.get(constants.JUSTIFICATION_NO_RM);
            let keyJustify = _.get(_.filter(dataJustifyNoGeren, ['id', parseInt(val)]), '[0].key');
            let dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            let idExcepcionNoGerenciado = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_GERENCIADO]), '[0].id');
            if (keyJustify === KEY_DESMONTE) {
                oldJustifyGeren = KEY_DESMONTE;
                if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
                    let hasNotesNoGeren = false;
                    _.forEach(notes.toArray(), (note) => {
                        if (idExcepcionNoGerenciado === parseInt(note.combo)) {
                            hasNotesNoGeren = true;
                        }
                    });

                    if (notes.size === 0 || !hasNotesNoGeren) {
                        var noteObligatory = [];
                        noteObligatory.push({
                            typeOfNote: idExcepcionNoGerenciado,
                            typeOfNoteKey: KEY_EXCEPCION_NO_GERENCIADO,
                            note: ''
                        });
                        setNotes(noteObligatory);
                    }
                }
            }
            if (oldJustifyGeren === KEY_DESMONTE && keyJustify !== KEY_DESMONTE) {
                oldJustifyGeren = val;
                const notesWithoutNoGeren = _.remove(notes.toArray(), (note) => {
                    if (idExcepcionNoGerenciado === parseInt(note.combo)) {
                        deleteNote(note.uid);
                        return false;
                    } else {
                        return true
                    }
                });
                let isValidNotesDescription = true;
                _.forEach(notesWithoutNoGeren, (note) => {
                    isValidNotesDescription = !_.isEmpty(note.body)
                });
                if (isValidNotesDescription) {
                    updateErrorsNotes(false);
                }
            }
        } else {
            infoJustificationForNoRM = false;
            oldJustifyGeren = KEY_DESMONTE;
        }
    }

    _onChangeValueJustifyNoNeedLME(val) {
        const { selectsReducer, clientInformacion, notes, updateErrorsNotes, setNotes, deleteNote } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        if (!infoJustificationNeedLME || infoClient.justificationForCreditNeed !== val) {
            let dataJustifyNoNeedLME = selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED);
            let keyJustify = _.get(_.filter(dataJustifyNoNeedLME, ['id', parseInt(val)]), '[0].key');
            let dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            let idExeptionNoNeedLME = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_NECESITA_LME]), '[0].id');
            if (keyJustify === KEY_EXCEPCION) {
                oldJustifyNoNeedLME = KEY_EXCEPCION;
                if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
                    let hasNotesNoGeren = false;
                    _.forEach(notes.toArray(), (note) => {
                        if (idExeptionNoNeedLME === parseInt(note.combo)) {
                            hasNotesNoGeren = true;
                        }
                    });
                    if (notes.size === 0 || !hasNotesNoGeren) {
                        const noteObligatory = [];
                        noteObligatory.push({
                            typeOfNote: idExeptionNoNeedLME,
                            typeOfNoteKey: KEY_EXCEPCION_NO_NECESITA_LME,
                            note: ''
                        });
                        setNotes(noteObligatory);
                    }
                }
            }
            if (oldJustifyNoNeedLME === KEY_EXCEPCION && keyJustify !== KEY_EXCEPCION) {
                oldJustifyNoNeedLME = val;
                const notesWithoutNoGeren = _.remove(notes.toArray(), (note) => {
                    if (idExeptionNoNeedLME === parseInt(note.combo)) {
                        deleteNote(note.uid);
                        return false;
                    } else {
                        return true
                    }
                });
                let isValidNotesDescription = true;
                _.forEach(notesWithoutNoGeren, (note) => {
                    isValidNotesDescription = !_.isEmpty(note.body)
                });
                if (isValidNotesDescription) {
                    updateErrorsNotes(false);
                }
            }
        } else {
            infoJustificationNeedLME = false;
            oldJustifyNoNeedLME = KEY_EXCEPCION;
        }
    }

    _handleGroupEconomicFind() {
        const { fields: { groupEconomic }, economicGroupsByKeyword } = this.props;
        economicGroupsByKeyword(groupEconomic.value);
        groupEconomic.onChange('');
    }

    _handleBlurValueNumber(typeValidation, valuReduxForm, val) {
        var pattern;
        //Elimino los caracteres no validos
        for (var i = 0, output = '', validos = "0123456789"; i < (val + "").length; i++) {
            if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                output += val.toString().charAt(i)
            }
        }
        val = output;

        if (typeValidation === ALLOWS_NEGATIVE_INTEGER) {
            pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1,$2");
            }
            valuReduxForm.onChange(val);
        } else {
            var value = numeral(valuReduxForm.value).format('0');
            if (value >= 0) {
                pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(val)) {
                    val = val.replace(pattern, "$1,$2");
                }
                valuReduxForm.onChange(val);
            } else {
                valuReduxForm.onChange("");
            }
        }
    }


    _onChangeOperationsForeigns(val) {
        const { fields: { otherOperationsForeign }, selectsReducer, clientInformacion } = this.props;
        var dataOperationsForeigns = selectsReducer.get(constants.CLIENT_OPERATIONS_FOREIGN_CURRENCY);
        var idOptionOther = _.get(_.filter(dataOperationsForeigns, ['key', KEY_OPTION_OTHER_OPERATIONS_FOREIGNS]), '[0].id');
        var infoClient = clientInformacion.get('responseClientInfo');
        var originForeignsClient = _.isEmpty(infoClient.operationsForeigns) ? [] : _.split(infoClient.operationsForeigns, ',');
        var operationsForeignsSelected = [];
        if (countOperationsForeign < originForeignsClient.length) {
            operationsForeignsSelected = originForeignsClient;
            countOperationsForeign = countOperationsForeign + 1;
        } else {
            operationsForeignsSelected = _.split(val, ',');
        }

        if (idOptionOther === undefined || _.indexOf(operationsForeignsSelected, idOptionOther.toString()) === -1) {
            otherOperationsForeign.onChange('');
            otherOperationsForeignEnable = 'disabled';
            this.setState({
                otherOperationsForeignEnable: 'disabled'
            });
        } else {
            otherOperationsForeignEnable = '';
            this.setState({
                otherOperationsForeignEnable: ''
            });
        }
    }

    _onChangeOriginGoods(val) {
        const { fields: { otherOriginGoods }, selectsReducer, clientInformacion } = this.props;
        var dataOriginGoods = selectsReducer.get(constants.CLIENT_ORIGIN_GOODS);
        var idOptionOther = _.get(_.filter(dataOriginGoods, ['key', KEY_OPTION_OTHER_ORIGIN_GOODS]), '[0].id');
        var infoClient = clientInformacion.get('responseClientInfo');
        var originGoodsSelected = [];
        var originGoodsClient = _.isEmpty(infoClient.originGoods) ? [] : _.split(infoClient.originGoods, ',');
        
        if (countOriginGoods < originGoodsClient.length) {
            originGoodsSelected = originGoodsClient;
            countOriginGoods = countOriginGoods + 1;
        } else {
            originGoodsSelected = _.split(val, ',');
        }
        
        if (idOptionOther === undefined || _.indexOf(originGoodsSelected, idOptionOther.toString()) === -1) {
            otherOriginGoods.onChange('');
            otherOriginGoodsEnable = 'disabled';
            this.setState({
                otherOriginGoodsEnable: 'disabled'
            });
        } else {
            otherOriginGoodsEnable = '';
            this.setState({
                otherOriginGoodsEnable: ''
            });
        }
    }

    _onChangeOriginResource(val) {
        const { fields: { otherOriginResource }, selectsReducer, clientInformacion } = this.props;
        var dataOriginResource = selectsReducer.get(constants.CLIENT_ORIGIN_RESOURCE);
        var idOptionOther = _.get(_.filter(dataOriginResource, ['key', KEY_OPTION_OTHER_ORIGIN_RESOURCE]), '[0].id');
        var infoClient = clientInformacion.get('responseClientInfo');
        var originResourceSelected = [];
        var originResourcesClient = _.isEmpty(infoClient.originResources) ? [] : _.split(infoClient.originResources, ',');
        if (countOriginResource < originResourcesClient.length) {
            originResourceSelected = originResourcesClient;
            countOriginResource = countOriginResource + 1;
        } else {
            originResourceSelected = _.split(val, ',');
        }

        if (idOptionOther === undefined || _.indexOf(originResourceSelected, idOptionOther.toString()) === -1) {
            otherOriginResource.onChange('');
            otherOriginResourceEnable = 'disabled';
            this.setState({
                otherOriginResourceEnable: 'disabled'
            });
        } else {
            otherOriginResourceEnable = '';
            this.setState({
                otherOriginResourceEnable: ''
            });
        }
    }

    //Detecta el cambio en el select de country para ejecutar la consulta de province
    _onChangeCountry(val) {
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { fields: { country, province, city } } = this.props;
        country.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(constants.FILTER_PROVINCE_CLIENT, country.value);
        if (!_.isEqual(infoClient.addresses[0].country, country.value)) {
            province.onChange('');
            city.onChange('');
        }
    }

    //Detecta el cambio en el select de province para ejecutar la consulta de city
    _onChangeProvince(val) {
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { fields: { country, province, city } } = this.props;
        province.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(constants.FILTER_CITY_CLIENT, province.value);
        if (!_.isEqual(infoClient.addresses[0].province, province.value)) {
            city.onChange('');
        }
    }

    _onConfirmSaveJustClient() {
        this.setState({
            showConfirmSave: false
        });
        this._saveClient(BUTTON_EDIT);
    }

    clickButtonScrollTop() {
        clickButttonSave = true;
    }

    _onConfirmSaveAllClient() {
        this.setState({
            showConfirmSave: false
        });
        this._saveClient(BUTTON_UPDATE);
    }

    _saveClient(typeSave) {
        const {
            fields: {
                idTypeClient, idNumber, razonSocial, description, idCIIU, idSubCIIU, marcGeren, justifyNoGeren, addressClient,
            country, city, province, neighborhood, telephone, reportVirtual, extractsVirtual, annualSales,
            dateSalesAnnuals, liabilities, assets, operatingIncome, nonOperatingIncome, expenses, originGoods,
            originResource, centroDecision, necesitaLME, groupEconomic, justifyNoLME, justifyExClient, taxNature,
            detailNonOperatingIncome, otherOriginGoods, otherOriginResource, countryOrigin, operationsForeigns,
            originCityResource, operationsForeignCurrency, otherOperationsForeign, segment, subSegment, customerTypology },
            selectsReducer, clientInformacion, changeStateSaveData, clientProductReducer, fieldListReducer, objectListReducer
        } = this.props;
        const productsArray = [];
        clientProductReducer.map(map => {
            productsArray.push(_.omit(map, ['uid']))
        });
        const infoClient = clientInformacion.get('responseClientInfo');

        const clientDetailRequest = createClientDetailRequestFromReducer(fieldListReducer, objectListReducer, infoClient.id);

        const jsonCreateProspect = {
            "id": infoClient.id,
            "clientIdType": idTypeClient.value,
            "clientIdNumber": idNumber.value,
            "clientName": razonSocial.value,
            "clientStatus": infoClient.clientStatus,
            "riskRating": infoClient.riskRating,
            "isProspect": infoClient.isProspect,
            "ciiu": idCIIU.value,
            "idCiiu": idCIIU.value,
            "commercialRelationshipType": infoClient.commercialRelationshipType,
            "countryOfOrigin": infoClient.countryOfOrigin,
            "isDecisionCenter": centroDecision.value,
            "economicGroup": groupEconomic.value,
            "internalRating": infoClient.internalRating,
            "isic": infoClient.isic,
            "ratingHistory": infoClient.ratingHistory,
            "registrationKey": infoClient.registrationKey,
            "riskGroup": infoClient.riskGroup,
            "segment": segment.value,
            "subCiiu": idSubCIIU.value,
            "subSegment": subSegment.value,
            "countryOfFirstLevelManagement": infoClient.countryOfFirstLevelManagement,
            "countryOfMainMarket": infoClient.countryOfMainMarket,
            "relationshipStatus": infoClient.relationshipStatus,
            "typeOfClient": infoClient.typeOfClient,
            "status": infoClient.status,
            "isCreditNeeded": necesitaLME.value,
            "annualSales": (annualSales.value === undefined || annualSales.value === null || annualSales.value === '') ? null : numeral(annualSales.value).format('0'),
            "salesUpadateDate": dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined ? moment(dateSalesAnnuals.value, "DD/MM/YYYY").format('x') : null,
            "assets": (assets.value === undefined || assets.value === null || assets.value === '') ? null : numeral(assets.value).format('0'),
            "liabilities": (liabilities.value === undefined || liabilities.value === null || liabilities.value === '') ? null : numeral(liabilities.value).format('0'),
            "operatingIncome": (operatingIncome.value === undefined || operatingIncome.value === null || operatingIncome.value === '') ? null : numeral(operatingIncome.value).format('0'),
            "nonOperatingIncome": (nonOperatingIncome.value === undefined || nonOperatingIncome.value === null || nonOperatingIncome.value === '') ? null : numeral(nonOperatingIncome.value).format('0'),
            "expenses": (expenses.value === undefined || expenses.value === null || expenses.value === '') ? null : numeral(expenses.value).format('0'),
            "localMarket": infoClient.localMarket,
            "marketLeader": infoClient.marketLeader,
            "territory": infoClient.territory,
            "actualizationDate": infoClient.actualizationDate,
            "justificationForNoRM": marcGeren.value !== null && this.state.showJustifyNoGeren === false ? justifyNoGeren.value : '',
            "justificationForLostClient": justifyExClient.value,
            "justificationForCreditNeed": necesitaLME.value !== null && necesitaLME.value.toString() === 'false' ? justifyNoLME.value : '',
            "isVirtualStatement": extractsVirtual.value,
            "lineOfBusiness": infoClient.lineOfBusiness,
            "isManagedByRm": marcGeren.value,
            "addresses": [
                {
                    "typeOfAddress": 41,
                    "address": addressClient.value,
                    "country": country.value,
                    "province": province.value,
                    "city": city.value,
                    "neighborhood": neighborhood.value,
                    "isPrincipalAddress": reportVirtual.value,
                    "phoneNumber": telephone.value,
                    "postalCode": infoClient.addresses[0] === null ? "" : infoClient.addresses.postalCoode,
                }],
            "notes": notesArray,
            "description": description.value,
            "celulaId": infoClient.celulaId,
            "nitPrincipal": ((!_.isNull(groupEconomic.value) && !_.isEmpty(selectsReducer.get('dataEconomicGroup'))) ? _.get(_.filter(selectsReducer.get('dataEconomicGroup'), ['id', parseInt(groupEconomic.value)]), '[0].nitPrincipal') : null),
            "foreignProducts": productsArray,
            "originGoods": JSON.parse('[' + ((originGoods.value) ? originGoods.value : "") + ']'),
            "originResources": JSON.parse('[' + ((originResource.value) ? originResource.value : "") + ']'),
            "taxNature": taxNature.value,
            "detailNonOperatinIncome": detailNonOperatingIncome.value,
            "otherOriginGoods": otherOriginGoods.value,
            "otherOriginResource": otherOriginResource.value,
            "countryOriginId": countryOrigin.value,
            "originCityResource": originCityResource.value,
            "operationsForeignCurrency": operationsForeignCurrency.value ? (operationsForeignCurrency.value === 'false' ? 0 : 1) : '',
            "otherOperationsForeign": otherOperationsForeign.value,
            "operationsForeigns": JSON.parse('[' + ((operationsForeigns.value) ? operationsForeigns.value : "") + ']'),
            "idCustomerTypology": customerTypology.value,
            "clientType": infoClient.clientType,
            "saveMethod": BUTTON_EDIT  === typeSave ? EDIT_METHOD : UPDATE_METHOD,
            "clientDetailsRequest": clientDetailRequest
        };
                
        const { createProspect, updateClient, saveCreditStudy, swtShowMessage } = this.props;
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        createProspect(jsonCreateProspect).then((data) => {

            if (!validateWhileListResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_INVALID_INPUT);
                changeStateSaveData(false, "");
                return;
            }
            if (_.get(data, 'payload.data.status', 500) === 200) {
                saveCreditStudy(this._createJsonSaveContextClient()).then((response) => {
                    if (!validateResponse(response)) {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                        changeStateSaveData(false, "");
                        return;
                    }

                    if (!validateWhileListResponse(response)) {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_INVALID_INPUT);
                        changeStateSaveData(false, "");
                        return;
                    }

                    
                    if (validateResponse(response)) {
                        if (_.get(data, 'payload.data.status') === 200) {
                            
                            if (typeSave === BUTTON_EDIT) {
                                changeStateSaveData(false, "");
                                messageAlertSuccess = "Señor usuario, el cliente ha sido modificado exitosamente, pero la fecha de actualización no ha sido cambiada.";
                                this.setState({ showEx: true });
                            } else {
                                updateClient(UPDATE).then((data) => {
                                    if (!_.get(data, 'payload.data.validateLogin')) {
                                        changeStateSaveData(false, "");
                                        onSessionExpire();
                                    } else {
                                        changeStateSaveData(false, "");
                                        messageAlertSuccess = "Señor usuario, el cliente ha sido actualizado exitosamente. ";
                                        this.setState({ showEx: true });
                                    }
                                });
                            }
                        } else {
                            changeStateSaveData(false, "");
                            this.setState({ showErrorClientExists: true });
                        }
                    } else {
                        changeStateSaveData(false, "");
                        this.setState({ showEr: true });
                    }
                });
            } else {
                changeStateSaveData(false, "");
                this.setState({ showEr: true });
            }
        }, () => {
            changeStateSaveData(false, "");
            this.setState({ showEr: true });
        });

    }

    _createJsonSaveContextClient() {
        const {
            fields: {
                contextClientField, inventoryPolicy, customerTypology,
            controlLinkedPayments
            }, clientInformacion
        } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        const { contextClient } = infoClient;
        const listLineOfBusiness = clientInformacion.get('listParticipation');
        _.map(listLineOfBusiness, (item) => {
            item.id = item.id.toString().includes('line_') ? null : item.id;
            item.experience = replaceCommaInNumber(item.experience);
            return item;
        });
        const listDistribution = clientInformacion.get('listDistribution');
        _.map(listDistribution, (item) => {
            item.id = item.id.toString().includes('dist_') ? null : item.id;
            item.term = replaceCommaInNumber(item.term);
            return item;
        });
        const listMainCustomer = clientInformacion.get('listMainCustomer');
        _.map(listMainCustomer, (item) => {
            item.id = item.id.toString().includes('mainC_') ? null : item.id;
            item.term = replaceCommaInNumber(item.term);
            return item;
        });
        const listMainSupplier = clientInformacion.get('listMainSupplier');
        _.map(listMainSupplier, (item) => {
            item.id = item.id.toString().includes('mainS_') ? null : item.id;
            item.term = replaceCommaInNumber(item.term);
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
                'isDraft': true 
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
            contextClient.isDraft = true;
            return contextClient;
        }
    }

    handleShowMessage = () => {
        const { objectListReducer: { Oportunidades, Debilidades }} = this.props;
        if (Oportunidades.open || Debilidades.open) {
            this.setState({ showAlertListObjetcActive: true });
            return true;
        }
        return false;
    };

    //Edita el cliente después de haber validado los campos, solo acá se validan las notas
    _submitEditClient() {
        const { fields: { justifyNoGeren, marcGeren, necesitaLME, justifyNoLME }, notes, setNotes, tabReducer, selectsReducer, updateErrorsNotes, swtShowMessage } = this.props;
        notesArray = [];
        const dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
        const idExcepcionNoGerenciado = String(_.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_GERENCIADO]), '[0].id'));
        const idExcepcionNoNeedLME = String(_.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_NECESITA_LME]), '[0].id'));
        let existNoteExceptionNoGeren = false;
        let existNoteExceptionNoNeedLME = false;
        notes.map(map => {
            if (map.combo === idExcepcionNoGerenciado) {

                existNoteExceptionNoGeren = true;
            }
            if (map.combo === idExcepcionNoNeedLME) {

                existNoteExceptionNoNeedLME = true;
            }
            const noteItem = {
                "typeOfNote": map.combo,
                "note": map.body
            };
            notesArray.push(noteItem);
        });
        if (this.handleShowMessage()) {
            return;
        }
        const dataJustifyNoGeren = selectsReducer.get(constants.JUSTIFICATION_NO_RM);
        const idJustify = _.get(_.filter(dataJustifyNoGeren, ['key', KEY_DESMONTE]), '[0].id');
        const dataJustifyNoNeedLME = selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED);
        const idJustifyNoNeedLME = _.get(_.filter(dataJustifyNoNeedLME, ['key', KEY_EXCEPCION]), '[0].id');
        const addNoteNoGeren = (this.state.showJustifyNoGeren === false && idJustify === parseInt(justifyNoGeren.value) && !existNoteExceptionNoGeren);
        const addNoteNoNeedLME = (necesitaLME.value === 'false' && idJustifyNoNeedLME === parseInt(justifyNoLME.value) && !existNoteExceptionNoNeedLME);
        let errorInNotes = tabReducer.get('errorNotesEditClient');
        if (addNoteNoGeren && addNoteNoNeedLME) {

            setNotes([{
                typeOfNote: idExcepcionNoGerenciado,
                typeOfNoteKey: KEY_EXCEPCION_NO_GERENCIADO,
                note: ''
            }, {
                typeOfNote: idExcepcionNoNeedLME,
                typeOfNoteKey: KEY_EXCEPCION_NO_NECESITA_LME,
                note: ''
            }]);
            swtShowMessage('error', 'Edición de cliente', `Señor usuario, debe crear al menos una nota de tipo "${KEY_EXCEPCION_NO_GERENCIADO}" y una de tipo "${KEY_EXCEPCION_NO_NECESITA_LME}"`);
        } else if (addNoteNoGeren) {

            setNotes([{
                typeOfNote: idExcepcionNoGerenciado,
                typeOfNoteKey: KEY_EXCEPCION_NO_GERENCIADO,
                note: ''
            }]);
            swtShowMessage('error', 'Edición de cliente', `Señor usuario, debe crear al menos una nota de tipo "${KEY_EXCEPCION_NO_GERENCIADO}"`);
        } else if (addNoteNoNeedLME) {

            setNotes([{
                typeOfNote: idExcepcionNoNeedLME,
                typeOfNoteKey: KEY_EXCEPCION_NO_NECESITA_LME,
                note: ''
            }]);
            swtShowMessage('error', 'Edición de cliente', `Señor usuario, debe crear al menos una nota de tipo "${KEY_EXCEPCION_NO_NECESITA_LME}"`);
        } else if(errorInNotes){
            document.getElementById('dashboardComponentScroll').scrollTop = 0;

            return;
        } else {

            errorContact = tabReducer.get('errorConstact');
            errorShareholder = tabReducer.get('errorShareholder');
            if ((errorContact || errorShareholder) && idButton !== BUTTON_EDIT) {
                updateErrorsNotes(false);
                document.getElementById('dashboardComponentScroll').scrollTop = 0;

                return;
            }
            if ((_.isEqual(this.state.sumErrorsForm, 0) && !tabReducer.get('errorNotesEditClient')) || idButton === BUTTON_EDIT) {

                if (this.state.showFormAddLineOfBusiness || this.state.showFormAddDistribution || this.state.showFormAddMainClient ||
                    this.state.showFormAddMainSupplier || this.state.showFormAddMainCompetitor || this.state.showFormAddIntOperatrions) {

                    swtShowMessage('error', 'Error actualización cliente', 'Señor usuario, esta creando o editando un registro en alguna sección, debe terminarlo o cancelarlo para poder guardar.');
                } else {
                    if (idButton === BUTTON_UPDATE) {
                        this.setState({
                            showConfirmSave: true
                        });
                    } else {

                        this._saveClient(BUTTON_EDIT);
                    }
                }
            } else {

                document.getElementById('dashboardComponentScroll').scrollTop = 0;
            }
        }
    };

    componentDidMount() {

        const { clientInformacion, dispatchChangeObjectiveState } = this.props;

        document.getElementById('dashboardComponentScroll').scrollTop = 0;

        dispatchChangeObjectiveState({
            elements: clientInformationToReducer(clientInformacion.get("responseClientInfo").clientDetailsRequest.objectives)
        });

    }

    componentWillReceiveProps(nextProps) {
        const { fields: { operationsForeignCurrency, operationsForeigns, controlLinkedPayments }, clientInformacion, reducerGlobal } = nextProps;

        let { errors } = nextProps;

        const allowRiskGroupEdit = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), INFO_ESTUDIO_CREDITO), false);
        if (idButton === BUTTON_UPDATE && allowRiskGroupEdit) {
            if (clientInformacion.get('noAppliedControlLinkedPayments')) {
                errors = _.omit(errors, 'controlLinkedPayments');
            } else {
                if (!stringValidate(controlLinkedPayments.value)) {
                    errors.controlLinkedPayments = OPTION_REQUIRED;
                }
            }
        }

        if (otherOperationsForeignEnable == 'disabled') {
            errors = _.omit(errors, 'otherOperationsForeign');
        }
        
        const errorsArray = _.toArray(errors);
        this.setState({
            sumErrorsForm: errorsArray.length
        });
        if (operationsForeignCurrency.value.toString() === 'false' && operationsForeigns.value !== '') {
            operationsForeigns.onChange('');
        }
        this.setState({ shouldUpdate: true });
    }

    componentWillMount() {
        infoJustificationForNoRM = true;
        infoJustificationNeedLME = true;
        infoMarcaGeren = true;
        const {
            fields: { nitPrincipal, economicGroupName, originGoods, originResource, operationsForeigns }, updateTitleNavBar,
            clientInformacion, clearValuesAdressess, sendErrorsUpdate, setNotes, clearNotes,
            clearProducts, setProducts, updateErrorsNotes, showLoading
        } = this.props;

        updateErrorsNotes(false);
        clearValuesAdressess();
        clearNotes();
        clearProducts();

        if (isMethodEditClient) {
            updateTitleNavBar("Editar cliente");
        } else {
            updateTitleNavBar("Actualizar cliente");
        }

        var infoClient = clientInformacion.get('responseClientInfo');
        if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
            setNotes(infoClient.notes);
        }
        if (infoClient !== null && infoClient.foreignProducts !== null && infoClient.foreignProducts !== undefined && infoClient.foreignProducts !== '') {
            setProducts(infoClient.foreignProducts);
        }
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        } else {
            if (_.isEmpty(infoClient)) {
                sendErrorsUpdate([]);
                redirectUrl("/dashboard/clientInformation");
            } else {
                showLoading(true, MESSAGE_LOAD_DATA);
                const { economicGroupsByKeyword, consultList, consultListWithParameterUbication, getMasterDataFields } = this.props;                

                getMasterDataFields([constants.FILTER_COUNTRY, constants.JUSTIFICATION_CREDIT_NEED, constants.JUSTIFICATION_LOST_CLIENT,
                constants.JUSTIFICATION_NO_RM, constants.TYPE_NOTES, constants.CLIENT_TAX_NATURA, constants.CLIENT_ORIGIN_GOODS, constants.CUSTOMER_TYPOLOGY,
                constants.CLIENT_ORIGIN_RESOURCE, constants.CLIENT_OPERATIONS_FOREIGN_CURRENCY, constants.SEGMENTS, constants.CLIENT_ID_TYPE,
                constants.MANAGEMENT_BRAND, constants.CONTACT_ID_TYPE, constants.SUBSEGMENTS])
                    .then(() => {
                        if (infoClient.addresses !== null && infoClient.addresses !== '' && infoClient.addresses !== null) {
                            consultListWithParameterUbication(constants.FILTER_PROVINCE, infoClient.addresses[0].country);
                            consultListWithParameterUbication(constants.FILTER_CITY, infoClient.addresses[0].province);
                        }
                        var dataOriginGoods = JSON.parse('["' + _.join(infoClient.originGoods, '","') + '"]');
                        var dataOriginResource = JSON.parse('["' + _.join(infoClient.originResources, '","') + '"]');
                        var dataOperationsForeign = JSON.parse('["' + _.join(infoClient.operationsForeigns, '","') + '"]');


                        originGoods.onChange(dataOriginGoods);
                        originResource.onChange(dataOriginResource);
                        operationsForeigns.onChange(dataOperationsForeign);
                        showLoading(false, '');

                    }, () => {
                        showLoading(false, '');
                        this.setState({ showEx: true });
                    });
                consultList(constants.CIIU);
                if (infoClient.economicGroup !== null && infoClient.economicGroup !== '' && infoClient.economicGroup !== undefined && infoClient.economicGroup !== "null") {
                    economicGroupsByKeyword(infoClient.nitPrincipal);
                    nitPrincipal.onChange(infoClient.nitPrincipal);
                    economicGroupName.onChange(infoClient.economicGroupKey);
                }
            }
        }
    }

    _mapMessageErros(error, index) {
        return <div>
            <span key={index} style={{ marginLeft: "20px", fontSize: "12pt" }}>
                {error}
            </span>
        </div>
    }

    render() {
        const {
            fields: {
                razonSocial, idTypeClient, idNumber, description, idCIIU, idSubCIIU, addressClient, country, city, province, neighborhood,
            telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals, operationsForeigns,
            liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren, originGoods, originResource,
            centroDecision, necesitaLME, nitPrincipal, economicGroupName, justifyNoGeren, justifyNoLME, justifyExClient, taxNature,
            detailNonOperatingIncome, otherOriginGoods, otherOriginResource, countryOrigin, originCityResource, operationsForeignCurrency,
            otherOperationsForeign, segment, subSegment, customerTypology, contextClientField, inventoryPolicy,
            nameMainSupplier, participationMS, termMainSupplier,
            relevantInformationMainSupplier, typeOperationIntOpera,
            participationIntOpe, descriptionCoverageIntOpe, idCountryIntOpe,
            participationIntOpeCountry, customerCoverageIntOpe, controlLinkedPayments }, handleSubmit,
            tabReducer, selectsReducer, clientInformacion, validateContactShareholder, reducerGlobal, isPersonaNatural
        } = this.props;
        errorContact = tabReducer.get('errorConstact');
        errorShareholder = tabReducer.get('errorShareholder');
        var infoClient = clientInformacion.get('responseClientInfo');
        const allowChangeEconomicGroup = !infoClient.allowChangeEconomicGroup ? 'disabled' : '';

        const allowRiskGroupEdit = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), INFO_ESTUDIO_CREDITO), false);

        if (errorShareholder) {
            messageShareholder = 'Falta Accionistas';
        } else {
            messageShareholder = 'El cliente tiene información de accionista,';
        }
        if (errorContact) {
            messageContact = 'Falta Representante Legal';
        } else {
            messageContact = 'El cliente tiene información de Representante Legal,';

        }
        return (
            <form onSubmit={handleSubmit(this._submitEditClient)} style={{ backgroundColor: "#FFFFFF" }}>
                <SecurityMessageComponent />
                <div>
                    <p style={{ paddingTop: '10px' }}></p>
                    <Row xs={12} md={12} lg={12} style={idButton === BUTTON_EDIT ? EDIT_STYLE : UPDATE_STYLE}>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '20px' }}>

                            {this.state.sumErrorsForm > 0 || tabReducer.get('errorsMessage') > 0 || tabReducer.get('errorNotesEditClient') ?
                                <div>
                                    <span
                                        style={{ marginLeft: "20px", marginTop: "10px", color: "red", fontSize: "12pt" }}>Falta información obligatoria del cliente (ver campos seleccionados).</span>
                                </div>
                                :
                                <div>
                                    <span style={{
                                        marginLeft: "20px",
                                        marginTop: "10px",
                                        color: "green",
                                        fontSize: "12pt"
                                    }}>La información del cliente está completa, recuerde revisarla. </span>
                                </div>
                            }
                            {idButton === BUTTON_UPDATE ?
                                <div>
                                    <BottonContactAdmin errorContact={errorContact} message={messageContact}
                                        functionToExecute={validateContactShareholder} />
                                    <BottonShareholderAdmin errorShareholder={errorShareholder}
                                        message={messageShareholder}
                                        functionToExecute={validateContactShareholder} />
                                </div>
                                :
                                <div></div>
                            }
                        </Col>
                    </Row>
                </div>

                <ComponentInfoClient razonSocial={razonSocial} idTypeClient={idTypeClient} idNumber={idNumber}
                    segment={segment} subSegment={subSegment} description={description} customerTypology={customerTypology}
                    idButton={idButton} isMethodEditClient={isMethodEditClient} isPersonaNatural={isPersonaNatural}
                />
                
                <Objetivos />
                {!_.isEmpty(infoClient) && <SectionOpportunitiesWeaknesses infoClient={infoClient} visual={true}/>}
                <ActividadEconomica idSubCIIU={idSubCIIU} idCIIU={idCIIU} taxNature={taxNature} isMethodEditClient={isMethodEditClient} />
                <Row>

                    {allowRiskGroupEdit &&
                        <ContextEconomicActivity contextClientField={contextClientField} />
                    }
                    {allowRiskGroupEdit &&
                        <ComponentListLineBusiness
                            className={"listaLineasDeNegocios"}
                            showFormLinebusiness={this.state.showFormAddLineOfBusiness}
                            fnShowForm={this.showFormOut} />
                    }
                    {allowRiskGroupEdit &&
                        <ComponentListDistributionChannel
                            className={"canalesDeDistribucuion"}
                            showFormDistribution={this.state.showFormAddDistribution}
                            fnShowForm={this.showFormOut} />
                    }
                </Row>

                {allowRiskGroupEdit &&
                    <InventorPolicy inventoryPolicy={inventoryPolicy} />
                }
                {allowRiskGroupEdit &&
                    <ControlLinkedPayments controlLinkedPayments={controlLinkedPayments}
                        controlLinkedPaymentsRequired={idButton === BUTTON_UPDATE} />
                }
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Información de ubicación y correspondencia</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 5px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <dl style={{
                                            fontSize: "20px",
                                            color: "#505050",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <span className="section-title">Dirección sede principal</span>
                                        </dl>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="tab-content-row"
                                            style={{ borderTop: "1px solid #505050", width: "99%" }}></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Dirección {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Textarea
                                name="addressClient"
                                validateEnter={true}
                                type="text"
                                style={{ width: '100%', height: '100%' }}
                                max="250"
                                onChange={val => this._onchangeValue("addressClient", val)}
                                placeholder="Ingrese la dirección"
                                {...addressClient}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 20px 10px 0px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>País {drawRequiredField(!isMethodEditClient)}</span></dt>
                            <ComboBox
                                name="country"
                                labelInput="Seleccione país..."
                                {...country}
                                onChange={val => this._onChangeCountry(val)}
                                value={country.value}
                                onBlur={country.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(constants.FILTER_COUNTRY) || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Departamento/Provincia {drawRequiredField(!isMethodEditClient)}</span></dt>
                            <ComboBox
                                name="province"
                                labelInput="Seleccione departamento..."
                                {...province}
                                onChange={val => this._onChangeProvince(val)}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataTypeProvinceClient') || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "15px" }}>
                            <dt><span>Ciudad {drawRequiredField(!isMethodEditClient)}</span></dt>
                            <ComboBox
                                name="city"
                                labelInput="Seleccione ciudad..."
                                {...city}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataTypeCityClient') || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 20px 10px 20px" }}>
                    <Col xs={12} md={8} lg={8}>
                        <dt><span>Barrio</span></dt>
                        <dt style={{ marginRight: "17px" }}>
                            <Input
                                name="txtBarrio"
                                type="text"
                                max="40"
                                placeholder="Ingrese el barrio"
                                {...neighborhood}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs style={{ marginLeft: "10px" }}>
                        <dt>
                            <span>Teléfono {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt style={{ marginRight: "15px" }}>
                            <Input
                                name="txtTelefono"
                                type="text"
                                max="30"
                                placeholder="Ingrese el teléfono"
                                {...telephone}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "10px 0px 20px 20px", width: '100%' }}>
                    <Col xs>
                        <dt>
                            <span>¿Desea consultar sus extractos de forma virtual? {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt style={{ marginRight: "17px" }}>
                            <ComboBox
                                name="extractsVirtual"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                {...extractsVirtual}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs style={{ marginLeft: "10px" }}>
                        <dt>
                            <span>¿Desea recibir su reporte de costos consolidado de forma virtual? {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt style={{ marginRight: "15px" }}>
                            <ComboBox
                                name="reportVirtual"
                                labelInput="Seleccione..."
                                {...reportVirtual}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="suitcase icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Información financiera</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ventas anuales {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                type="text"
                                min={0}
                                onChange={val => this._onChangeValue("annualSales", val)}
                                placeholder="Ingrese las ventas anuales"
                                {...annualSales}
                                value={annualSales.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, annualSales, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Fecha de ventas anuales - DD/MM/YYYY {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <DateTimePickerUi culture='es' format={"DD/MM/YYYY"} time={false} {...dateSalesAnnuals}
                                touched={true} />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Activos {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                type="text"
                                onChange={val => this._onChangeValue("assets", val)}
                                placeholder="Ingrese los activos"
                                {...assets}
                                value={assets.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, assets, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Pasivos {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                type="text"
                                onChange={val => this._onChangeValue("liabilities", val)}
                                placeholder="Ingrese los pasivos"
                                {...liabilities}
                                value={liabilities.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, liabilities, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ingresos operacionales mensuales {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                onChange={val => this._onChangeValue("operatingIncome", val)}
                                min={0}
                                type="text"
                                placeholder="Ingrese los ingresos operacionales mensuales"
                                {...operatingIncome}
                                value={operatingIncome.value}
                                onBlur={val => this._handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, operatingIncome, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Egresos mensuales {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                type="text"
                                onChange={val => this._onChangeValue("expenses", val)}
                                placeholder="Ingrese los egresos mensuales"
                                {...expenses}
                                value={expenses.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, expenses, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ingresos no operacionales mensuales {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                type="text"
                                onChange={val => this._onChangeValue("nonOperatingIncome", val)}
                                placeholder="Ingrese los ingresos no operacionales mensuales"
                                {...nonOperatingIncome}
                                value={nonOperatingIncome.value}
                                onBlur={val => this._handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, nonOperatingIncome, val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={8} md={8} lg={8} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Detalle de ingresos no operacionales u originados en actividades diferente a la principal {drawRequiredField(!isMethodEditClient && numeral(nonOperatingIncome.value).format('0') > 0)}</span>
                        </dt>
                        <dt>
                            <Input
                                name="txtBarrio"
                                type="text"
                                max="250"
                                placeholder="Ingrese el detalle"
                                {...detailNonOperatingIncome}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                {allowRiskGroupEdit &&
                    <ComponentListMainClients
                        showFormMainClients={this.state.showFormAddMainClient}
                        className={"principalesClientes"}
                        fnShowForm={this.showFormOut} />
                }
                {allowRiskGroupEdit &&
                    <ComponentListMainSupplier nameSupplier={nameMainSupplier} participation={participationMS}
                        term={termMainSupplier} relevantInformation={relevantInformationMainSupplier}
                        showFormMainSupplier={this.state.showFormAddMainSupplier}
                        className={"principalesProveedores"}
                        fnShowForm={this.showFormOut} />
                }
                {allowRiskGroupEdit &&
                    <ComponentListMainCompetitor
                        className={"principalesCompetidores"}
                        showFormMainCompetitor={this.state.showFormAddMainCompetitor}
                        fnShowForm={this.showFormOut} />
                }

                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="book icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Datos de conocimiento comercial</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>Grupo económico/relación </span>
                            {idButton === BUTTON_UPDATE && <span>(<span style={{ color: "red" }}>*</span>)</span>}
                        </dt>
                        <dt>
                            <div className="ui search participantBanc fluid">
                                <ComboBoxFilter className="prompt" id="inputEconomicGroup"
                                    style={{ borderRadius: "3px" }}
                                    autoComplete="off"
                                    disabled={allowChangeEconomicGroup}
                                    type="text"
                                    {...economicGroupName}
                                    value={economicGroupName.value}
                                    onChange={this._onChangeGroupEconomic}
                                    placeholder="Ingrese un criterio de búsqueda..."
                                    onKeyPress={this.updateKeyValueUsersBanco}
                                    touched={true}
                                />
                            </div>
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>NIT principal </span>
                            {idButton === BUTTON_UPDATE && <span>(<span style={{ color: "red" }}>*</span>)</span>}
                        </dt>
                        <dt style={{ marginTop: '8px' }}>
                            <span style={{ fontWeight: 'normal' }}>{nitPrincipal.value}</span>
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "10px" }}>
                        <dt>
                            <span>Marca gerenciamiento {drawRequiredField(!isMethodEditClient)}</span> {!infoClient.isProspect &&
                                <div style={{ display: "inline" }}></div>}
                        </dt>
                        <dt>
                            <ComboBox
                                name="marcGeren"
                                labelInput="Seleccione marca..."
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(constants.MANAGEMENT_BRAND) || []}
                                {...marcGeren}
                                onChange={val => this._onChangeMarcGeren(val)}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </dt>
                    </Col>
                    <SelectsJustificacion
                        visible={this.state.showJustifyNoGeren}
                        title="Justificación no gerenciamiento"
                        labelInput="Seleccione..."
                        value={justifyNoGeren.value}
                        onBlur={justifyNoGeren.onBlur}
                        valueProp={"id"}
                        textProp={"value"}
                        parentId="dashboardComponentScroll"
                        justify={justifyNoGeren}
                        obligatory={!validateMarcManagement && !isMethodEditClient}
                        data={selectsReducer.get(constants.JUSTIFICATION_NO_RM) || []}
                        onChange={val => this._onChangeJustifyNoGeren(val)}
                        touched={true}

                    />
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>Centro de decisión {drawRequiredField(!isMethodEditClient)}</span> {!infoClient.isProspect &&
                                <div style={{ display: "inline" }}></div>}
                        </dt>
                        <dt>
                            <ComboBox
                                name="centroDecision"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                {...centroDecision}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>¿Necesita LME? {drawRequiredField(!isMethodEditClient)}</span> {!infoClient.isProspect &&
                                <div style={{ display: "inline" }}></div>}
                        </dt>
                        <dt>
                            <ComboBox
                                labelInput="Seleccione..."
                                {...necesitaLME}
                                value={necesitaLME.value}
                                onBlur={necesitaLME.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                touched={true}
                                onChange={val => this._onChangeValueNeedLME(val)}
                            />
                        </dt>
                    </Col>
                    <SelectsJustificacion
                        visible={necesitaLME.value}
                        title="Justificación no necesita LME"
                        labelInput="Seleccione..."
                        value={justifyNoLME.value}
                        onBlur={justifyNoLME.onBlur}
                        valueProp={"id"}
                        textProp={"value"}
                        justify={justifyNoLME}
                        obligatory={necesitaLME.value === 'false' && !isMethodEditClient}
                        data={selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED) || []}
                        onChange={val => this._onChangeValueJustifyNoNeedLME(val)}
                        touched={true}
                    />
                    <SelectsJustificacion
                        visible={'false'}
                        title="Justificación excliente"
                        labelInput="Seleccione..."
                        value={justifyExClient.value}
                        onBlur={justifyExClient.onBlur}
                        valueProp={"id"}
                        textProp={"value"}
                        justify={justifyExClient}
                        obligatory={false}
                        data={selectsReducer.get(constants.JUSTIFICATION_LOST_CLIENT) || []}
                        onChange={justifyExClient.onChange}
                        touched={true}
                    />
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="file outline icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Notas</span>
                        </div>
                    </Col>
                </Row>
                <NotesClient className={"notasEditClient"} />
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="money icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Declaración de origen de bienes y/o fondos</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 0px 0px" }}>
                    <Col xs={12} md={6} lg={6}>
                        <dl style={{ width: '100%' }}>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                                <dt><span>Origen de bienes {drawRequiredField(!isMethodEditClient)}</span></dt>
                                <dd>
                                    <MultipleSelect
                                        {...originGoods}
                                        name="multiOriginGoods"
                                        labelInput="Seleccione"
                                        valueProp={'id'}
                                        textProp={'value'}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(constants.CLIENT_ORIGIN_GOODS)}
                                        onChange={val => this._onChangeOriginGoods(val)}
                                        touched={true}
                                        maxSelections={MAXIMUM_OPERATIONS_FOREIGNS}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </Col>
                    <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>¿Cuál? {drawRequiredField(otherOriginGoodsEnable !== 'disabled' && !isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                name="txtOtherOriginGoods"
                                type="text"
                                max="200"
                                placeholder="Ingrese el detalle"
                                {...otherOriginGoods}
                                disabled={this.state.otherOriginGoodsEnable}
                                error={otherOriginGoodsEnable === 'disabled' ? null : otherOriginGoods.error}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 0px 0px" }}>
                    <Col xs={12} md={6} lg={6}>
                        <dl style={{ width: '100%' }}>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                                <dt><span>Origen de recursos {drawRequiredField(!isMethodEditClient)}</span></dt>
                                <dd>
                                    <MultipleSelect
                                        {...originResource}
                                        name="multiOriginResource"
                                        labelInput="Seleccione"
                                        valueProp={'id'}
                                        textProp={'value'}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(constants.CLIENT_ORIGIN_RESOURCE)}
                                        onChange={val => this._onChangeOriginResource(val)}
                                        touched={true}
                                        maxSelections={MAXIMUM_OPERATIONS_FOREIGNS}
                                    />
                                </dd>
                            </div>
                        </dl>
                    </Col>
                    <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>¿Cuál? {drawRequiredField(otherOriginResourceEnable !== 'disabled' && !isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                name="txtOtherOriginResource"
                                type="text"
                                max="200"
                                placeholder="Ingrese el detalle"
                                {...otherOriginResource}
                                disabled={this.state.otherOriginResourceEnable}
                                error={otherOriginResourceEnable === 'disabled' ? null : otherOriginResource.error}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 0px" }}>
                    <Col xs={12} md={6} lg={6}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>País de origen {drawRequiredField(!isMethodEditClient)}</span></dt>
                            <ComboBox
                                name="country"
                                labelInput="Seleccione país..."
                                {...countryOrigin}
                                value={countryOrigin.value}
                                onBlur={countryOrigin.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(constants.FILTER_COUNTRY) || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ciudad origen de los recursos {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt>
                            <Input
                                name="txtOriginCityResource"
                                type="text"
                                max="250"
                                placeholder="Ingrese el detalle"
                                {...originCityResource}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="world icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Información operaciones internacionales</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs>
                        <dt>
                            <span>¿Realiza operaciones en moneda extranjera? {drawRequiredField(!isMethodEditClient)}</span>
                        </dt>
                        <dt style={{ marginRight: "17px" }}>
                            <ComboBox
                                name="operationsForeignCurrency"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                {...operationsForeignCurrency}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs>
                        <dt>
                            <span>¿Cuál(es) de las siguientes operaciones realiza en moneda extranjera? {drawRequiredField(!isMethodEditClient && operationsForeignCurrency.value.toString() === 'true')} </span>
                        </dt>
                        <dt style={{ marginRight: "17px" }}>
                            <MultipleSelect
                                {...operationsForeigns}
                                name="operationsForeigns"
                                labelInput="Seleccione"
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                onChange={val => this._onChangeOperationsForeigns(val)}
                                onBlur={operationsForeigns.onBlur}
                                data={selectsReducer.get(constants.CLIENT_OPERATIONS_FOREIGN_CURRENCY)}
                                disabled={_.isEqual(operationsForeignCurrency.value, false) || _.isEqual(operationsForeignCurrency.value, 'false') || _.isNil(operationsForeignCurrency.value) ? 'disabled' : ''}
                                touched={true}
                                maxSelections={MAXIMUM_OPERATIONS_FOREIGNS}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>¿Cuál? {drawRequiredField(!isMethodEditClient && otherOperationsForeignEnable != 'disabled')}</span>
                        </dt>
                        <dt>
                            <Input
                                name="txtOtherOperationsForeign"
                                type="text"
                                max="200"
                                placeholder="Ingrese cuál"
                                {...otherOperationsForeign}
                                disabled={this.state.otherOperationsForeignEnable}
                                error={otherOperationsForeignEnable === 'disabled' ? null : otherOperationsForeign.error}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>

                {_.isEqual(operationsForeignCurrency.value, "true") && allowRiskGroupEdit &&
                    <ComponentListIntOperations typeOperation={typeOperationIntOpera} participation={participationIntOpe}
                        idCountry={idCountryIntOpe}
                        participationCountry={participationIntOpeCountry}
                        customerCoverage={customerCoverageIntOpe}
                        descriptionCoverage={descriptionCoverageIntOpe}
                        showFormIntOperations={this.state.showFormAddIntOperatrions}
                        fnShowForm={this.showFormOut} />
                }

                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="product hunt icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Descripción de los productos financieros en moneda extranjera</span>
                        </div>
                    </Col>
                </Row>
                <div style={{ marginBottom: "50px" }}>
                    <ProductsClient className={"productsClients"}/>
                </div>
                <div className="" style={{
                    marginTop: "50px",
                    position: "fixed",
                    border: "1px solid #C2C2C2",
                    bottom: "0px",
                    width: "100%",
                    marginBottom: "0px",
                    backgroundColor: "#F8F8F8",
                    height: "50px",
                    background: "rgba(255,255,255,0.75)"
                }}>
                    <div style={{ width: "400px", height: "100%", position: "fixed", right: "0px" }}>
                        {idButton === BUTTON_UPDATE ?
                            <button className="btn"
                                style={{ float: "right", margin: "8px 0px 0px 50px", position: "fixed" }}
                                onClick={this.clickButtonScrollTop} type="submit">
                                <span style={{ color: "#FFFFFF", padding: "10px" }}>Actualizar/Sarlaft</span>
                            </button>
                            :
                            <button className="btn"
                                style={{ float: "right", margin: "8px 0px 0px 120px", position: "fixed" }}
                                onClick={this.clickButtonScrollTop} type="submit">
                                <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                            </button>
                        }
                        <button className="btn btn-secondary modal-button-edit" onClick={this._closeWindow} style={{
                            float: "right",
                            margin: "8px 0px 0px 250px",
                            position: "fixed",
                            backgroundColor: "#C1C1C1"
                        }} type="button">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </div>
                </div>
                <ModalErrorsUpdateClient modalIsOpen={tabReducer.get('modalErrorsIsOpen')} />
                <SweetAlert
                    type="warning"
                    show={this.state.show}
                    title="Confirmación salida"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text="Señor usuario, perderá los cambios que no haya guardado. ¿Está seguro que desea salir de la vista de edición?"
                    showCancelButton={true}
                    onCancel={() => this.setState({ show: false })}
                    onConfirm={() => this._onConfirmExit()} />
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmSave}
                    title="Guardar/Actualizar"
                    confirmButtonColor='#2671d7'
                    confirmButtonText='Sí'
                    cancelButtonText="No"
                    text="¿Señor usuario, certifica que la información de su cliente, representante legal y accionistas se encuentra actualizada?"
                    showCancelButton={true}
                    onCancel={() => this._onConfirmSaveJustClient()}
                    onConfirm={() => this._onConfirmSaveAllClient()} />
                <SweetAlert
                    type="success"
                    show={this.state.showEx}
                    title="Edición de cliente"
                    text={messageAlertSuccess}
                    onConfirm={() => this._closeSuccess()}
                />
                <SweetAlert
                    type="success"
                    show={this.state.showExitoSaveNotUpdate}
                    title="Edición de cliente"
                    text={messageAlertSuccess}
                    onConfirm={() => this._closeSuccessSaveUpdate()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error editando cliente"
                    text="Señor usuario, ocurrió un error editando el cliente."
                    onConfirm={() => this._closeError()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showErrorClientExists}
                    title="Error editando cliente"
                    text='Señor usuario, el tipo y número de documento que desea guardar ya se encuentra registrado.'
                    onConfirm={() => this._closeError()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showAlertListObjetcActive}
                    title="Error editando cliente"
                    text="Señor usuario, esta creando o editando un registro en la sección de Oportunidades y Debilidades, debe terminarlo o cancelarlo para poder guardar."
                    onConfirm={() => this.setState({ showAlertListObjetcActive: false })}
                />
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultDataSelect,
        consultList,
        consultListWithParameter,
        consultListWithParameterUbication,
        economicGroupsByKeyword,
        getMasterDataFields,
        setNotes,
        deleteNote,
        clearNotes,
        clearProducts,
        setProducts,
        createProspect,
        clearValuesAdressess,
        changeStateSaveData,
        seletedButton,
        updateClient,
        sendErrorsUpdate,
        updateErrorsNotes,
        updateTitleNavBar,
        showLoading,
        swtShowMessage,
        validateContactShareholder,
        saveCreditStudy,
        dispatchChangeObjectiveState: changeObjectiveState
    }, dispatch);
}

function mapStateToProps({ clientInformacion, selectsReducer, clientProductReducer, tabReducer, notes, reducerGlobal, fieldListReducer, objectListReducer }) {
    const infoClient = clientInformacion.get('responseClientInfo');
    const { contextClient } = infoClient;

    isPersonaNatural = infoClient.clientTypeKey === 'Persona natural';


    idButton = tabReducer.get('seletedButton');

    isMethodEditClient = idButton === BUTTON_EDIT;

    return {
        clientInformacion,
        objectListReducer,
        selectsReducer,
        clientProductReducer,
        tabReducer,
        notes,
        reducerGlobal,
        isPersonaNatural,
        idButton,
        fieldListReducer,
        initialValues: {
            razonSocial: infoClient.clientName,
            idTypeClient: infoClient.clientIdType,
            idNumber: infoClient.clientIdNumber,
            description: infoClient.description,
            idCIIU: infoClient.idCiiu,
            idSubCIIU: infoClient.subCiiu,
            addressClient: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].address : '',
            country: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].country : '',
            province: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].province : '',
            neighborhood: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].neighborhood : '',
            city: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].city : '',
            telephone: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].phoneNumber : '',
            reportVirtual: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].isPrincipalAddress : '',
            extractsVirtual: infoClient.isVirtualStatement,
            annualSales: infoClient.annualSales === 0 ? '0' : fomatInitialStateNumber(infoClient.annualSales),
            dateSalesAnnuals: infoClient.salesUpadateDate !== '' && infoClient.salesUpadateDate !== null && infoClient.salesUpadateDate !== undefined ? moment(infoClient.salesUpadateDate).format('DD/MM/YYYY') : null,
            assets: infoClient.assets === 0 ? '0' : fomatInitialStateNumber(infoClient.assets),
            liabilities: infoClient.liabilities === 0 ? '0' : fomatInitialStateNumber(infoClient.liabilities),
            operatingIncome: infoClient.operatingIncome === 0 ? '0' : fomatInitialStateNumber(infoClient.operatingIncome),
            nonOperatingIncome: infoClient.nonOperatingIncome === 0 ? '0' : fomatInitialStateNumber(infoClient.nonOperatingIncome),
            expenses: infoClient.expenses === 0 ? '0' : fomatInitialStateNumber(infoClient.expenses),
            marcGeren: infoClient.isManagedByRm,
            centroDecision: infoClient.isDecisionCenter,
            necesitaLME: infoClient.isCreditNeeded,
            justifyNoGeren: infoClient.justificationForNoRM,
            justifyExClient: infoClient.justificationForLostClient,
            justifyNoLME: infoClient.justificationForCreditNeed,
            groupEconomic: infoClient.economicGroup,
            nitPrincipal: infoClient.nitPrincipal,
            taxNature: infoClient.taxNature,
            detailNonOperatingIncome: infoClient.detailNonOperatinIncome,
            originGoods: '',
            originResource: '',
            operationsForeigns: '',
            otherOriginGoods: infoClient.otherOriginGoods,
            otherOriginResource: infoClient.otherOriginResource,
            countryOrigin: infoClient.countryOriginId,
            originCityResource: infoClient.originCityResource,
            operationsForeignCurrency: infoClient.operationsForeignCurrency === 0 ? false : infoClient.operationsForeignCurrency === 1 ? true : '',
            otherOperationsForeign: infoClient.otherOperationsForeign,
            foreignProducts: infoClient.foreignProducts,
            segment: infoClient.segment,
            subSegment: infoClient.subSegment,
            customerTypology: _.isUndefined(infoClient.idCustomerTypology) ? null : infoClient.idCustomerTypology,
            contextClientField: _.isUndefined(contextClient) || _.isNull(contextClient) ? null : contextClient.context,
            inventoryPolicy: _.isUndefined(contextClient) || _.isNull(contextClient) ? null : contextClient.inventoryPolicy,
            controlLinkedPayments: _.isUndefined(contextClient) || _.isNull(contextClient) ? null : contextClient.controlLinkedPayments
        }
    };
}

function fomatInitialStateNumber(val) {
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(val + "")) {
        val = val.toString().replace(pattern, "$1,$2");
    }
    return val;
}

export default reduxForm({
    form: 'formClientEdit',
    fields,
    validate,
    onSubmitFail: () => {
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
    },
}, mapStateToProps, mapDispatchToProps)(clientEdit);