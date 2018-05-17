import React, { Component } from 'react';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { toggleModalContact, createContactNew, searchContact, clearSearchContact } from './actions';
import { clearContactDelete } from '../actions';
import { contactsByClientFindServer, clearContactOrder, clearContactCreate, downloadFilePDF } from '../actions'
import { NUMBER_RECORDS } from '../constants';
import { bindActionCreators } from 'redux';
import SweetAlert from '../../sweetalertFocus';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { reduxForm } from 'redux-form';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import { changeStateSaveData } from '../../dashboard/actions';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import TextareaComponent from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import { getListContactGroupById } from '../favoritesGroup/actions';
import {
    consultDataSelect,
    consultList,
    consultListWithParameterUbication,
    getMasterDataFields
} from '../../selectsComponent/actions';
import { createErrorsPriority, shouldHandleError } from '../../../utils';
import { formValidateKeyEnter, nonValidateEnter, xssValidation } from '../../../actionsGlobal';
import { OrderedMap } from 'immutable';
import _ from 'lodash';
import {
    FILE_OPTION_SOCIAL_STYLE_CONTACT,
    MESSAGE_SAVE_DATA,
    OPTION_REQUIRED,
    VALUE_REQUIERED,
    INVALID_EMAIL,
    MESSAGE_LOAD_DATA,
    REGEX_SIMPLE_XSS,
    REGEX_SIMPLE_XSS_STRING,
    VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS_MESAGE
} from '../../../constantsGlobal';
import {
    FILTER_CITY,
    FILTER_PROVINCE,
    CONTACT_ID_TYPE,
    FILTER_CONTACT_POSITION,
    FILTER_TITLE,
    FILTER_GENDER,
    FILTER_DEPENDENCY,
    FILTER_COUNTRY,
    FILTER_TYPE_CONTACT_ID,
    FILTER_TYPE_LBO_ID,
    FILTER_FUNCTION_ID,
    FILTER_HOBBIES,
    FILTER_SPORTS,
    FILTER_SOCIAL_STYLE,
    FILTER_ATTITUDE_OVER_GROUP
} from '../../selectsComponent/constants';
import Tooltip from '../../toolTip/toolTipComponent';

const fields = ["id", "tipoDocumento", "numeroDocumento", "tipoTratamiendo", "tipoGenero", "primerNombre", "segundoNombre", "primerApellido", "segundoApellido",
    "tipoCargo", "tipoDependencia", "fechaNacimiento", "tipoEstiloSocial", "tipoActitud", "pais", "departamento", "ciudad", "direccion", "barrio",
    "codigoPostal", "telefono", "extension", "celular", "correo", "tipoContacto", "tipoEntidad", "tipoFuncion", "tipoHobbie", "tipoDeporte",
    "contactRelevantFeatures", "listaFavoritos"
];
const errors = {};
var thisForm;
const validate = (values) => {

    if (!values.tipoCargo) {
        errors.tipoCargo = OPTION_REQUIRED;
    } else {
        errors.tipoCargo = null;
    }

    if (!values.tipoDependencia) {
        errors.tipoDependencia = OPTION_REQUIRED;
    } else {
        errors.tipoDependencia = null;
    }

    if (!values.tipoFuncion) {
        errors.tipoFuncion = OPTION_REQUIRED;
    } else {
        errors.tipoFuncion = null;
    }

    if (!values.primerNombre) {
        errors.primerNombre = VALUE_REQUIERED;
    } else if (xssValidation(values.primerNombre)) {
        errors.primerNombre = VALUE_XSS_INVALID;
    } else {
        errors.primerNombre = null;
    }

    if (!values.primerApellido) {
        errors.primerApellido = VALUE_REQUIERED;
    } else if (xssValidation(values.primerApellido)) {
        errors.primerApellido = VALUE_XSS_INVALID;
    } else {
        errors.primerApellido = null;
    }

    if (!values.direccion || values.direccion === '') {
        errors.direccion = VALUE_REQUIERED;
    } else if (xssValidation(values.direccion)) {
        errors.direccion = VALUE_XSS_INVALID;
    } else {
        errors.direccion = null;
    }

    if (!values.telefono) {
        errors.telefono = VALUE_REQUIERED;
    } else if (xssValidation(values.telefono)) {
        errors.telefono = VALUE_XSS_INVALID;
    } else {
        errors.telefono = null;
    }

    if (!values.correo) {
        errors.correo = VALUE_REQUIERED;
    } else if (xssValidation(values.correo)) {
        errors.correo = VALUE_XSS_INVALID;
    } else {
        if (!(/\S+@\S+\.\S+/.test(values.correo))) {
            errors.correo = INVALID_EMAIL;
        } else {
            errors.correo = null;
        }
    }

    if (!values.tipoTratamiendo) {
        errors.tipoTratamiendo = OPTION_REQUIRED;
    } else {
        errors.tipoTratamiendo = null;
    }

    if (!values.tipoGenero) {
        errors.tipoGenero = OPTION_REQUIRED;
    } else {
        errors.tipoGenero = null;
    }

    if (!values.tipoContacto) {
        errors.tipoContacto = OPTION_REQUIRED;
    } else {
        errors.tipoContacto = null;
    }

    if (!values.pais) {
        errors.pais = OPTION_REQUIRED;
    } else {
        errors.pais = null;
    }

    if (!values.departamento) {
        errors.departamento = OPTION_REQUIRED;
    } else {
        errors.departamento = null;
    }

    if (!values.ciudad) {
        errors.ciudad = OPTION_REQUIRED;
    } else {
        errors.ciudad = null;
    }

    if (!values.numeroDocumento) {
        errors.numeroDocumento = VALUE_REQUIERED;
    } else if (xssValidation(values.numeroDocumento)) {
        errors.numeroDocumento = VALUE_XSS_INVALID;
    } else {
        errors.numeroDocumento = null;
    }

    if (xssValidation(values.segundoNombre)) {
        errors.segundoNombre = VALUE_XSS_INVALID;
    } else {
        errors.segundoNombre = null;
    }

    if (xssValidation(values.segundoApellido)) {
        errors.segundoApellido = VALUE_XSS_INVALID;
    } else {
        errors.segundoApellido = null;
    }

    if (xssValidation(values.barrio)) {
        errors.barrio = VALUE_XSS_INVALID;
    } else {
        errors.barrio = null;
    }

    if (xssValidation(values.codigoPostal)) {
        errors.codigoPostal = VALUE_XSS_INVALID;
    } else {
        errors.codigoPostal = null;
    }

    if (xssValidation(values.extension)) {
        errors.extension = VALUE_XSS_INVALID;
    } else {
        errors.extension = null;
    }

    if (xssValidation(values.celular)) {
        errors.celular = VALUE_XSS_INVALID;
    } else {
        errors.celular = null;
    }

    if (xssValidation(values.contactRelevantFeatures)) {
        errors.contactRelevantFeatures = VALUE_XSS_INVALID;
    } else {
        errors.contactRelevantFeatures = null;
    }

    return errors;
};
class ModalComponentContact extends Component {

    constructor(props) {
        super(props);
        this._close = this._close.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._handleCreateContact = this._handleCreateContact.bind(this);
        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        this._searchContact = this._searchContact.bind(this);
        this._genero = this._genero.bind(this);
        this._onClickLimpiar = this._onClickLimpiar.bind(this);
        this._downloadFileSocialStyle = this._downloadFileSocialStyle.bind(this);
        this.state = {
            showEx: false,
            showEr: false,
            generoData: [],
            showErrorYa: false,
            noExiste: 'hidden',
            disabled: '',
            botonBus: 'block',
            disabledDep: 'disabled',
            disabledCiu: 'disabled',
            errorMap: OrderedMap(),
            showCam: false,
            showErrorXss: false,
            showErrorForm: false

        };
        momentLocalizer(moment);
        thisForm = this;
    }

    componentWillMount() {
        const {
            fields: { tipoDocumento }, getMasterDataFields, clearSearchContact,
            nonValidateEnter, getListContactGroupById
        } = this.props;
        nonValidateEnter(true);
        getListContactGroupById();
        clearSearchContact();
        this.props.resetForm();
        tipoDocumento.onChange('');
        getMasterDataFields([CONTACT_ID_TYPE, FILTER_TITLE, FILTER_CONTACT_POSITION, FILTER_GENDER, FILTER_DEPENDENCY, FILTER_COUNTRY, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE, FILTER_ATTITUDE_OVER_GROUP]);
    }

    _downloadFileSocialStyle() {
        const { downloadFilePDF } = this.props;
        downloadFilePDF(FILE_OPTION_SOCIAL_STYLE_CONTACT);
    }

    _close() {
        this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block' });
        this.setState({ showErrorYa: false });
    }

    _genero(val) {
        const { fields: { tipoTratamiendo, tipoGenero }, selectsReducer } = this.props;
        var femenino = ['Señora', 'Señorita', 'Doctora'];
        var masculino = ['Señor', 'Doctor', 'Padre'];
        var genero;
        var tratamiento = _.get(_.filter(selectsReducer.get(FILTER_TITLE), ['id', parseInt(val)]), '[0].key');
        if (_.indexOf(femenino, tratamiento) !== -1) {
            genero = _.filter(selectsReducer.get(FILTER_GENDER), ['key', 'Femenino']);
        } else if (_.indexOf(masculino, tratamiento) !== -1) {
            genero = _.filter(selectsReducer.get(FILTER_GENDER), ['key', 'Masculino']);
        } else {
            genero = selectsReducer.get(FILTER_GENDER);
        }
        this.setState({ disabledDep: '' });
        tipoGenero.onChange('');
        this.setState({ generoData: genero });
    }

    _onChangeCountry(val) {
        const { fields: { pais, departamento, ciudad } } = this.props;
        pais.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(FILTER_PROVINCE, pais.value);
        departamento.onChange('');
        ciudad.onChange('');
        this.setState({ disabledDep: '' });
    }

    _onChangeProvince(val) {
        const { fields: { pais, departamento, ciudad } } = this.props;
        departamento.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(FILTER_CITY, departamento.value);
        ciudad.onChange('');
        this.setState({ disabledCiu: '' });
    }

    _closeCreate() {
        const { clearSearchContact, isOpen, clearContactCreate, clearContactOrder } = this.props;
        clearSearchContact();
        //this.props.resetForm();
        this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block' });
        this.setState({ showEx: false });
        isOpen();
        clearContactOrder();
        clearContactCreate();
    }

    _onClickLimpiar() {
        const { clearSearchContact } = this.props;
        clearSearchContact();
        this.props.resetForm();
        this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block' });
        if (document.getElementById('modalComponentScrollCreateContact') !== null && document.getElementById('modalComponentScrollCreateContact') !== undefined) {
            setTimeout(function () {
                document.getElementById('modalComponentScrollCreateContact').scrollTop = 0;
            }, 500)
        }
    }

    _searchContact(e) {
        e.preventDefault();
        const {
            fields: {
                id, tipoDocumento, tipoTratamiendo, tipoGenero, tipoCargo, tipoDependencia, tipoEstiloSocial, tipoActitud, tipoContacto,
            numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, direccion, barrio,
            codigoPostal, telefono, extension, celular, correo, tipoEntidad, tipoFuncion, tipoHobbie, tipoDeporte, pais, departamento, ciudad,
            contactRelevantFeatures
            }, handleSubmit, error
        } = this.props;
        const { searchContact, clearSearchContact } = this.props;
        const documentNumber = _.isNull(numeroDocumento.value) ? null : numeroDocumento.value.trim();
        numeroDocumento.onChange(documentNumber);

        if (tipoDocumento.value && numeroDocumento.value) {

            if (xssValidation(numeroDocumento.value)) {
                this.setState({ showErrorXss: true });
                return;
            }

            searchContact(tipoDocumento.value, documentNumber, window.sessionStorage.getItem('idClientSelected')).then((data) => {
                if ((_.get(data, 'payload.data.isClientContact'))) {
                    clearSearchContact();
                    this.props.resetForm();
                    this.setState({ showErrorYa: true });
                } else {
                    this.setState({ disabled: 'disabled' });
                    this.setState({ noExiste: 'visible' });
                    this.setState({ botonBus: 'none' });
                    ciudad.onChange(JSON.parse(_.get(data, 'payload.data.contactDetail')).city);
                }
            }, (reason) => {
                this.setState({ showEr: true });
            });
        } else {
            this.setState({ showCam: true });
        }
    }


    _handleCreateContact() {
        const { createContactNew, contactsByClientFindServer, createContactReducer, changeStateSaveData } = this.props;
        const {
            fields: {
                id, tipoDocumento, tipoTratamiendo, tipoGenero, tipoCargo, tipoDependencia, tipoEstiloSocial, tipoActitud, tipoContacto,
            numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, direccion, barrio,
            codigoPostal, telefono, extension, celular, correo, tipoEntidad, tipoFuncion, tipoHobbie, tipoDeporte, pais, departamento, ciudad, contactRelevantFeatures, listaFavoritos
            }, handleSubmit, error
        } = this.props;
        var messageBody = {
            "id": id.value,
            "client": window.sessionStorage.getItem('idClientSelected'),
            "title": tipoTratamiendo.value,
            "gender": tipoGenero.value,
            "contactType": tipoDocumento.value,
            "contactIdentityNumber": numeroDocumento.value,
            "firstName": _.isNull(primerNombre.value) ? "" : primerNombre.value.trim(),
            "middleName": _.isNull(segundoNombre.value) ? "" : segundoNombre.value.trim(),
            "firstLastName": _.isNull(primerApellido.value) ? "" : primerApellido.value.trim(),
            "secondLastName": _.isNull(segundoApellido.value) ? "" : segundoApellido.value.trim(),
            "contactPosition": tipoCargo.value,
            "unit": tipoDependencia.value,
            "function": JSON.parse('[' + ((tipoFuncion.value) ? tipoFuncion.value : "") + ']'),
            "dateOfBirth": fechaNacimiento.value !== '' && fechaNacimiento.value !== null && fechaNacimiento.value !== undefined ? moment(fechaNacimiento.value, "DD/MM/YYYY").format('x') : null,
            "address": direccion.value,
            "country": pais.value,
            "province": departamento.value,
            "city": ciudad.value,
            "neighborhood": barrio.value,
            "postalCode": codigoPostal.value,
            "telephoneNumber": telefono.value,
            "extension": extension.value,
            "mobileNumber": celular.value,
            "emailAddress": _.isNull(correo.value) ? "" : correo.value.trim(),
            "hobbies": JSON.parse('[' + ((tipoHobbie.value) ? tipoHobbie.value : "") + ']'),
            "sports": JSON.parse('[' + ((tipoDeporte.value) ? tipoDeporte.value : "") + ']'),
            "typeOfContact": tipoContacto.value,
            "lineOfBusiness": JSON.parse('[' + ((tipoEntidad.value) ? tipoEntidad.value : "") + ']'),
            "socialStyle": tipoEstiloSocial.value,
            "attitudeOverGroup": tipoActitud.value,
            "contactRelevantFeatures": contactRelevantFeatures.value,
            "callFromModuleContact": false,
            "favoritesGroups": JSON.parse('[' + ((listaFavoritos.value) ? listaFavoritos.value : "") + ']')
        };
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        createContactNew(messageBody).then((data) => {
            changeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === "false") {
                redirectUrl("/login");
            } else {
                if ((_.get(data, 'payload.data.status') === 200)) {
                    this.setState({ showEx: true });
                    contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "", "", "", "");
                } else {
                    this.setState({ showEr: true });
                }
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            this.setState({ showEr: true });
        });
    }


    componentWillReceiveProps(props) {
        this.setState({
            errorMap: createErrorsPriority(props.fields, fields)
        });
    }

    render() {
        const { modalStatus, selectsReducer, createContactReducer, groupsFavoriteContacts } = this.props;
        const {
            initialValues, fields: {
                id, tipoDocumento, numeroDocumento, tipoTratamiendo, tipoGenero, tipoCargo,
                tipoDependencia, tipoEstiloSocial, tipoActitud, tipoPais, tipoContacto,
                primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, direccion, barrio,
                codigoPostal, telefono, extension, celular, correo, tipoEntidad, tipoFuncion, tipoHobbie, tipoDeporte, 
                pais, departamento, ciudad, contactRelevantFeatures, listaFavoritos
            }, handleSubmit, error, reducerGlobal
        } = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleCreateContact)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalComponentScrollCreateContact">
                    <dt className="business-title">
                        <span style={{ paddingLeft: '20px' }}>Información básica</span>
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Tipo de documento (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox name="tipoDocumento" labelInput="Seleccione"
                                        {...tipoDocumento}
                                        disabled={this.state.disabled}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Número de documento (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><Input
                                        name="numeroDocumento"
                                        type="text"
                                        max="20"
                                        disabled={this.state.disabled}
                                        {...numeroDocumento}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <button type="button" className="btn btn-primary"
                                        style={{ marginTop: '35px', display: this.state.botonBus }}
                                        onClick={this._searchContact}><i
                                            style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                                            className="search icon"></i></button>
                                    <button type="button" className="btn btn-primary"
                                        style={{ marginTop: '35px', visibility: this.state.noExiste }}
                                        onClick={this._onClickLimpiar}><i
                                            style={{ color: "white", margin: '0em', fontSize: '1.2em' }}
                                            className="erase icon" /></button>
                                </dl>
                            </Col>
                        </Row>
                        <Row style={{ visibility: this.state.noExiste }}>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Tratamiento (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox name="tipoTratamiendo" labelInput="Seleccione"
                                        {...tipoTratamiendo}
                                        onChange={val => this._genero(val)}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_TITLE) || []}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'tipoTratamiendo')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Género (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox name="tipoDocumento" labelInput="Seleccione"
                                        disabled={this.state.disabledDep}
                                        {...tipoGenero}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={this.state.generoData}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'tipoGenero')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Primer nombre (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd>
                                        <Input
                                            name="primerNombre"
                                            type="text"
                                            max="60"
                                            {...primerNombre}
                                            shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'primerNombre')}
                                        /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row style={{ visibility: this.state.noExiste }}>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Segundo nombre</span></dt>
                                    <dd><Input
                                        name="segundoNombre"
                                        type="text"
                                        max="60"
                                        {...segundoNombre}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Primer apellido (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><Input
                                        name="primerApellido"
                                        type="text"
                                        max="60"
                                        {...primerApellido}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'primerApellido')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Segundo apellido</span></dt>
                                    <dd><Input
                                        name="segundoApellido"
                                        type="text"
                                        max="60"
                                        {...segundoApellido}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row style={{ visibility: this.state.noExiste }}>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Cargo (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox name="tipoCargo" labelInput="Seleccione"
                                        {...tipoCargo}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_CONTACT_POSITION) || []}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'tipoCargo')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Área dependencia (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox name="tipoDependencia" labelInput="Seleccione"
                                        {...tipoDependencia}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_DEPENDENCY) || []}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'tipoDependencia')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Fecha nacimiento - DD/MM/YYYY</span></dt>
                                    <dd><DateTimePickerUi culture='es' format={"DD/MM/YYYY"}
                                        time={false} {...fechaNacimiento} /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row style={{ visibility: this.state.noExiste }}>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt>
                                        <span>Estilo social</span>
                                        <Tooltip text='Descargar archivo de estilo social'>
                                            <i onClick={this._downloadFileSocialStyle}
                                                style={{ marginLeft: "10px", cursor: "pointer" }}
                                                className="red file pdf outline icon" />
                                        </Tooltip>
                                    </dt>
                                    <dd><ComboBox name="tipoEstiloSocial" labelInput="Seleccione"
                                        {...tipoEstiloSocial}
                                        valueProp={'id'}
                                        textProp={'value'}

                                        data={selectsReducer.get(FILTER_SOCIAL_STYLE) || []}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Actitud frente al Grupo</span></dt>
                                    <dd><ComboBox name="tipoActitud" labelInput="Seleccione"
                                        {...tipoActitud}
                                        valueProp={'id'}
                                        textProp={'value'}

                                        data={selectsReducer.get(FILTER_ATTITUDE_OVER_GROUP) || []}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                    <dt style={{ visibility: this.state.noExiste }} className="col-md-12 business-title">
                        Información de ubicación y correspondencia
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', visibility: this.state.noExiste }}>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>País (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox
                                        name="pais"
                                        labelInput="Seleccione"
                                        {...pais}
                                        onChange={val => this._onChangeCountry(val)}
                                        value={pais.value}
                                        onBlur={pais.onBlur}
                                        valueProp={'id'}
                                        textProp={'value'}

                                        data={selectsReducer.get(FILTER_COUNTRY) || []}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'pais')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Departamento (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox
                                        name="departamento"
                                        labelInput="Seleccione"
                                        {...departamento}
                                        disabled={this.state.disabledDep}
                                        onChange={val => this._onChangeProvince(val)}
                                        value={departamento.value}
                                        onBlur={departamento.onBlur}
                                        valueProp={'id'}
                                        textProp={'value'}

                                        data={selectsReducer.get('dataTypeProvince')}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'departamento')}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Ciudad (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox
                                        name="ciudad"
                                        disabled={this.state.disabledCiu}
                                        labelInput="Seleccione"
                                        {...ciudad}
                                        valueProp={'id'}
                                        textProp={'value'}

                                        data={selectsReducer.get('dataTypeCity')}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'ciudad')}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Dirección (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd>
                                        <TextareaComponent
                                            name="direccion"
                                            validateEnter={true}
                                            type="text"
                                            max="250"
                                            style={{ width: '100%', height: '100%' }}
                                            onChange={val => this._onchangeValue("direccion", val)}
                                            rows={4}
                                            {...direccion}
                                            shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'direccion')}
                                        /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Barrio</span></dt>
                                    <dd><Input
                                        name="barrio"
                                        type="text"
                                        max="120"
                                        {...barrio}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Código postal</span></dt>
                                    <dd><Input
                                        name="codigoPostal"
                                        type="text"
                                        max="25"
                                        {...codigoPostal}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Teléfono (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><Input
                                        name="telefono"
                                        type="text"
                                        max="30"
                                        {...telefono}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'telefono')}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Extensión</span></dt>
                                    <dd><Input
                                        name="extension"
                                        type="text"
                                        max="20"
                                        {...extension}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Celular</span></dt>
                                    <dd><Input
                                        name="celular"
                                        type="text"
                                        max="30"
                                        {...celular}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Correo electrónico (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><Input
                                        name="correo"
                                        type="text"
                                        max="150"
                                        {...correo}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'correo')}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                    <dt style={{ visibility: this.state.noExiste }} className="col-md-12 business-title">
                        Clasificación de contacto
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', visibility: this.state.noExiste }}>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Tipo de contacto (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd><ComboBox name="tipoContacto" labelInput="Seleccione"
                                        {...tipoContacto}
                                        valueProp={'id'}
                                        textProp={'value'}

                                        data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                                        shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'tipoContacto')}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Entidad / Línea de negocio</span></dt>
                                    <dd><MultipleSelect name="tipoEntidad" labelInput="Seleccione"
                                        {...tipoEntidad}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Función (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                    <dd>
                                        <MultipleSelect name="tipoFuncion" labelInput="Seleccione"
                                            {...tipoFuncion}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                                            shouldHandleUpdate={shouldHandleError(this.state.errorMap, 'tipoFuncion')}
                                        />
                                    </dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                    <dt style={{ visibility: this.state.noExiste }} className="col-md-12 business-title">
                        Hobbies y Deportes
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', visibility: this.state.noExiste }}>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Hobbie</span></dt>
                                    <dd><MultipleSelect name="tipoHobbie" labelInput="Seleccione"
                                        {...tipoHobbie}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_HOBBIES) || []}
                                    /></dd>
                                </dl>
                            </Col>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Deporte</span></dt>
                                    <dd><MultipleSelect name="tipoDeporte" labelInput="Seleccione"
                                        {...tipoDeporte}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_SPORTS) || []}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Particularidades relevantes del contacto</span></dt>
                                    <dd>
                                        <TextareaComponent
                                            name="contactRelevantFeatures"
                                            validateEnter={true}
                                            type="text"
                                            max="1000"
                                            style={{ width: '100%', height: '100%' }}
                                            rows={4}
                                            {...contactRelevantFeatures}
                                        /></dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                    <dt style={{ visibility: this.state.noExiste }} className="col-md-12 business-title">
                        Favoritos
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', visibility: this.state.noExiste }}>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Grupo de contactos favoritos</span></dt>
                                    <dd><MultipleSelect name="listaFavoritos" labelInput="Seleccione"
                                        {...listaFavoritos}
                                        valueProp={'id'}
                                        textProp={'name'}
                                        data={groupsFavoriteContacts.get("listGroupFavorite") || []}
                                    /></dd>
                                </dl>
                            </Col>
                        </Row>            
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" style={{ visibility: this.state.noExiste }}
                        className="btn btn-primary modal-button-edit">Guardar
                    </button>
                </div>
                <SweetAlert
                    type="success"
                    show={this.state.showEx}
                    title="Creación de contacto"
                    text="Señor usuario, el contacto se creó de forma exitosa."
                    onConfirm={() => this._closeCreate()}
                />
                <SweetAlert
                    type="warning"
                    title="Advertencia"
                    show={this.state.showErrorYa}
                    text="Señor usuario, el cliente ya presenta una relación con el contacto buscado."
                    onConfirm={() => this._close()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error creando contacto"
                    text="Señor usuario, ocurrió un error creando el contacto."
                    onConfirm={() => this.setState({ showEr: false })}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showCam}
                    title="Campos obligatorios"
                    text="Señor usuario, debe seleccionar el tipo de documento e ingresar el documento del contacto."
                    onConfirm={() => this.setState({ showCam: false })}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showErrorXss}
                    title="Campos obligatorios"
                    text={REGEX_SIMPLE_XSS_MESAGE}
                    onConfirm={() => this.setState({ showErrorXss: false })}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showErrorForm}
                    title="Campos obligatorios"
                    text="Señor usuario, para crear un contacto debe ingresar los campos obligatorios."
                    onConfirm={() => this.setState({ showErrorForm: false })}
                />
            </form>
        );
    }
}

function mapStateToProps({ createContactReducer, selectsReducer, reducerGlobal, groupsFavoriteContacts }, { fields }) {
    const contactDetail = !createContactReducer.get('isClientContact') ? createContactReducer.get('responseSearchContactData') : false;
    if (contactDetail && contactDetail.contactIdentityNumber) {
        return {
            selectsReducer,
            reducerGlobal,
            groupsFavoriteContacts,
            initialValues: {
                id: contactDetail.id,
                tipoDocumento: contactDetail.contactType,
                numeroDocumento: contactDetail.contactIdentityNumber,
                tipoTratamiendo: contactDetail.title,
                tipoGenero: contactDetail.gender,
                primerNombre: contactDetail.firstName,
                segundoNombre: contactDetail.middleName,
                primerApellido: contactDetail.firstLastName,
                segundoApellido: contactDetail.secondLastName,
                tipoCargo: contactDetail.contactPosition,
                tipoDependencia: contactDetail.unit,
                fechaNacimiento: contactDetail.dateOfBirth !== '' && contactDetail.dateOfBirth !== null && contactDetail.dateOfBirth !== undefined ? moment(contactDetail.dateOfBirth).format('DD/MM/YYYY') : null,
                tipoEstiloSocial: contactDetail.socialStyle,
                tipoActitud: contactDetail.attitudeOverGroup,
                pais: contactDetail.country,
                departamento: contactDetail.province,
                ciudad: contactDetail.city,
                direccion: contactDetail.address,
                barrio: contactDetail.neighborhood,
                codigoPostal: contactDetail.postalCode,
                telefono: contactDetail.telephoneNumber,
                extension: contactDetail.extension,
                celular: contactDetail.mobileNumber,
                correo: contactDetail.emailAddress,
                contactRelevantFeatures: contactDetail.contactRelevantFeatures,
                tipoHobbie: JSON.parse('["' + _.join(contactDetail.hobbies, '","') + '"]'),
                tipoContacto: contactDetail.typeOfContact,
                tipoEntidad: JSON.parse('["' + _.join(contactDetail.lineOfBusiness, '","') + '"]'),
                tipoFuncion: contactDetail.function !== null && contactDetail.function !== "" && contactDetail.function !== undefined ? JSON.parse('["' + _.join(contactDetail.function, '","') + '"]') : contactDetail.function,
                tipoDeporte: JSON.parse('["' + _.join(contactDetail.sports, '","') + '"]'),
                listaFavoritos: JSON.parse('["' + _.join(contactDetail.favoritesGroups, '","') + '"]')
            }
        };
    } else {
        return {
            selectsReducer,
            reducerGlobal,
            groupsFavoriteContacts,
            initialValues: {
                tipoDocumento: '',
                numeroDocumento: ''
            }
        };
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModalContact,
        clearSearchContact,
        searchContact,
        createContactNew,
        consultDataSelect,
        consultListWithParameterUbication,
        getMasterDataFields,
        contactsByClientFindServer,
        clearContactCreate,
        clearContactOrder,
        consultList,
        downloadFilePDF,
        changeStateSaveData,
        nonValidateEnter,
        getListContactGroupById,
    }, dispatch);
}

export default reduxForm({
    form: 'submitValidationContactCreate',
    fields,
    destroyOnUnmount: false,
    validate,
    onSubmitFail: errors => {
        
        document.getElementById('modalComponentScrollCreateContact').scrollTop = 0;
        if (Object.keys(errors).map(i => errors[i]).indexOf(VALUE_XSS_INVALID) > -1) {
            thisForm.setState({ showErrorXss: true });
        } else {
            thisForm.setState({ showErrorForm: true });
        }

    }
}, mapStateToProps, mapDispatchToProps)(ModalComponentContact);
