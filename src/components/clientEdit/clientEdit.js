import React, { Component } from "react";
import SweetAlert from "sweetalert-react";
import { bindActionCreators } from "redux";
import { updateTitleNavBar } from "../navBar/actions";
import {
    seletedButton, sendErrorsUpdate, updateClient, updateErrorsNotes,
    validateContactShareholder
} from "../clientDetailsInfo/actions";
import {Col, Row} from "react-flexbox-grid";
import {goBack, redirectUrl} from "../globalComponents/actions";
import {
    clearValuesAdressess, consultDataSelect, consultList, consultListWithParameter,
    consultListWithParameterUbication, economicGroupsByKeyword, getMasterDataFields
} from "../selectsComponent/actions";
import * as constants from "../selectsComponent/constants";
import {
    GOVERNMENT, FINANCIAL_INSTITUTIONS, CONSTRUCT_PYME, KEY_DESMONTE,
    KEY_EXCEPCION, KEY_EXCEPCION_NO_GERENCIADO, KEY_EXCEPCION_NO_NECESITA_LME,
    KEY_OPTION_OTHER_OPERATIONS_FOREIGNS, KEY_OPTION_OTHER_ORIGIN_GOODS,
    KEY_OPTION_OTHER_ORIGIN_RESOURCE, MAXIMUM_OPERATIONS_FOREIGNS, TITLE_DESCRIPTION
} from "./constants";
import {
    ALLOWS_NEGATIVE_INTEGER, DATE_REQUIERED, MESSAGE_LOAD_DATA, MESSAGE_SAVE_DATA,
    ONLY_POSITIVE_INTEGER, OPTION_REQUIRED, VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT,
    INFO_ESTUDIO_CREDITO
} from '../../constantsGlobal';

import { BUTTON_EDIT, BUTTON_UPDATE, UPDATE } from "../clientDetailsInfo/constants";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import MultipleSelect from "../../ui/multipleSelect/multipleSelectComponent";
import Input from "../../ui/input/inputComponent";
import Textarea from "../../ui/textarea/textareaComponent";
import { reduxForm } from "redux-form";
import DateTimePickerUi from "../../ui/dateTimePicker/dateTimePickerComponent";
import moment from "moment";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import NotesClient from "./notes/notesClient";
import ProductsClient from "./products/productList";
import { clearProducts, setProducts } from "./products/actions";
import { clearNotes, deleteNote, setNotes } from "./notes/actions";
import { createProspect } from "../propspect/actions";
import { changeStateSaveData } from "../dashboard/actions";
import BottonContactAdmin from "../clientDetailsInfo/bottonContactAdmin";
import BottonShareholderAdmin from "../clientDetailsInfo/bottonShareholderAdmin";
import ModalErrorsUpdateClient from "./modalErrorsUpdateClient";
import { swtShowMessage } from "../sweetAlertMessages/actions";
import numeral from "numeral";
import _ from "lodash";
import $ from "jquery";
import { showLoading } from "../loading/actions";
import {
    DISTRIBUTION_CHANNEL, INT_OPERATIONS, LINE_OF_BUSINESS, MAIN_CLIENTS,
    MAIN_COMPETITOR, MAIN_SUPPLIER
} from "../contextClient/constants";
import ClientTypology from "../contextClient/ClientTypology";
import ContextEconomicActivity from "../contextClient/contextEconomicActivity";
import ComponentListLineBusiness from "../contextClient/listLineOfBusiness/componentListLineBusiness";
import ComponentListDistributionChannel from "../contextClient/listDistributionChannel/componentListDistributionChannel";
import InventorPolicy from "../contextClient/inventoryPolicy";
import ControlLinkedPayments from "../contextClient/controlLinkedPayments";
import ComponentListMainClients from "../contextClient/listMainClients/componentListMainClients";
import ComponentListMainSupplier from "../contextClient/listMainSupplier/componentListMainSupplier";
import ComponentListMainCompetitor from "../contextClient/listMainCompetitor/componentListMainCompetitor";
import ComponentListIntOperations from "../contextClient/listInternationalOperations/componentListIntOperations";
import { saveCreditStudy } from "../clients/creditStudy/actions";
import { validateResponse, stringValidate, xssValidation } from "../../actionsGlobal";

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

const fields = ["razonSocial", "idTypeClient", "idNumber", "description", "idCIIU", "idSubCIIU", "addressClient", "country", "city",
    "province", "neighborhood", "district", "telephone", "reportVirtual", "extractsVirtual", "annualSales", "dateSalesAnnuals",
    "liabilities", "assets", "operatingIncome", "nonOperatingIncome", "expenses", "marcGeren", "operationsForeigns",
    "centroDecision", "necesitaLME", "groupEconomic", "nitPrincipal", "economicGroupName", "justifyNoGeren", "justifyNoLME",
    "justifyExClient", "taxNature", "detailNonOperatingIncome", "otherOriginGoods", "originGoods", "originResource",
    "otherOriginResource", "countryOrigin", "originCityResource", "operationsForeignCurrency", "otherOperationsForeign",
    "segment", "subSegment", "customerTypology", "contextClientField", "contextLineBusiness", "participationLB", "experience",
    "distributionChannel", "participationDC", "inventoryPolicy", "nameMainClient", "participationMC", "termMainClient",
    "relevantInformationMainClient", "nameMainSupplier", "participationMS", "termMainSupplier", "relevantInformationMainSupplier",
    "nameMainCompetitor", "participationMComp", "obsevationsCompetitor", "typeOperationIntOpera", "participationIntOpe",
    "idCountryIntOpe", "participationIntOpeCountry", "customerCoverageIntOpe", "descriptionCoverageIntOpe", "contributionDC",
    "contributionLB", "controlLinkedPayments"];

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
let validateMarcManagement = false;

//Controla si el campo Segmento esta seleccionado constructor pyme.
let isSegmentPymeConstruct = false;

let otherOperationsForeignEnable = 'disabled';
let otherOriginGoodsEnable = 'disabled';
let otherOriginResourceEnable = 'disabled';

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

const validate = (values, props) => {
    const {reducerGlobal} = props;
    const allowRiskGroupEdit = _.get(reducerGlobal.get('permissionsClients'), _.indexOf(reducerGlobal.get('permissionsClients'), INFO_ESTUDIO_CREDITO), false);
    
    const errors = {}
    let errorScrollTop = false;
 
    if (!values.razonSocial) {
        errors.razonSocial = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.razonSocial)) {
        errors.razonSocial = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.razonSocial = null;
    }

    if (!values.idTypeClient) {
        errors.idTypeClient = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.idTypeClient = null;
    }

    if (!values.idNumber) {
        errors.idNumber = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.idNumber)) {
        errors.idNumber = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.idNumber = null;
    }

    if (!values.idCIIU && idButton !== BUTTON_EDIT) {
        errors.idCIIU = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.idCIIU = null;
    }
    if (!values.idSubCIIU && idButton !== BUTTON_EDIT) {
        errors.idSubCIIU = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.idSubCIIU = null;
    }

    if (!values.addressClient && idButton !== BUTTON_EDIT) {
        errors.addressClient = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.addressClient)) {
        errors.addressClient = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.addressClient = null;
    }

    if (!values.telephone && idButton !== BUTTON_EDIT) {
        errors.telephone = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.telephone)) {
        errors.telephone = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.telephone = null;
    }

    if (!values.annualSales && idButton !== BUTTON_EDIT) {
        errors.annualSales = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.annualSales)) {
        errors.annualSales = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.annualSales = null;
    }

    if (!values.country && idButton !== BUTTON_EDIT) {
        errors.country = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.country = null;
    }

    if (!values.province && idButton !== BUTTON_EDIT) {
        errors.province = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.province = null;
    }

    if (!values.city && idButton !== BUTTON_EDIT) {
        errors.city = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.city = null;
    }

    if ((!values.dateSalesAnnuals || values.dateSalesAnnuals === '') && idButton !== BUTTON_EDIT ) {
        errors.dateSalesAnnuals = DATE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.dateSalesAnnuals)) {
        errors.dateSalesAnnuals = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.dateSalesAnnuals = null;
    }

    if (!values.liabilities && idButton !== BUTTON_EDIT) {
        errors.liabilities = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.liabilities)) {
        errors.liabilities = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.liabilities = null;
    }

    if (!values.assets && idButton !== BUTTON_EDIT) {
        errors.assets = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.assets)) {
        errors.assets = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.assets = null;
    }

    if (!values.operatingIncome && idButton !== BUTTON_EDIT) {
        errors.operatingIncome = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.operatingIncome)) {
        errors.operatingIncome = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.operatingIncome = null;
    }

    if (!values.nonOperatingIncome && idButton !== BUTTON_EDIT) {
        errors.nonOperatingIncome = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.nonOperatingIncome)) {
        errors.nonOperatingIncome = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.nonOperatingIncome = null;
    }

    if (!values.expenses && idButton !== BUTTON_EDIT) {
        errors.expenses = VALUE_REQUIERED;
        errorScrollTop = true;
    } else if (xssValidation(values.expenses)) {
        errors.expenses = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.expenses = null;
    }

    if ((values.marcGeren === null || values.marcGeren === undefined || values.marcGeren === '') && !isProspect && idButton !== BUTTON_EDIT) {
        errors.marcGeren = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.marcGeren = null;
    }

    if (validateMarcManagement === false && !values.justifyNoGeren && idButton !== BUTTON_EDIT) {
        errors.justifyNoGeren = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.justifyNoGeren = null;
    }

    if ((values.centroDecision === null || values.centroDecision === undefined || values.centroDecision === '') && !isProspect && idButton !== BUTTON_EDIT) {
        errors.centroDecision = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.centroDecision = null;
    }

    if ((values.necesitaLME === null || values.necesitaLME === undefined || values.necesitaLME === '') && !isProspect && idButton !== BUTTON_EDIT) {
        errors.necesitaLME = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.necesitaLME = null;
    }

    if (values.necesitaLME === 'false' && !values.justifyNoLME && idButton !== BUTTON_EDIT) {
        errors.justifyNoLME = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.justifyNoLME = null;
    }

    if ((values.reportVirtual === null || values.reportVirtual === undefined || values.reportVirtual === '') && idButton !== BUTTON_EDIT) {
        errors.reportVirtual = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.reportVirtual = null;
    }
    if ((values.extractsVirtual === null || values.extractsVirtual === undefined || values.extractsVirtual === '') && idButton !== BUTTON_EDIT) {
        errors.extractsVirtual = OPTION_REQUIRED;
        errorScrollTop = true;
    } else {
        errors.extractsVirtual = null;
    }

    if (otherOriginGoodsEnable !== 'disabled') {
        if ((values.otherOriginGoods === null || values.otherOriginGoods === undefined || values.otherOriginGoods === '') && idButton !== BUTTON_EDIT) {
            errors.otherOriginGoods = OPTION_REQUIRED;
            errorScrollTop = true;
        } else if (xssValidation(values.otherOriginGoods)) {
            errors.otherOriginGoods = VALUE_XSS_INVALID;
            errorScrollTop = true;
        } else {
            errors.otherOriginGoods = null;
        }
    }
    if (otherOriginResourceEnable !== 'disabled') {
        if ((values.otherOriginResource === null || values.otherOriginResource === undefined || values.otherOriginResource === '') && idButton !== BUTTON_EDIT) {
            errors.otherOriginResource = OPTION_REQUIRED;
            errorScrollTop = true;
        } else if (xssValidation(values.otherOriginResource)) {
            errors.otherOriginResource = VALUE_XSS_INVALID;
            errorScrollTop = true;
        } else {
            errors.otherOriginResource = null;
        }
    }
    if (otherOperationsForeignEnable !== 'disabled') {
        
        

        if ((values.otherOperationsForeign === null || values.otherOperationsForeign === undefined || values.otherOperationsForeign === '') && idButton !== BUTTON_EDIT) {
            
            
            
            errors.otherOperationsForeign = OPTION_REQUIRED;
            errorScrollTop = true;
        } else if (xssValidation(values.otherOperationsForeign)) {
            errors.otherOperationsForeign = VALUE_XSS_INVALID;
            errorScrollTop = true;
        } else {
            errors.otherOperationsForeign = null;
        }
    }else{
       
    }

    //Valido que el cliente tenga ciudad de origen de los recursos
    if (values.originCityResource) {
        if (xssValidation(values.originCityResource)) {
            errors.originCityResource = VALUE_XSS_INVALID;
            errorScrollTop = true;
        } else {
            errors.originCityResource = null;
        }
    }

    if (values.detailNonOperatingIncome) {
        if (xssValidation(values.detailNonOperatingIncome)) {
            errors.detailNonOperatingIncome = VALUE_XSS_INVALID;
            errorScrollTop = true;
        }else{
            errors.detailNonOperatingIncome = null;
        }
    }

    //Valido los campos que son necesarios para actualizar un cliente
    if (idButton === BUTTON_UPDATE) {
        if ((values.taxNature === null || values.taxNature === undefined || values.taxNature === '') && idButton !== BUTTON_EDIT) {
            errors.taxNature = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.taxNature = null;
        }

        //Valido si el cliente tiene ingresos no operaciones
        if ((values.nonOperatingIncome === null || values.nonOperatingIncome === undefined || values.nonOperatingIncome === '') && idButton !== BUTTON_EDIT) {
            errors.nonOperatingIncome = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.nonOperatingIncome = null;
            //En caso tal de que los ingresos operacionales sean mayor a 0, se debe de validar el de
            if (numeral(values.nonOperatingIncome).format('0') > 0) {
                if ((values.detailNonOperatingIncome === null || values.detailNonOperatingIncome === undefined || values.detailNonOperatingIncome === '') && idButton !== BUTTON_EDIT) {
                    errors.detailNonOperatingIncome = OPTION_REQUIRED;
                    errorScrollTop = true;
                } else if (xssValidation(values.detailNonOperatingIncome)) {
                    errors.detailNonOperatingIncome = VALUE_XSS_INVALID;
                    errorScrollTop = true;
                } else {
                    errors.detailNonOperatingIncome = null;
                }
            }
        }

        //Valido que el cliente tenga asociado el origen de los bienes
        if ((values.originGoods === null || values.originGoods === undefined || values.originGoods === '' || values.originGoods[0] === '') && idButton !== BUTTON_EDIT) {
            errors.originGoods = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.originGoods = null;
        }

        //Valido que el cliente tenga asociado el origen de los recursos
        if ((values.originResource === null || values.originResource === undefined || values.originResource === '' || values.originResource[0] === '') && idButton !== BUTTON_EDIT) {
            errors.originResource = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.originResource = null;
        }

        //Valido que el cliente tenga asociado el país de origen
        if ((values.countryOrigin === null || values.countryOrigin === undefined || values.countryOrigin === '') && idButton !== BUTTON_EDIT) {
            errors.countryOrigin = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.countryOrigin = null;
        }

        //Valido que el cliente tenga ciudad de origen de los recursos
        if ((values.originCityResource === null || values.originCityResource === undefined || values.originCityResource === '') && idButton !== BUTTON_EDIT) {
            errors.originCityResource = OPTION_REQUIRED;
            errorScrollTop = true;
        } else if (xssValidation(values.originCityResource)) {
            errors.originCityResource = VALUE_XSS_INVALID;
            errorScrollTop = true;
        } else {
            errors.originCityResource = null;
        }

        //Valido si el cliente realiza operaciones en moneda extranjera
        if ((values.operationsForeignCurrency === null || values.operationsForeignCurrency === undefined || values.operationsForeignCurrency === '') && idButton !== BUTTON_EDIT) {
            errors.operationsForeignCurrency = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            //En caso de que si realice operaciones, obligo a que me indique cuales
            errors.operationsForeignCurrency = null;
            if (values.operationsForeignCurrency.toString() === 'true') {
                if ((values.operationsForeigns === null || values.operationsForeigns === undefined || values.operationsForeigns === '' || values.operationsForeigns[0] === '') && idButton !== BUTTON_EDIT) {
                    
                    errors.operationsForeigns = OPTION_REQUIRED;
                    errorScrollTop = true;
                } else {
                    errors.operationsForeigns = null;
                }
            } else {
                values.operationsForeigns = null;
                errors.operationsForeigns = null;
            }
        }

        if ((!values.economicGroupName || !values.groupEconomic || !values.nitPrincipal) && idButton !== BUTTON_EDIT) {
            errors.economicGroupName = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.economicGroupName = null;
        }

        if ((!props.clientInformacion.get('noAppliedControlLinkedPayments') && !values.controlLinkedPayments) && idButton !== BUTTON_EDIT && allowRiskGroupEdit) {
           
            errors.controlLinkedPayments = OPTION_REQUIRED;
            errorScrollTop = true;
        } else {
            errors.controlLinkedPayments = null;
    }

    }

    if (!values.segment) {
        errors.segment = OPTION_REQUIRED;
    } else {
        const value = _.get(_.find(props.selectsReducer.get(constants.SEGMENTS), ['id', parseInt(values.segment)]), 'value');
        if (_.isEqual(CONSTRUCT_PYME, value) && idButton !== BUTTON_EDIT) {
            if (!values.subSegment) {
                errors.subSegment = OPTION_REQUIRED;
            } else {
                errors.subSegment = null;
            }
        }
        errors.segment = null;
    }



    if (xssValidation(values.description)) {
        errors.description = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.description = null;
    }

    if (xssValidation(values.neighborhood)) {
        errors.neighborhood = VALUE_XSS_INVALID;
        errorScrollTop = true;
    } else {
        errors.neighborhood = null;
    }

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

    //ComponentListLineBusiness
    //ComponentListDistributionChannel
    //ComponentListMainClients
    //ComponentListMainSupplier
    //ComponentListMainCompetitor
    //ComponentListIntOperations

    if (errorScrollTop && clickButttonSave) {
        //console.log("error faltan datos");
        clickButttonSave = false;
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
    }
   
  

    return errors;
};

//Componente genérico para cargar los selects de justificación
function SelectsJustificacion(props) {
    if (props.visible !== undefined && props.visible !== null && props.visible.toString() === "false") {
        return <Col xs={12} md={4} lg={4}>
            <dt>
                {props.title}
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
            showJustifyNoGeren: false
        };
        this._saveClient = this._saveClient.bind(this);
        this._submitEditClient = this._submitEditClient.bind(this);
        this._onChangeCIIU = this._onChangeCIIU.bind(this);
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
        this._changeSegment = this._changeSegment.bind(this);
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

    _updateValue(value) {
        const { fields: { nitPrincipal, groupEconomic, economicGroupName }, economicGroupsByKeyword } = this.props;
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

    //Detecta el cambio en el select de ciiu para ejecutar la consulta de subciiu
    _onChangeCIIU(val) {
        const { fields: { idCIIU, idSubCIIU } } = this.props;
        idCIIU.onChange(val);
        const { clientInformacion } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        const { consultListWithParameter } = this.props;
        consultListWithParameter(constants.SUB_CIIU, idCIIU.value);
        if (!_.isEqual(infoClient.ciiu, idCIIU.value)) {
            idSubCIIU.onChange('');
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
        const { fields: { otherOriginGoods, originGoods }, selectsReducer, clientInformacion } = this.props;
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
        consultListWithParameterUbication(constants.FILTER_PROVINCE, country.value);
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
        consultListWithParameterUbication(constants.FILTER_CITY, province.value);
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
                country, city, province, neighborhood, district, telephone, reportVirtual, extractsVirtual, annualSales,
                dateSalesAnnuals, liabilities, assets, operatingIncome, nonOperatingIncome, expenses, originGoods,
                originResource, centroDecision, necesitaLME, groupEconomic, justifyNoLME, justifyExClient, taxNature,
                detailNonOperatingIncome, otherOriginGoods, otherOriginResource, countryOrigin, operationsForeigns,
                originCityResource, operationsForeignCurrency, otherOperationsForeign, segment, subSegment, customerTypology
            },
            error, handleSubmit, selectsReducer, clientInformacion, changeStateSaveData, clientProductReducer
        } = this.props;
        const productsArray = [];
        clientProductReducer.map(map => {
            productsArray.push(_.omit(map, ['uid']))
        });
        const infoClient = clientInformacion.get('responseClientInfo');
        
        if (idButton === BUTTON_EDIT || (moment(dateSalesAnnuals.value, "DD/MM/YYYY").isValid() && dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined)) {
            
           

            const jsonCreateProspect = {
                "id": infoClient.id,
                "clientIdType": idTypeClient.value,
                "clientIdNumber": idNumber.value,
                "clientName": razonSocial.value,
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
                "segment": segment.value,
                "subCiiu": idSubCIIU.value,
                "subSegment": subSegment.value,
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
                "operationsForeignCurrency": operationsForeignCurrency.value? (operationsForeignCurrency.value === 'false' ? 0 : 1): '',
                "otherOperationsForeign": otherOperationsForeign.value,
                "operationsForeigns": JSON.parse('[' + ((operationsForeigns.value) ? operationsForeigns.value : "") + ']'),
                "idCustomerTypology": customerTypology.value
            };
           
            const { createProspect, sendErrorsUpdate, updateClient, saveCreditStudy } = this.props;
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            createProspect(jsonCreateProspect).then((data) => {
                if (_.get(data, 'payload.data.status', 500) === 200) {
                    saveCreditStudy(this._createJsonSaveContextClient()).then((response) => {
                        if (validateResponse(response)) {
                            if (_.get(data, 'payload.data.responseCreateProspect', false)) {
                                if (typeSave === BUTTON_EDIT) {
                                    changeStateSaveData(false, "");
                                    messageAlertSuccess = "Señor usuario, el cliente ha sido modificado exitosamente, pero la fecha de actualización no ha sido cambiada.";
                                    this.setState({ showEx: true });
                                } else {
                                    updateClient(UPDATE).then((data) => {
                                        if (!_.get(data, 'payload.data.validateLogin')) {
                                            changeStateSaveData(false, "");
                                            redirectUrl("/login");
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
            }, (reason) => {
                changeStateSaveData(false, "");
                this.setState({ showEr: true });
            });
        }
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
                noAppliedControlLinkedPayments
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
            return contextClient;
        }
    }

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
           
            errorContact = tabReducer.get('errorConstact');
            errorShareholder = tabReducer.get('errorShareholder');
            if ((errorContact || errorShareholder)  && idButton !== BUTTON_EDIT) {
                
                updateErrorsNotes(false);
                document.getElementById('dashboardComponentScroll').scrollTop = 0;
            }
            if ((_.isEqual(this.state.sumErrorsForm, 0) && _.isEqual(tabReducer.get('errorConstact'), false) && _.isEqual(tabReducer.get('errorShareholder'), false) && !tabReducer.get('errorNotesEditClient'))  || idButton === BUTTON_EDIT) {
               
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
        document.getElementById('dashboardComponentScroll').scrollTop = 0;
    }

    componentWillReceiveProps(nextProps) {
        const { fields: { operationsForeignCurrency, operationsForeigns, otherOriginGoods, originGoods, controlLinkedPayments }, clientInformacion, reducerGlobal } = nextProps;
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
        const errorsArray = _.toArray(errors);
        this.setState({
            sumErrorsForm: errorsArray.length
        });
        if (operationsForeignCurrency.value.toString() === 'false' && operationsForeigns.value !== '') {
            operationsForeigns.onChange('');
        }
    }

    componentWillMount() {
        infoJustificationForNoRM = true;
        infoJustificationNeedLME = true;
        infoMarcaGeren = true;
        const {
            fields: { nitPrincipal, economicGroupName, originGoods, originResource, operationsForeigns }, updateTitleNavBar,
            clientInformacion, clearValuesAdressess, sendErrorsUpdate, setNotes, clearNotes,
            clearProducts, setProducts, tabReducer, updateErrorsNotes, showLoading
        } = this.props;
        idButton = tabReducer.get('seletedButton');
        updateErrorsNotes(false);
        clearValuesAdressess();
        clearNotes();
        clearProducts();
        updateTitleNavBar("Actualizar/Editar cliente");
        var infoClient = clientInformacion.get('responseClientInfo');
        if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
            setNotes(infoClient.notes);
        }
        if (infoClient !== null && infoClient.foreignProducts !== null && infoClient.foreignProducts !== undefined && infoClient.foreignProducts !== '') {
            setProducts(infoClient.foreignProducts);
        }
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        } else {
            if (_.isEmpty(infoClient)) {
                sendErrorsUpdate([]);
                redirectUrl("/dashboard/clientInformation");
            } else {
                showLoading(true, MESSAGE_LOAD_DATA);
                const { economicGroupsByKeyword, selectsReducer, consultList, clientInformacion, consultListWithParameterUbication, getMasterDataFields } = this.props;
                getMasterDataFields([constants.FILTER_COUNTRY, constants.JUSTIFICATION_CREDIT_NEED, constants.JUSTIFICATION_LOST_CLIENT,
                    constants.JUSTIFICATION_NO_RM, constants.TYPE_NOTES, constants.CLIENT_TAX_NATURA, constants.CLIENT_ORIGIN_GOODS,
                    constants.CLIENT_ORIGIN_RESOURCE, constants.CLIENT_OPERATIONS_FOREIGN_CURRENCY, constants.SEGMENTS, constants.CLIENT_ID_TYPE,
                    constants.MANAGEMENT_BRAND])
                    .then((data) => {
                        if (infoClient.addresses !== null && infoClient.addresses !== '' && infoClient.addresses !== null) {
                            consultListWithParameterUbication(constants.FILTER_PROVINCE, infoClient.addresses[0].country);
                            consultListWithParameterUbication(constants.FILTER_CITY, infoClient.addresses[0].province);
                        }
                        var dataOriginGoods = JSON.parse('["' + _.join(infoClient.originGoods, '","') + '"]');
                        var dataOriginResource = JSON.parse('["' + _.join(infoClient.originResources, '","') + '"]');
                        var dataOperationsForeign = JSON.parse('["' + _.join(infoClient.operationsForeigns, '","') + '"]');
                        
                        this._changeSegment(infoClient.segment, true, infoClient.subSegment);
                        originGoods.onChange(dataOriginGoods);
                        originResource.onChange(dataOriginResource);
                        operationsForeigns.onChange(dataOperationsForeign);
                        showLoading(false, '');

                    }, (reason) => {
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

    _changeSegment(idSegment, firstConsult, subSegmentId) {
        const { fields: { segment, customerTypology, subSegment }, selectsReducer, getMasterDataFields, consultListWithParameterUbication } = this.props;
        const value = _.get(_.find(selectsReducer.get(constants.SEGMENTS), ['id', parseInt(idSegment)]), 'value');
        segment.onChange(idSegment);
        if (!_.isUndefined(value)) {
            if (_.isEqual(GOVERNMENT, value) || _.isEqual(FINANCIAL_INSTITUTIONS, value)) {
                consultListWithParameterUbication(constants.CUSTOMER_TYPOLOGY, idSegment);
            } else {
                getMasterDataFields([constants.CUSTOMER_TYPOLOGY], true);
            }
            if (_.isEqual(CONSTRUCT_PYME, value)) {
                consultListWithParameterUbication(constants.SUBSEGMENTS, idSegment).then((data) => {
                    if (!_.isNull(subSegmentId) && firstConsult) {
                        subSegment.onChange(subSegmentId);
                    }
                });
            }
            isSegmentPymeConstruct = _.isEqual(CONSTRUCT_PYME, value);
            if (!firstConsult) {
                customerTypology.onChange('');
                subSegment.onChange('');
            }
        }
    }

    render() {
        const {
            fields: {
                razonSocial, idTypeClient, idNumber, description, idCIIU, idSubCIIU, addressClient, country, city, province, neighborhood,
                district, telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals, operationsForeigns,
                liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren, originGoods, originResource,
                centroDecision, necesitaLME, nitPrincipal, groupEconomic, economicGroupName, justifyNoGeren, justifyNoLME, justifyExClient, taxNature,
                detailNonOperatingIncome, otherOriginGoods, otherOriginResource, countryOrigin, originCityResource, operationsForeignCurrency,
                otherOperationsForeign, segment, subSegment, customerTypology, contextClientField, contextLineBusiness,
                participationLB, experience, distributionChannel, participationDC, inventoryPolicy, nameMainClient, participationMC,
                termMainClient, relevantInformationMainClient, nameMainSupplier, participationMS, termMainSupplier,
                relevantInformationMainSupplier, nameMainCompetitor, participationMComp, obsevationsCompetitor, typeOperationIntOpera,
                participationIntOpe, contributionDC, contributionLB, descriptionCoverageIntOpe, idCountryIntOpe,
                participationIntOpeCountry, customerCoverageIntOpe, controlLinkedPayments
            }, handleSubmit,
            tabReducer, selectsReducer, clientInformacion, validateContactShareholder, reducerGlobal
        } = this.props;
        errorContact = tabReducer.get('errorConstact');
        errorShareholder = tabReducer.get('errorShareholder');
        var infoClient = clientInformacion.get('responseClientInfo');
        const isProspect = infoClient.isProspect;
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
                <Row style={{ padding: "10px 28px 10px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Razón social (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <dt>
                            <Input
                                name="razonSocial"
                                type="text"
                                max="150"
                                placeholder="Razón social del cliente"
                                {...razonSocial}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Tipo de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <dt>
                            <ComboBox
                                name="tipoDocumento"
                                labelInput="Tipo de documento del cliente"
                                {...idTypeClient}
                                value={idTypeClient.value}
                                onBlur={idTypeClient.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(constants.CLIENT_ID_TYPE)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <dt>
                            <Input
                                name="documento"
                                type="text"
                                max="20"
                                placeholder="Número de documento del cliente"
                                {...idNumber}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <div style={{ marginTop: "10px" }}>
                            <dt><span>Segmento (</span><span style={{ color: "red" }}>*</span>)</dt>
                            <ComboBox
                                name="segment"
                                labelInput="Segmento"
                                {...segment}
                                value={segment.value}
                                onBlur={segment.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                style={{ marginBottom: '0px !important' }}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(constants.SEGMENTS)}
                                onChange={(val) => this._changeSegment(val, false, null)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    {
                        isSegmentPymeConstruct && <Col xs={12} md={4} lg={4}>
                            <div style={{ marginTop: "10px" }}>
                                <dt><span>Subsegmento</span> {idButton !== BUTTON_EDIT &&(<span style={{ color: "red" }}>*</span>)}</dt>
                                <ComboBox
                                    name="subSegment"
                                    labelInput="Sebsegmento"
                                    {...subSegment}
                                    value={subSegment.value}
                                    onBlur={subSegment.onBlur}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    parentId="dashboardComponentScroll"
                                    data={selectsReducer.get(constants.SUBSEGMENTS)}
                                    touched={true}
                                    showEmptyObject={true}
                                />
                            </div>
                        </Col>
                    }
                    <ClientTypology customerTypology={customerTypology}
                        data={selectsReducer.get(constants.CUSTOMER_TYPOLOGY)} />

                    <Col xs={12} md={12} lg={12}>
                        <div style={{ marginTop: "10px" }}>
                            <dt>
                                <span>Breve descripción de la empresa</span>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "15px", cursor: "pointer", marginLeft: "2px" }}
                                    title={TITLE_DESCRIPTION} />
                            </dt>
                            <dt>
                                <Textarea
                                    name="description"
                                    type="text"
                                    style={{ width: '100%', height: '100%' }}
                                    onChange={val => this._onchangeValue("description", val)}
                                    placeholder="Ingrese la descripción"
                                    max="1000"
                                    rows={4}
                                    {...description}
                                />
                            </dt>
                        </div>
                    </Col>
                </Row>
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
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt><span>Naturaleza tributaria</span></dt>
                            <ComboBox
                                name="idtaxNature"
                                labelInput="Seleccione la naturaleza..."
                                {...taxNature}
                                onBlur={taxNature.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(constants.CLIENT_TAX_NATURA)}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs>
                        <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            <dt><span>CIIU</span></dt>
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
                    <Col xs>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt><span>SubCIIU</span></dt>
                            <ComboBox
                                name="idSubCIIU"
                                labelInput="Seleccione subCIIU..."
                                {...idSubCIIU}
                                onBlur={idSubCIIU.onBlur}
                                valueProp={'id'}
                                textProp={'subCiiu'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('dataSubCIIU')}
                                touched={true}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>
                    <Col xs>
                        <div style={{ paddingLeft: "20px", paddingRight: "35px", marginTop: "10px" }}>
                            <dt style={{ paddingBottom: "10px" }}><span>Subsector</span></dt>
                            <span style={{ width: "25%", verticalAlign: "initial" }}>
                                {(idSubCIIU.value !== "" && idSubCIIU.value !== null && idSubCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataSubCIIU'))) ? _.get(_.filter(selectsReducer.get('dataSubCIIU'), ['id', parseInt(idSubCIIU.value)]), '[0].economicSubSector') : ''}
                            </span>
                        </div>
                    </Col>
                    {allowRiskGroupEdit &&
                    <ContextEconomicActivity contextClientField={contextClientField} />
                    }
                    {allowRiskGroupEdit && 
                    <ComponentListLineBusiness contextLineBusiness={contextLineBusiness}
                                               participation={participationLB} experience={experience}
                                               showFormLinebusiness={this.state.showFormAddLineOfBusiness}
                        fnShowForm={this.showFormOut} contribution={contributionLB} />
                    }
                    {allowRiskGroupEdit &&
                    <ComponentListDistributionChannel distributionChannel={distributionChannel}
                                                      participation={participationDC} contribution={contributionDC}
                                                      showFormDistribution={this.state.showFormAddDistribution}
                        fnShowForm={this.showFormOut} />
                    }
                </Row>
                {allowRiskGroupEdit &&
                <InventorPolicy inventoryPolicy={inventoryPolicy}/>
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
                            <span>Dirección</span>
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
                            <dt><span>País</span></dt>
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
                            <dt><span>Departamento</span></dt>
                            <ComboBox
                                name="province"
                                labelInput="Seleccione departamento..."
                                {...province}
                                onChange={val => this._onChangeProvince(val)}
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
                            <dt><span>Ciudad</span></dt>
                            <ComboBox
                                name="city"
                                labelInput="Seleccione ciudad..."
                                {...city}
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
                    <Col xs={12} md={8} lg={8}>
                        <dt><span>Barrio</span></dt>
                        <dt style={{ marginRight: "17px" }}>
                            <Input
                                name="txtBarrio"
                                type="text"
                                max="120"
                                placeholder="Ingrese el barrio"
                                {...neighborhood}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <Col xs style={{ marginLeft: "10px" }}>
                        <dt>
                            <span>Teléfono</span>
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
                            <span>¿Desea consultar sus extractos de forma virtual?</span>
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
                            <span>¿Desea recibir su reporte de costos consolidado de forma virtual?</span>
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
                            <span>Ventas anuales</span>
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
                            <span>Fecha de ventas anuales - DD/MM/YYYY</span>
                        </dt>
                        <dt>
                            <DateTimePickerUi culture='es' format={"DD/MM/YYYY"} time={false} {...dateSalesAnnuals}
                                touched={true} />
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Activos</span>
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
                            <span>Pasivos</span>
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
                            <span>Ingresos operacionales mensuales</span>
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
                            <span>Egresos mensuales</span>
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
                            <span>Ingresos no operacionales mensuales</span>
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
                    <Col xs={8} md={8} lg={8} style={{ paddingRight: "20px" }}>
                        <dt>
                            <span>Detalle de ingresos no operacionales u originados en actividades diferente a la principal</span>
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
                <ComponentListMainClients nameClient={nameMainClient} participation={participationMC}
                                          term={termMainClient} relevantInformation={relevantInformationMainClient}
                                          showFormMainClients={this.state.showFormAddMainClient}
                    fnShowForm={this.showFormOut} />
                }
                {allowRiskGroupEdit &&
                <ComponentListMainSupplier nameSupplier={nameMainSupplier} participation={participationMS}
                                           term={termMainSupplier} relevantInformation={relevantInformationMainSupplier}
                                           showFormMainSupplier={this.state.showFormAddMainSupplier}
                    fnShowForm={this.showFormOut} />
                }
                {allowRiskGroupEdit &&
                <ComponentListMainCompetitor nameCompetitor={nameMainCompetitor} participation={participationMComp}
                                             observations={obsevationsCompetitor}
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
                            <span>Marca gerenciamiento </span> {!infoClient.isProspect &&
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
                        
                    />
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>Centro de decisión </span> {!infoClient.isProspect &&
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
                            <span>¿Necesita LME? </span> {!infoClient.isProspect &&
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
                        obligatory={true}
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
                <NotesClient />
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
                                <dt><span>Origen de bienes</span></dt>
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
                            <span>¿Cuál?</span>
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
                                <dt><span>Origen de recursos</span></dt>
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
                            <span>¿Cuál?</span>
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
                            <dt><span>País de origen</span></dt>
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
                            <span>Ciudad origen de los recursos</span>
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
                            <span>¿Realiza operaciones en moneda extranjera?</span>
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
                            <span>¿Cuál(es) de las siguientes operaciones realiza en moneda extranjera?</span>
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
                            <span>¿Cuál?</span>
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
                    <ProductsClient />
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
        saveCreditStudy
    }, dispatch);
}

function mapStateToProps({ clientInformacion, selectsReducer, clientProductReducer, tabReducer, notes, reducerGlobal }, ownerProps) {
    const infoClient = clientInformacion.get('responseClientInfo');
    const { contextClient } = infoClient;

    return {
        clientInformacion,
        selectsReducer,
        clientProductReducer,
        tabReducer,
        notes,
        reducerGlobal,
        initialValues: {
            razonSocial: infoClient.clientName,
            idTypeClient: infoClient.clientIdType,
            idNumber: infoClient.clientIdNumber,
            description: infoClient.description,
            idCIIU: infoClient.ciiu,
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
    form: 'submitValidation',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(clientEdit);
