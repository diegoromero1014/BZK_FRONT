import React from 'react'
import moment from "moment";
import $ from "jquery";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import numeral from "numeral";

import {goBack, redirectUrl} from "../globalComponents/actions";
import {Col, Row} from "react-flexbox-grid";

import * as constants from "../selectsComponent/constants";

import Textarea from "../../ui/textarea/textareaComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import Input from "../../ui/input/inputComponent";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import ModalErrorsUpdateClient from "../clientEdit/modalErrorsUpdateClient";

import SweetAlert from "sweetalert-react";

import NotesClient from "../clientEdit/notes/notesClient";

import { swtShowMessage } from "../sweetAlertMessages/actions";
import { changeStateSaveData } from "../dashboard/actions";
import { createProspect } from "../propspect/actions";
import { updateTitleNavBar } from "../navBar/actions";

import { clearNotes, deleteNote, setNotes } from "../clientEdit/notes/actions";
import {
    clearValuesAdressess, consultDataSelect, consultList, consultListWithParameter,
    consultListWithParameterUbication, economicGroupsByKeyword, getMasterDataFields
} from "../selectsComponent/actions";
import {
    ALLOWS_NEGATIVE_INTEGER, DATE_REQUIERED, MESSAGE_LOAD_DATA, MESSAGE_SAVE_DATA,
    ONLY_POSITIVE_INTEGER, OPTION_REQUIRED, VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../constantsGlobal';

import { xssValidation } from '../../actionsGlobal';

import {
    seletedButton, sendErrorsUpdate, updateClient, updateErrorsNotes,
    validateContactShareholder
} from "../clientDetailsInfo/actions";
import { BUTTON_EDIT, BUTTON_UPDATE, UPDATE } from "../clientDetailsInfo/constants";

import {
    GOVERNMENT, FINANCIAL_INSTITUTIONS, CONSTRUCT_PYME, KEY_DESMONTE,
    KEY_EXCEPCION, KEY_EXCEPCION_NO_GERENCIADO, KEY_EXCEPCION_NO_NECESITA_LME,
    KEY_OPTION_OTHER_OPERATIONS_FOREIGNS, KEY_OPTION_OTHER_ORIGIN_GOODS,
    KEY_OPTION_OTHER_ORIGIN_RESOURCE, MAXIMUM_OPERATIONS_FOREIGNS, TITLE_DESCRIPTION
} from "../clientEdit/constants";

import { showLoading } from "../loading/actions";

const fields = [
    'economicGroupName', 'nitPrincipal', 'groupEconomic', 'marcGeren', 'justifyNoGeren', 
    'centroDecision', 'necesitaLME', 'justifyNoLME', 'justifyExClient', 'taxNature', 'idCIIU', 'idSubCIIU', 
    'annualSales', 'assets', 'liabilities', 'operatingIncome', 'expenses', 'nonOperatingIncome', 'detailNonOperatingIncome',
    'dateSalesAnnuals', 'addressClient', 'country', 'province', 'city', 'telephone', 'razonSocial', 'idTypeClient', 'idNumber'
]
//Data para los select de respuesta "Si" - "No"
const valuesYesNo = [
    { 'id': '', 'value': "Seleccione..." },
    { 'id': true, 'value': "Si" },
    { 'id': false, 'value': "No" }
];

const EDIT_STYLE = {
    border: '1px solid #e5e9ec',
    backgroundColor: '#F8F8F8',
    borderRadius: '2px',
    margin: '0px 28px 0 20px',
    height: '60px'
};


var initValueJustifyNonGeren = false;
var initValueJustifyNonLME = false;
var notesArray = [];

let errorShareholder;
let errorContact;
let messageAlertSuccess;



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
//Establece si el cliente a editar es prospecto o no para controlar las validaciones de campos
let isProspect = false;
//Establece si el cliente a editar es prospecto o no para controlar las validaciones de campos
let isExclient = false;
//Valida si es necesario la justificacion para la marca de gerenciamiento
let validateMarcManagement = false;


const validate = (values, props) => {

    const errors = {}
    let errorScrollTop = false;

    if (!values.idCIIU && !isExclient) {
        errors.idCIIU = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.idCIIU = null;
    }

    if ((!values.economicGroupName || !values.groupEconomic || !values.nitPrincipal) && !isExclient) {
        errors.economicGroupName = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.economicGroupName = null;
    }

    if (!values.addressClient && !isExclient) {
        errors.addressClient = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.addressClient)) {
        errors.addressClient = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.addressClient = null;
    }

    if (!values.telephone && !isExclient) {
        errors.telephone = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.telephone)) {
        errors.telephone = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.telephone = null;
    }

    if (!values.country  && !isExclient) {
        errors.country = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.country = null;
    }

    if (!values.province  && !isExclient) {
        errors.province = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.province = null;
    }

    if (!values.city  && !isExclient) {
        errors.city = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.city = null;
    }

    if (!values.annualSales  && !isExclient) {
        errors.annualSales = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.annualSales)) {
        errors.annualSales = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.annualSales = null;
    }


    if ((!values.dateSalesAnnuals || values.dateSalesAnnuals === '')  && !isExclient) {
        errors.dateSalesAnnuals = DATE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.dateSalesAnnuals)) {
        errors.dateSalesAnnuals = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.dateSalesAnnuals = null;
    }

    if (!values.liabilities  && !isExclient) {
        errors.liabilities = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.liabilities)) {
        errors.liabilities = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.liabilities = null;
    }

    if (!values.assets  && !isExclient) {
        errors.assets = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.assets)) {
        errors.assets = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.assets = null;
    }

    if (!values.operatingIncome  && !isExclient) {
        errors.operatingIncome = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.operatingIncome)) {
        errors.operatingIncome = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.operatingIncome = null;
    }

    if (!values.nonOperatingIncome  && !isExclient) {
        errors.nonOperatingIncome = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.nonOperatingIncome)) {
        errors.nonOperatingIncome = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.nonOperatingIncome = null;
    }

    if (!values.expenses  && !isExclient) {
        errors.expenses = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.expenses)) {
        errors.expenses = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.expenses = null;
    }

    if ((values.marcGeren === null || values.marcGeren === undefined || values.marcGeren === '') && !isExclient) {
        errors.marcGeren = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.marcGeren = null;
    }

    if (validateMarcManagement === false && !values.justifyNoGeren  && !isExclient) {
        errors.justifyNoGeren = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.justifyNoGeren = null;
    }

    if ((values.centroDecision === null || values.centroDecision === undefined || values.centroDecision === '')  && !isExclient) {
        errors.centroDecision = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.centroDecision = null;
    }

    if ((values.necesitaLME === null || values.necesitaLME === undefined || values.necesitaLME === '')  && !isExclient) {
        errors.necesitaLME = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.necesitaLME = null;
    }

    if (values.necesitaLME === 'false' && !values.justifyNoLME  && !isExclient) {
        errors.justifyNoLME = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.justifyNoLME = null;
    }


    if (!values.justifyExClient && isExclient) {
        errors.justifyExClient = OPTION_REQUIRED;
        errorScrollTop = true;
    }else {
        errors.justifyExClient = null;
    }



    if (errorScrollTop && clickButttonSave) {
        clickButttonSave = false;
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
    }


    return errors

}




//Componente genérico para cargar los selects de justificación
function SelectsJustificacion(props) {
    if (props.visible !== undefined && props.visible !== null && props.visible.toString() === "false") {
        return <Col xs={12} md={4} lg={4}>
            <dt>
                <span>{props.title}</span>{props.isRequired && <span style={{ color: "red" }}>*</span>}
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
                    showEmptyObject={props.showEmptyObject ? true: false}
                />
            </dt>
        </Col>;
    } else {
        return <div></div>;
    }
}

class clientCertify extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            sumErrorsForm: false,
            showJustifyNoGeren: false
        }

        this._onChangeGroupEconomic = this._onChangeGroupEconomic.bind(this)
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this)
        this._onChangeMarcGeren = this._onChangeMarcGeren.bind(this);
        this._onChangeJustifyNoGeren = this._onChangeJustifyNoGeren.bind(this);
        this._onChangeValueNeedLME = this._onChangeValueNeedLME.bind(this);
        this._onChangeValueJustifyNoNeedLME = this._onChangeValueJustifyNoNeedLME.bind(this);
        this._closeWindow = this._closeWindow.bind(this);
        this._onChangeCIIU = this._onChangeCIIU.bind(this);
        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        this._submitCertifyClient = this._submitCertifyClient.bind(this);
        this._saveClient = this._saveClient.bind(this);
        this._closeSuccess = this._closeSuccess.bind(this);
        this._handleGroupEconomicFind = this._handleGroupEconomicFind.bind(this);
        this._onConfirmExit = this._onConfirmExit.bind(this);
        this._closeError = this._closeError.bind(this);
        this._onChangeCity = this._onChangeCity.bind(this);

    }

    componentWillUnmount() {
      
        const { sendErrorsUpdate, updateErrorsNotes } = this.props;
        sendErrorsUpdate([]);
        isProspect = false;
        oldJustifyGeren = '';
        oldJustifyNoNeedLME = '';
        infoJustificationForNoRM = true;
        infoJustificationNeedLME = true;
        clickButttonSave = false;

        initValueJustifyNonGeren = false;
        initValueJustifyNonLME = false;

        updateErrorsNotes(false);

    }

    componentWillMount() {

        infoJustificationForNoRM = true;
        infoJustificationNeedLME = true;
        infoMarcaGeren = true;

        const { fields: { nitPrincipal, economicGroupName  },   clientInformacion, getMasterDataFields, updateErrorsNotes, clearNotes, setNotes, consultList, updateTitleNavBar, consultListWithParameterUbication  } = this.props; 

        
        updateErrorsNotes(false);
        clearValuesAdressess();
        clearNotes();
        updateTitleNavBar("Certificar cliente");

        var infoClient = clientInformacion.get('responseClientInfo');

        if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
            setNotes(infoClient.notes);
        }

        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        } else {
            if (_.isEmpty(infoClient)) {
                
                redirectUrl("/dashboard/clientInformation");

            }else {

                showLoading(true, MESSAGE_LOAD_DATA);

                getMasterDataFields([constants.JUSTIFICATION_NO_RM,constants.TYPE_NOTES, constants.JUSTIFICATION_LOST_CLIENT, 
                    constants.JUSTIFICATION_CREDIT_NEED, constants.CLIENT_TAX_NATURA, constants.CLIENT_ID_TYPE, constants.FILTER_COUNTRY,
                    constants.MANAGEMENT_BRAND, constants.MANAGEMENT_BRAND_KEY])
                .then((data) => {
                    if (infoClient.addresses !== null && infoClient.addresses !== '' && infoClient.addresses !== null) {
                        consultListWithParameterUbication(constants.FILTER_PROVINCE, infoClient.addresses[0].country);
                        consultListWithParameterUbication(constants.FILTER_CITY, infoClient.addresses[0].province);
                    }

                    showLoading(false, '');
                }, (reason) => {
                    showLoading(false, '');
                    this.setState({ showEx: true });
                })

                consultList(constants.CIIU);
                if (infoClient.economicGroup !== null && infoClient.economicGroup !== '' && infoClient.economicGroup !== undefined && infoClient.economicGroup !== "null") {
                    economicGroupsByKeyword(infoClient.nitPrincipal);
                    nitPrincipal.onChange(infoClient.nitPrincipal);
                    economicGroupName.onChange(infoClient.economicGroupKey);
                }
            }

        }
    }

    componentWillReceiveProps(nextProps) {

        let { errors } = nextProps;

        const errorsArray = _.toArray(errors);

        this.setState({
            sumErrorsForm: errorsArray.length
        });
    
    }

    _closeError() {
        this.setState({ show: false, showEx: false, showEr: false, showErrorClientExists: false });
    }

    _handleGroupEconomicFind() {
        const { fields: { groupEconomic }, economicGroupsByKeyword } = this.props;
        economicGroupsByKeyword(groupEconomic.value);
        groupEconomic.onChange('');
    }

    _handleBlurValueNumber(typeValidation, valuReduxForm, val) {
        var pattern;
        //Elimino los caracteres no validos
        for (var i = 0, output = '', validos = "-0123456789"; i < (val + "").length; i++) {
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

    clickButtonScrollTop() {
        clickButttonSave = true;
    }

    _closeSuccess() {

        this.setState({ showExitAlert: false, showEx: false, showEr: false });
        
        goBack();
    }

    _saveClient() {

        const {
            fields: { 
                nitPrincipal, economicGroupName, originGoods, originResource, operationsForeigns, marcGeren, 
                justifyNoGeren, centroDecision, necesitaLME, justifyNoLME, justifyExClient,   taxNature, idCIIU, idSubCIIU,  
                annualSales, assets, liabilities, operatingIncome, expenses, nonOperatingIncome, detailNonOperatingIncome, dateSalesAnnuals,     
                addressClient, country, province, city, telephone, groupEconomic   
            },
            error, handleSubmit, selectsReducer, clientInformacion, changeStateSaveData
        } = this.props;
        
        const infoClient = clientInformacion.get('responseClientInfo');
        // ¿Porque existe esta validacion de fecha? Evita el guardado y no lanza error
        if (isExclient || moment(dateSalesAnnuals.value, "DD/MM/YYYY").isValid() && dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined) {
            const jsonCreateProspect = {
                "id": infoClient.id,
                "clientIdType": infoClient.clientIdType,
                "clientIdNumber": infoClient.clientIdNumber,
                "clientName": infoClient.clientName,
                "clientStatus": infoClient.clientStatus,
                "riskRating": infoClient.riskRating,
                "isProspect": infoClient.isProspect,
                "ciiu": idCIIU.value,
                "commercialRelationshipType": infoClient.commercialRelationshipType,
                "countryOfOrigin": infoClient.countryOfOrigin,
                "isDecisionCenter": centroDecision.value,
                "economicGroup": groupEconomic.value,
                "internalRating": infoClient.internalRating,
                "isic": infoClient.isic,
                "ratingHistory": infoClient.ratingHistory,
                "registrationKey": infoClient.registrationKey,
                "riskGroup": infoClient.riskGroup,
                "segment": infoClient.segment,
                "subCiiu": infoClient.subCiiu,
                "subSegment": infoClient.subSegment,
                "countryOfFirstLevelManagement": infoClient.countryOfFirstLevelManagement,
                "countryOfMainMarket": infoClient.countryOfMainMarket,
                "relationshipStatus": infoClient.relationshipStatus,
                "typeOfClient": infoClient.typeOfClient,
                "status": infoClient.status,
                "isCreditNeeded": necesitaLME.value,
                "annualSales": annualSales.value === undefined ? infoClient.annualSales : numeral(annualSales.value).format('0'),
                "salesUpadateDate": dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined ? moment(dateSalesAnnuals.value, "DD/MM/YYYY").format('x') : null,
                "assets": assets.value === undefined ? infoClient.assets : numeral(assets.value).format('0'),
                "liabilities": liabilities.value === undefined ? infoClient.liabilities : numeral(liabilities.value).format('0'),
                "operatingIncome": operatingIncome.value === undefined ? infoClient.operatingIncome : numeral(operatingIncome.value).format('0'),
                "nonOperatingIncome": nonOperatingIncome.value === undefined ? infoClient.nonOperatingIncome : numeral(nonOperatingIncome.value).format('0'),
                "expenses": expenses.value === undefined ? infoClient.expenses : numeral(expenses.value).format('0'),
                "localMarket": infoClient.localMarket,
                "marketLeader": infoClient.marketLeader,
                "territory": infoClient.territory,
                "actualizationDate": infoClient.actualizationDate,
                "justificationForNoRM": marcGeren.value !== null && this.state.showJustifyNoGeren === false ? justifyNoGeren.value : '',
                "justificationForLostClient": justifyExClient.value,
                "justificationForCreditNeed": necesitaLME.value !== null && necesitaLME.value.toString() === 'false' ? justifyNoLME.value : '',
                "isVirtualStatement": infoClient.isVirtualStatement,
                "lineOfBusiness": infoClient.lineOfBusiness,
                "isManagedByRm": marcGeren.value,
                "addresses": [
                    {
                        "typeOfAddress": 41,
                        "address": addressClient.value,
                        "country": country.value,
                        "province": province.value,
                        "city": city.value,
                        "neighborhood": infoClient.addresses[0] === null ? "" : infoClient.addresses[0].neighborhood,
                        "isPrincipalAddress": infoClient.addresses[0] === null ? "" : infoClient.addresses[0].isPrincipalAddress,
                        "phoneNumber": telephone.value,
                        "postalCode": infoClient.addresses[0] === null ? "" : infoClient.addresses.postalCoode,
                    }],
                "notes": notesArray,
                "description": infoClient.description,
                "celulaId": infoClient.celulaId,
                "nitPrincipal": ((!_.isNull(groupEconomic.value) && !_.isEmpty(selectsReducer.get('dataEconomicGroup'))) ? _.get(_.filter(selectsReducer.get('dataEconomicGroup'), ['id', parseInt(groupEconomic.value)]), '[0].nitPrincipal') : null),
                "foreignProducts": infoClient.foreignProducts,
                "originGoods": infoClient.originGoods,
                "originResources": infoClient.originResources,
                "taxNature": infoClient.taxNature,
                "detailNonOperatinIncome": infoClient.detailNonOperatinIncome,
                "otherOriginGoods": infoClient.otherOriginGoods,
                "otherOriginResource": infoClient.otherOriginResource,
                "countryOriginId": infoClient.countryOriginId,
                "originCityResource": infoClient.originCityResource,
                "operationsForeignCurrency": infoClient.operationsForeignCurrency,
                "otherOperationsForeign": infoClient.otherOperationsForeign,
                "operationsForeigns": infoClient.operationsForeigns,
                "idCustomerTypology": infoClient.idCustomerTypology
            };
            const { createProspect, sendErrorsUpdate, updateClient, saveCreditStudy } = this.props;
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            createProspect(jsonCreateProspect).then((data) => {
                if (_.get(data, 'payload.data.status', 500) === 200) {
                    
                    changeStateSaveData(false, "");
                    messageAlertSuccess = "Señor usuario, el cliente ha sido actualizado exitosamente. ";
                    this.setState({ showEx: true });
                    
                } else {
                    changeStateSaveData(false, "");
                    this.setState({ showEr: true });
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                this.setState({ showEr: true });
            });
        }

    }

    _submitCertifyClient() {

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
        const dataJustifyNoGeren = selectsReducer.get(constants.JUSTIFICATION_NO_RM);
        const idJustify = _.get(_.filter(dataJustifyNoGeren, ['key', KEY_DESMONTE]), '[0].id');
        const dataJustifyNoNeedLME = selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED);
        const idJustifyNoNeedLME = _.get(_.filter(dataJustifyNoNeedLME, ['key', KEY_EXCEPCION]), '[0].id');
        const addNoteNoGeren = (this.state.showJustifyNoGeren === false && idJustify === parseInt(justifyNoGeren.value) && !existNoteExceptionNoGeren);
        const addNoteNoNeedLME = (necesitaLME.value === 'false' && idJustifyNoNeedLME === parseInt(justifyNoLME.value) && !existNoteExceptionNoNeedLME);
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
        } else {

            if(!tabReducer.get('errorNotesEditClient')){
                
                this._saveClient()
            }else{
                
                document.getElementById('dashboardComponentScroll').scrollTop = 0;
            }

           
        }
    }

    _closeWindow() {

        this.setState({ showExitAlert: true });

    }

    _onConfirmExit() {
        this.setState({ showExitAlert: false })
        goBack();
    }

    _onChangeCountry(val) {
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { fields: { country, province, city } } = this.props;
        country.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(constants.FILTER_PROVINCE, country.value);
        if (!_.isEqual(infoClient.addresses[0].country, country.value)) {
            province.onChange('');
            city.onChange('');
        }
    }

    _onChangeProvince(val) {
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { fields: { country, province, city } } = this.props;
        province.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(constants.FILTER_CITY, province.value);
        if (!_.isEqual(infoClient.addresses[0].province, province.value)) {
            city.onChange('');
        }
    }

    _onChangeCity(val) {

        const { fields: { country, province, city }, selectsReducer } = this.props;

        city.onChange(val);
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
                        let economicGroup1 = _.get(data, 'payload.data.messageBody.economicGroupValueObjects');
                        let economicGroup2 = _.forEach(economicGroup1, function (data1) {
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

    _onChangeMarcGeren(val) {
        // Traer el selectReducer con el select de campos
        // Buscar el key que tenga el val
        const { selectsReducer, clientInformacion } = this.props;
        const optionMarcMagnament = selectsReducer.get(constants.MANAGEMENT_BRAND);

        let optionSelected = null;

        if(typeof optionMarcMagnament == 'undefined') {
            var infoClient = clientInformacion.get('responseClientInfo');
            // Crear el objeto optionSelected
            optionSelected = {key: infoClient.isManagedByRmKey};
        } else {
            for (let i=0; i<optionMarcMagnament.length; i++) {
                let option = optionMarcMagnament[i];
    
                
                if(val == option.id) {
                    optionSelected = option;
                    break;
                }
            }
        }

        // Si el key es Gerenciamiento a Demanda.
        if(optionSelected.key == 'Gerenciamiento a Demanda') {
            validateMarcManagement = false;
            this.setState({showJustifyNoGeren : false });
        } else {
            validateMarcManagement = true;
            this.setState({showJustifyNoGeren : true });
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


    _onChangeValueNeedLME(val) {
        const {
            fields: { necesitaLME, justifyNoLME }, clientInformacion,
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

    _onChangeCIIU(val) {
        const { fields: { idCIIU, idSubCIIU } } = this.props;
        idCIIU.onChange(val);
    }

    
    render(){

        const { fields: { nitPrincipal, economicGroupName, originGoods, originResource, operationsForeigns, marcGeren, 
            justifyNoGeren, centroDecision, necesitaLME, justifyNoLME, justifyExClient,   taxNature, idCIIU, idSubCIIU,  
            annualSales, assets, liabilities, operatingIncome, expenses, nonOperatingIncome, detailNonOperatingIncome, dateSalesAnnuals,     
            addressClient, country, province, city, telephone, razonSocial, idTypeClient, idNumber   }, handleSubmit, clientInformacion, selectsReducer, groupEconomic, tabReducer } = this.props;
        
        
        var infoClient = clientInformacion.get('responseClientInfo');
        isExclient = infoClient.relationshipStatusName === "Excliente";

        const allowChangeEconomicGroup = !infoClient.allowChangeEconomicGroup ? 'disabled' : '';

        return (

            <form onSubmit={handleSubmit(this._submitCertifyClient)} style={{ backgroundColor: "#FFFFFF" }}>

            { /* VENTANA DE ERRORES */ }

            <div>
                    <p style={{ paddingTop: '10px' }}></p>
                    <Row xs={12} md={12} lg={12} style={ EDIT_STYLE }>
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
                            
                        </Col>
                    </Row>
                </div>

                { /* FIN VENTANA DE ERRORES  */ }


                { /* INFORMACION CLIENTE */ }

                <Row style={{ padding: "10px 28px 10px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Razón social </span></dt>
                        <dt>
                            <Input
                                name="razonSocial"
                                type="text"
                                max="150"
                                placeholder="Razón social del cliente"
                                {...razonSocial}
                                disabled={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Tipo de documento </span></dt>
                        <dt>
                            
                            <Input
                                 name="tipoDocumento"
                                 type="text"
                                 placeholder="Tipo de documento del cliente"
                                 {...idTypeClient}
                                 disabled={true}
                                 touched={true}
                            />

                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Número de documento </span></dt>
                        <dt>
                            <Input
                                name="documento"
                                type="text"
                                max="20"
                                placeholder="Número de documento del cliente"
                                {...idNumber}
                                touched={true}
                                disabled={true}
                            />
                        </dt>
                    </Col>

                    </Row>

                { /* FIN INFORMACION CLIENTE*/ }


            <div>

                

                {/* Inicio Actividad Economica */}

                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="payment icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Actividad económica</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 0px" }}>
                    
                    <Col xs>
                        <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            <dt><span>CIIU</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="idCIIU"
                                labelInput="Seleccione CIIU..."
                                {...idCIIU}
                                onChange={val => this._onChangeCIIU(val)}
                                onBlur={idCIIU.onBlur}
                                valueProp={'id'}
                                textProp={'ciiu'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataCIIU')}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt style={{ paddingBottom: "10px" }}><span>Sector</span></dt>
                            <span style={{ width: "25%", verticalAlign: "initial", paddingTop: "5px" }}>
                                {(idCIIU.value !== "" && idCIIU.value !== null && idCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataCIIU'))) ? _.get(_.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)]), '[0].economicSector') : ''}
                            </span>
                        </div>
                    </Col>
                </Row>

                {/* Fin Actividad Economica */   }


                { /* Inicio Informacion de ubicación y correspondencia */ }

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
                            <span>Dirección</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
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
                            <dt><span>País</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
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
                            <dt><span>Departamento</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="province"
                                labelInput="Seleccione departamento..."
                                {...province}
                                onChange={val => this._onChangeProvince(val)}
                                value={province.value}
                                onBlur={province.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataTypeProvince') || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ paddingLeft: "20px", paddingRight: "15px" }}>
                            <dt><span>Ciudad</span>{!isExclient && <span style={{ color: "red" }}>*</span> }</dt>
                            <ComboBox
                                name="city"
                                labelInput="Seleccione ciudad..."
                                {...city}
                                value={city.value}
                                onBlur={city.onBlur}
                                onChange={val => this._onChangeCity(val)}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataTypeCity') || []}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 20px 10px 20px" }}>
                    
                    <Col xs style={{ marginLeft: "0" }}>
                        <dt>
                            <span>Teléfono</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
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

                { /* Fin Informacion de ubicación y correspondencia */ }


                {/* Inicio Informacion financiera  */}


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
                            <span>Ventas anuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                type="text"
                                min={0}
                                max="16"
                                onChange={val => this._onChangeValue("annualSales", val)}
                                placeholder="Ingrese las ventas anuales"
                                {...annualSales}
                                value={annualSales.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, annualSales, annualSales.value)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Fecha de ventas anuales - DD/MM/YYYY</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <DateTimePickerUi culture='es' format={"DD/MM/YYYY"} time={false} {...dateSalesAnnuals}
                                touched={true} />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Activos</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                type="text"
                                max="16"
                                onChange={val => this._onChangeValue("assets", val)}
                                placeholder="Ingrese los activos"
                                {...assets}
                                value={assets.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, assets, assets.value)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Pasivos</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                onChange={val => this._onChangeValue("liabilities", val)}
                                placeholder="Ingrese los pasivos"
                                {...liabilities}
                                value={liabilities.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, liabilities, liabilities.value)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ingresos operacionales mensuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                onChange={val => this._onChangeValue("operatingIncome", val)}
                                min={0}
                                max="16"
                                type="text"
                                placeholder="Ingrese los ingresos operacionales mensuales"
                                {...operatingIncome}
                                value={operatingIncome.value}
                                onBlur={val => this._handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, operatingIncome, operatingIncome.value)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Egresos mensuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                onChange={val => this._onChangeValue("expenses", val)}
                                placeholder="Ingrese los egresos mensuales"
                                {...expenses}
                                value={expenses.value}
                                onBlur={val => this._handleBlurValueNumber(ONLY_POSITIVE_INTEGER, expenses, expenses.value)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Ingresos no operacionales mensuales</span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                        </dt>
                        <dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                format="0,000"
                                min={0}
                                max="16"
                                type="text"
                                onChange={val => this._onChangeValue("nonOperatingIncome", val)}
                                placeholder="Ingrese los ingresos no operacionales mensuales"
                                {...nonOperatingIncome}
                                value={nonOperatingIncome.value}
                                onBlur={val => this._handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, nonOperatingIncome, nonOperatingIncome.value)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    
                </Row>


                {/*  Fin Informacion financiera   */}


                { /* Inicio Datos de conocimiento comercial */   }
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
                            <span>Grupo económico/relación </span>{!isExclient && <span style={{ color: "red" }}>*</span> }
                            
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
                            
                        </dt>
                        <dt style={{ marginTop: '8px' }}>
                            <span style={{ fontWeight: 'normal' }}>{nitPrincipal.value}</span>
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "10px" }}>
                        <dt>
                            <span>Marca gerenciamiento </span> {!isExclient && <span style={{ color: "red" }}>*</span> }
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
                        obligatory={true}
                        data={selectsReducer.get(constants.JUSTIFICATION_NO_RM) || []}
                        onChange={val => this._onChangeJustifyNoGeren(val)}
                        touched={true}
                        isRequired={!isExclient}
                        showEmptyObject={true}
                    />
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>Centro de decisión </span> {!isExclient && <span style={{ color: "red" }}>*</span> }
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
                            <span>¿Necesita LME? </span> {!isExclient && <span style={{ color: "red" }}>*</span> }
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
                        obligatory={true}
                        data={selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED) || []}
                        onChange={val => this._onChangeValueJustifyNoNeedLME(val)}
                        touched={true}
                        isRequired={!isExclient}
                        showEmptyObject={true}
                    />
                    <SelectsJustificacion
                        visible={isExclient ? 'false' : 'true' }
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
                        isRequired={isExclient}
                        showEmptyObject={true}
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
                
                <div  >
                    <NotesClient />
                </div>

                <div style={{height: "100px" }}>
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
                        
                            <button className="btn"
                                style={{ float: "right", margin: "8px 0px 0px 120px", position: "fixed" }}
                                    onClick={this.clickButtonScrollTop} type="submit">
                                <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                            </button>
                        
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
            </div>

            <ModalErrorsUpdateClient modalIsOpen={tabReducer.get('modalErrorsIsOpen')} />
                <SweetAlert
                    type="warning"
                    show={this.state.showExitAlert}
                    title="Confirmación salida"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text="Señor usuario, perderá los cambios que no haya guardado. ¿Está seguro que desea salir de la vista de certificación?"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showExitAlert: false })}
                    onConfirm={() => this._onConfirmExit()} />
                
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
                    text="Señor usuario, ocurrió un error certificando el cliente."
                    onConfirm={() => this._closeError()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showErrorClientExists}
                    title="Error editando cliente"
                    text='Señor usuario, el tipo y número de documento que desea guardar ya se encuentra registrado.'
                    onConfirm={() => this._closeError()}
                />

            </form>
        )
    }

}

function fomatInitialStateNumber(val) {
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(val + "")) {
        val = val.toString().replace(pattern, "$1,$2");
    }
    return val;
}

function mapStateToProps({ clientInformacion, selectsReducer, tabReducer, notes }, ownProps ) {
    const infoClient = clientInformacion.get('responseClientInfo');
    const { contextClient } = infoClient;

    return {
        clientInformacion,
        selectsReducer,
        notes,
        tabReducer,
        initialValues: {
            razonSocial: infoClient.clientName,
            idTypeClient: infoClient.clientNameType,
            idNumber: infoClient.clientIdNumber,
            marcGeren: infoClient.isManagedByRm,
            centroDecision: infoClient.isDecisionCenter,
            necesitaLME: infoClient.isCreditNeeded,
            justifyNoGeren: infoClient.justificationForNoRM,
            justifyExClient: infoClient.justificationForLostClient,
            justifyNoLME: infoClient.justificationForCreditNeed,
            idCIIU: infoClient.ciiu,
            groupEconomic: infoClient.economicGroup,
            annualSales: infoClient.annualSales === 0 ? '0' : fomatInitialStateNumber(infoClient.annualSales),
            dateSalesAnnuals: infoClient.salesUpadateDate !== '' && infoClient.salesUpadateDate !== null && infoClient.salesUpadateDate !== undefined ? moment(infoClient.salesUpadateDate).format('DD/MM/YYYY') : null,
            assets: infoClient.assets === 0 ? '0' : fomatInitialStateNumber(infoClient.assets),
            liabilities: infoClient.liabilities === 0 ? '0' : fomatInitialStateNumber(infoClient.liabilities),
            operatingIncome: infoClient.operatingIncome === 0 ? '0' : fomatInitialStateNumber(infoClient.operatingIncome),
            nonOperatingIncome: infoClient.nonOperatingIncome === 0 ? '0' : fomatInitialStateNumber(infoClient.nonOperatingIncome),
            expenses: infoClient.expenses === 0 ? '0' : fomatInitialStateNumber(infoClient.expenses),

            addressClient: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].address : '',
            country: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].country : '',
            province: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].province : '',
            neighborhood: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].neighborhood : '',
            city: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].city : '',
            telephone: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].phoneNumber : '',
            
        }
    }
}

function mapDispatchToProps(dispatch) {
      return bindActionCreators ({
        economicGroupsByKeyword,
        getMasterDataFields,
        setNotes,
        deleteNote,
        clearNotes,
        updateErrorsNotes,
        consultList,
        consultListWithParameterUbication,
        showLoading,
        swtShowMessage,
        changeStateSaveData,
        createProspect,
        sendErrorsUpdate,
        updateTitleNavBar
      }, dispatch)
}


export default reduxForm({
    form: 'clientCertify',
    fields, 
    validate
}, mapStateToProps, mapDispatchToProps)(clientCertify)
