import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { OrderedMap } from 'immutable';
import moment from 'moment';
import _ from 'lodash';

import Ubicacion from '../contactDetail/ubicacion';

import SweetAlert from '../../sweetalertFocus';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import TextareaComponent from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import { createErrorsPriority, shouldHandleError } from '../../../utils';
import Tooltip from '../../toolTip/toolTipComponent';
import SecurityMessageComponent from '../../globalComponents/securityMessageComponent';
import { fields, validations as validate } from './fieldsAndRulesForReduxForm';
import { patternOfNumberDocument, patternOfForbiddenCharacter } from '../../../validationsFields/patternsToValidateField';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { toggleModalContact, createContactNew, searchContact, clearSearchContact } from './actions';
import { contactsByClientFindServer, clearContactOrder, clearContactCreate } from '../actions'
import { downloadFilePdf } from '../../clientInformation/actions';
import { changeStateSaveData } from '../../main/actions';
import { getListContactGroupById } from '../favoritesGroup/actions';
import { formValidateKeyEnter, nonValidateEnter } from '../../../actionsGlobal';
import {
    consultDataSelect,
    consultListWithParameterUbication,
    getMasterDataFields
} from '../../selectsComponent/actions';

import { NUMBER_RECORDS } from '../constants';
import {
    FILE_OPTION_SOCIAL_STYLE_CONTACT,
    MESSAGE_SAVE_DATA,
    VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS_MESAGE,
    NAME_FILE_SOCIAL_STYLE_CONTACT
} from '../../../constantsGlobal';

import {
    MESSAGE_WARNING_FORBIDDEN_CHARACTER,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER_PREFIX
} from '../../../validationsFields/validationsMessages';

import {
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
import { schema } from '../../participants/schema';
import ElementsComponent from '../../elements/';
import { cleanList, createList } from '../../elements/actions';
import { MANDATORY_OBJECTIVES_MSG, OBJECTIVES_OPEN_ERROR_MSG, OBJECTIVES, OBJECTIVES_PLACEHOLDER } from '../../participants/constants';

var thisForm;

export class ModalComponentContact extends Component {
    constructor(props) {
        super(props);
        this._close = this._close.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._handleCreateContact = this._handleCreateContact.bind(this);                
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
            showErrorForm: false,
            showErrorFormInvalidValue: false,
            correspondenceAddressCopy:false,
        };
        momentLocalizer(moment);
        thisForm = this;
    }

    componentWillMount() {
        const {
            fields: { tipoDocumento }, dispatchGetMasterDataFields, dispatchClearSearchContact,
            dispatchNonValidateEnter, dispatchGetListContactGroupById, dispatchCleanList, dispatchCreateList
        } = this.props;
        dispatchNonValidateEnter(true);
        dispatchGetListContactGroupById();
        dispatchClearSearchContact();
        this.props.resetForm();
        tipoDocumento.onChange('');
        dispatchGetMasterDataFields([
            CONTACT_ID_TYPE, 
            FILTER_TITLE, 
            FILTER_CONTACT_POSITION, 
            FILTER_GENDER, 
            FILTER_DEPENDENCY, 
            FILTER_COUNTRY, 
            FILTER_TYPE_CONTACT_ID, 
            FILTER_TYPE_LBO_ID, 
            FILTER_FUNCTION_ID, 
            FILTER_HOBBIES, 
            FILTER_SPORTS, 
            FILTER_SOCIAL_STYLE, 
            FILTER_ATTITUDE_OVER_GROUP]);
        dispatchCleanList(OBJECTIVES);
        dispatchCreateList(OBJECTIVES);

    }

    _downloadFileSocialStyle() {
        const { dispatchDownloadFilePdf , dispatchChangeStateSaveData} = this.props;
        dispatchDownloadFilePdf(FILE_OPTION_SOCIAL_STYLE_CONTACT, NAME_FILE_SOCIAL_STYLE_CONTACT, dispatchChangeStateSaveData);
    }

    _close() {
        this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block' });
        this.setState({ showErrorYa: false });
    }

    _genero(val) {
        const { fields: { tipoGenero }, selectsReducer } = this.props;
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

        if(genero.length == 1){
            this.setState({ generoData: genero });
            tipoGenero.onChange(genero[0].id);
        } else {
            this.setState({ generoData: '' });
            tipoGenero.onChange('');
        }
    }

    _closeCreate() {
        const { dispatchClearSearchContact, isOpen, dispatchClearContactCreate, dispatchClearContactOrder } = this.props;
        dispatchClearSearchContact();
        this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block' });
        this.setState({ showEx: false });
        isOpen();
        dispatchClearContactOrder();
        dispatchClearContactCreate();
    }

    _onClickLimpiar() {
        const { dispatchClearSearchContact, fields: { numeroDocumento } } = this.props;
        numeroDocumento.onChange('');
        dispatchClearSearchContact();
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
            fields: { tipoDocumento, numeroDocumento },
        } = this.props;

        const { dispatchSearchContact, dispatchClearSearchContact } = this.props;
        const documentNumber = _.isNull(numeroDocumento.value) ? null : numeroDocumento.value.trim();
        numeroDocumento.onChange(documentNumber);

        if (tipoDocumento.value && numeroDocumento.value) {

            if (!patternOfNumberDocument.test(numeroDocumento.value ? numeroDocumento.value : "")
                || patternOfForbiddenCharacter.test(numeroDocumento.value ? numeroDocumento.value : "")) {
                return;
            }

            dispatchSearchContact(tipoDocumento.value, documentNumber, window.sessionStorage.getItem('idClientSelected')).then((data) => {                
                if ((_.get(data, 'payload.data.data.isClientContact'))) {
                    dispatchClearSearchContact();
                    this.props.resetForm();
                    this.setState({ showErrorYa: true });
                } else {
                    this.setState({ disabled: 'disabled' });
                    this.setState({ noExiste: 'visible' });
                    this.setState({ botonBus: 'none' });
                }
                this.forceUpdate();
            }, (reason) => {
                this.setState({ showEr: true });
            });
        } else {
            this.setState({ showCam: true });
        }

    }

    _handleCreateContact() {
        const { dispatchCreateContactNew, dispatchContactsByClientFindServer, dispatchChangeStateSaveData } = this.props;
        const {
            fields: {
                id, tipoDocumento, tipoTratamiendo, tipoGenero, tipoCargo, tipoDependencia, tipoEstiloSocial,
            tipoActitud, tipoContacto, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido,
            fechaNacimiento, direccion, barrio, codigoPostal, telefono, extension, celular, correo, tipoEntidad,
            tipoFuncion, tipoHobbie, tipoDeporte, pais, departamento, ciudad, contactRelevantFeatures, listaFavoritos
            }, elementsReducer, dispatchSwtShowMessage
        } = this.props;

        let interlocutor = elementsReducer[OBJECTIVES];

        if (interlocutor && interlocutor.open) {
            dispatchSwtShowMessage('error', 'Error', OBJECTIVES_OPEN_ERROR_MSG);
            return;
        }

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
            "favoritesGroups": JSON.parse('[' + ((_.isNull(listaFavoritos) || _.isUndefined(listaFavoritos)) ? "" : listaFavoritos.value) + ']'),
            "updatedInfo" : true,
            "callFromCommercial": true, 
            "interlocutorObjsDTO": interlocutor.elements
        };

        dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);
        dispatchCreateContactNew(messageBody).then((data) => {
            dispatchChangeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === "false") {
                redirectUrl("/login");
            } else {
                if ((_.get(data, 'payload.data.status') === 200)) {
                    this.setState({ showEx: true });
                    dispatchContactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "", "", "", "", "");
                } else {
                    this.setState({ showEr: true });
                }
            }
        }, (reason) => {
            dispatchChangeStateSaveData(false, "");
            this.setState({ showEr: true });
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            errorMap: createErrorsPriority(props.fields, fields)
        });
    }

    render() {
        const { selectsReducer, groupsFavoriteContacts } = this.props;
        const {
            fields: {
                tipoDocumento, numeroDocumento, tipoTratamiendo, tipoGenero, tipoCargo, tipoDependencia,
            tipoEstiloSocial, tipoActitud, tipoContacto, primerNombre, segundoNombre, primerApellido,
            segundoApellido, fechaNacimiento, direccion, barrio, codigoPostal, telefono, extension, celular, correo,
            tipoEntidad, tipoFuncion, tipoHobbie, tipoDeporte, pais, departamento, ciudad, contactRelevantFeatures,
            listaFavoritos
            }, handleSubmit, reducerGlobal, clientInfo, dispatchConsultListWithParameterUbication
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this._handleCreateContact)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                <SecurityMessageComponent />
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalComponentScrollCreateContact">
                    <dt className="business-title">
                        <span style={{ paddingLeft: '20px' }}>Información básica</span>
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row >
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
                                        max="30"
                                        disabled={this.state.disabled}
                                        {...numeroDocumento}
                                        onKeyPress={this._searchContact}
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
                                    <dd><ComboBox name="tipoGenero" labelInput="Seleccione"
                                        disabled={this.state.disabledDep}
                                        {...tipoGenero}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_GENDER)}
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
                    <div style={{ visibility: this.state.noExiste }}>
                        <Ubicacion fields={ { "contactCountry": pais, "contactProvince": departamento ,"contactCity": ciudad, "contactAddress": direccion, "contactNeighborhood": barrio }} selectsReducer={selectsReducer} 
                            isEditable={true} clientInfo={clientInfo} consultListWithParameterUbication={dispatchConsultListWithParameterUbication} origin={'createContact'}
                        />
                    </div>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', visibility: this.state.noExiste }}>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Barrio</span></dt>
                                    <dd><Input
                                        name="barrio"
                                        type="text"
                                        max="40"
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
                                        max="10"
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
                                        max="14"
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
                                        max="55"
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

                        <Row style={{ padding: "10px 0px 20px 0px", marginTop: 40 }}>
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                                    <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                                    <i className="browser icon" style={{ fontSize: "20px" }} />
                                    <span style={{ fontSize: "20px" }}>{`Objetivos del interlocutor`}</span>
                                    
                                    <Tooltip text={MANDATORY_OBJECTIVES_MSG}>
                                        <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
                                    </Tooltip>

                                </div>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '-65px' }}>
                            <Col xs>
                                <ElementsComponent
                                    schema={schema}
                                    placeholder={OBJECTIVES_PLACEHOLDER}
                                    messageButton='Agregar'
                                    name={OBJECTIVES}
                                    max={3}
                                    title={'Objetivos del interlocutor'}
                                    isEditable={true}
                                    singularTitle={'el objetivo del interlocutor'}
                                />
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
                                            validateEnter={false}
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
                <SweetAlert
                    type="error"
                    show={this.state.showErrorFormInvalidValue}
                    title="Valores no validos"
                    text="Señor usuario, algunos campos del formulario contienen valores inválidos."
                    onConfirm={() => this.setState({ showErrorFormInvalidValue: false })}
                />
            </form>
        );
    }
}

const mapStateToProps = ({ createContactReducer, selectsReducer, reducerGlobal, groupsFavoriteContacts,clientInformacion, elementsReducer }, { fields }) => {
    const contactDetail = !createContactReducer.get('isClientContact') ? createContactReducer.get('responseSearchContactData') : false;
    const clientInfo = Object.assign({}, clientInformacion.get('responseClientInfo'));
    
    if (contactDetail && contactDetail.contactIdentityNumber) {
        return {
            selectsReducer,
            reducerGlobal,
            groupsFavoriteContacts,
            elementsReducer,
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
            },
            clientInfo
        };
    } else {
        return {
            selectsReducer,
            reducerGlobal,
            groupsFavoriteContacts,
            clientInfo,
            elementsReducer,
            initialValues: {
                tipoDocumento: '',
                numeroDocumento: ''
            }
        };
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
        dispatchClearSearchContact : clearSearchContact,
        dispatchSearchContact : searchContact,
        dispatchCreateContactNew : createContactNew,
        dispatchConsultListWithParameterUbication : consultListWithParameterUbication,
        dispatchGetMasterDataFields : getMasterDataFields,
        dispatchContactsByClientFindServer : contactsByClientFindServer,
        dispatchClearContactCreate : clearContactCreate,
        dispatchClearContactOrder : clearContactOrder,
        dispatchNonValidateEnter : nonValidateEnter,
        dispatchGetListContactGroupById : getListContactGroupById,
        dispatchCleanList: cleanList,
        dispatchCreateList: createList,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchDownloadFilePdf: downloadFilePdf,
        dispatchChangeStateSaveData: changeStateSaveData,
    }, dispatch);


export default reduxForm({
    form: 'submitValidationContactCreate',
    fields,
    destroyOnUnmount: false,
    validate,
    onSubmitFail: errors => {
        document.getElementById('modalComponentScrollCreateContact').scrollTop = 0;
        let arrErrors = Object.keys(errors).map(i => errors[i]);
        let hasInvalidValues = Object.keys(errors).filter(item => (errors[item] ? errors[item] : "").indexOf(MESSAGE_WARNING_FORBIDDEN_CHARACTER_PREFIX) > -1);
        hasInvalidValues = hasInvalidValues.length > 0;
        
        if (arrErrors.indexOf(VALUE_XSS_INVALID) > -1 || arrErrors.indexOf(MESSAGE_WARNING_FORBIDDEN_CHARACTER) > -1) {
            thisForm.setState({ showErrorXss: true });
        } else if (hasInvalidValues) {
            thisForm.setState({ showErrorFormInvalidValue: true });
        } else {
            thisForm.setState({ showErrorForm: true });
        }

    }
}, mapStateToProps, mapDispatchToProps)(ModalComponentContact);