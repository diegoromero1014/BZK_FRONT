import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import moment from 'moment';
import Ubicacion from './ubicacion';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import { Checkbox, Message } from 'semantic-ui-react';
import Input from '../../../ui/input/inputComponent';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import SweetAlert from '../../sweetalertFocus';
import Textarea from '../../../ui/textarea/textareaComponent';
import { fields, validations as validate } from './fieldsAndRulesForReduxForm';
import { setGlobalCondition } from './../../../validationsFields/rulesField';
import { redirectUrl } from '../../globalComponents/actions';
import { showLoading } from '../../loading/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { formValidateKeyEnter, nonValidateEnter } from '../../../actionsGlobal';
import { changeStateSaveData } from '../../main/actions';
import { downloadFilePdf } from '../../clientInformation/actions';
import { getContactDetails, saveContact, clearClienEdit, deleteRelationshipServer, markAsOutdated } from './actions';
import { contactsByClientFindServer, clearContactOrder, clearContactCreate } from '../actions';
import {
    consultDataSelect,
    getMasterDataFields,
    consultListWithParameterUbication
} from '../../selectsComponent/actions';
import { NUMBER_RECORDS } from '../constants';
import {
    CONTACT_ID_TYPE,
    FILTER_FUNCTION_ID,
    FILTER_TYPE_LBO_ID,
    FILTER_TYPE_CONTACT_ID,
    FILTER_GENDER,
    FILTER_TITLE,
    FILTER_ATTITUDE_OVER_GROUP,
    FILTER_DEPENDENCY,
    FILTER_CONTACT_POSITION,
    FILTER_COUNTRY,
    FILTER_PROVINCE,
    FILTER_CITY,
    FILTER_HOBBIES,
    FILTER_SPORTS,
    FILTER_SOCIAL_STYLE
} from '../../selectsComponent/constants';
import {
    FILE_OPTION_SOCIAL_STYLE_CONTACT,
    MESSAGE_SAVE_DATA,
    EDITAR,
    MESSAGE_LOAD_DATA,
    VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS_MESAGE,
    MARCAR_CONTACTO_DESACTUALIZADO,
    NAME_FILE_SOCIAL_STYLE_CONTACT
} from '../../../constantsGlobal';
import {
    MESSAGE_WARNING_FORBIDDEN_CHARACTER,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER_PREFIX
} from '../../../validationsFields/validationsMessages';
import { schema } from '../../participants/schema';
import ElementsComponent from '../../elements/';
import { cleanList, addToList, createList } from '../../elements/actions';
import { MANDATORY_OBJECTIVES_MSG, OBJECTIVES_OPEN_ERROR_MSG, OBJECTIVES, OBJECTIVES_PLACEHOLDER } from '../../participants/constants';
import Tooltip from "../../toolTip/toolTipComponent";

var thisForm;

export class ContactDetailsModalComponent extends Component {
    constructor(props) {
        super(props);
        this._handlerSubmitContact = this._handlerSubmitContact.bind(this);
        this._onchangeValue = this._onchangeValue.bind(this);
        this._genero = this._genero.bind(this);
        this._uploadProvincesByCountryId = this._uploadProvincesByCountryId.bind(this);
        this._uploadCitiesByProvinceId = this._uploadCitiesByProvinceId.bind(this);
        this._editContact = this._editContact.bind(this);
        this._closeViewOrEditContact = this._closeViewOrEditContact.bind(this);
        this._downloadFileSocialStyle = this._downloadFileSocialStyle.bind(this);
        this._handleChangeUpdateCheck = this._handleChangeUpdateCheck.bind(this);
        this._markAsOutdated = this._markAsOutdated.bind(this);
        this.unmarkContact = this.unmarkContact.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);

        this.state = {
            isEditable: false,
            generoData: [],
            showErrorForm: false,
            showErrorXss: false,
            showErrorFormInvalidValue: false,
            updateCheck: false,
            updateCheckDesc: '',
            updateCheckPermission: false,
            hasToUpdateInfo: false,
            showMessage: null,
            isUpdatedInSubmit: false,
            correspondenceAddressCopy: false,
        };
        momentLocalizer(moment);
        thisForm = this;
    }

    /* Carga la información del contacto */
    componentWillMount() {
        const {
            nonValidateEnter, getMasterDataFields, getContactDetails, contactId, callFromModuleContact, dispatchShowLoading, reducerGlobal, dispatchCleanList, dispatchAddToList, dispatchCreateList
        } = this.props;
        let updateCheckPermission = _.get(reducerGlobal.get('permissionsContacts'), _.indexOf(reducerGlobal.get('permissionsContacts'), MARCAR_CONTACTO_DESACTUALIZADO), false);
        this.setState({ updateCheckPermission });
        setGlobalCondition(!callFromModuleContact);

        nonValidateEnter(false);
        dispatchShowLoading(true, MESSAGE_LOAD_DATA);

        const that = this;
        const { fields: { contactFunctions, contactHobbies, contactSports, contactLineOfBusiness, contactCity } } = this.props;
        const idClient = callFromModuleContact ? null : window.sessionStorage.getItem('idClientSelected');
        const masterData = [
            CONTACT_ID_TYPE, FILTER_TITLE, FILTER_GENDER, FILTER_CONTACT_POSITION, FILTER_DEPENDENCY, FILTER_COUNTRY,
            FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID, FILTER_HOBBIES, FILTER_SPORTS,
            FILTER_SOCIAL_STYLE, FILTER_ATTITUDE_OVER_GROUP
        ];

        getMasterDataFields(masterData).then(function () {
            getContactDetails(contactId, idClient)
                .then(function (data) {
                    dispatchShowLoading(false, "");
                    const contact = _.get(data, 'payload.data.data');
                    let hasToUpdateInfo = !that.state.updateCheckPermission && !contact.updatedInfo;
                    that.setState({ updateCheck: !contact.updatedInfo, hasToUpdateInfo });
                    if (contact.country !== undefined && contact.country !== null) {
                        that._uploadProvincesByCountryId(contact.country);
                    }

                    if (contact.province !== undefined && contact.province !== null) {
                        that._uploadCitiesByProvinceId(contact.province);
                    }

                    if (!callFromModuleContact) {
                        contactLineOfBusiness.onChange(JSON.parse('["' + _.join(contact.lineOfBusiness, '","') + '"]'));
                        contactFunctions.onChange(JSON.parse('["' + _.join(contact.function, '","') + '"]'));
                    }

                    if (contact.interlocutorObjsDTO) {
                        dispatchCleanList(OBJECTIVES);
                        dispatchCreateList(OBJECTIVES);

                        if (contact.interlocutorObjsDTO && contact.interlocutorObjsDTO.length) {
                            contact.interlocutorObjsDTO.forEach((element, index) => dispatchAddToList({ data: Object.assign({}, element, { order: (index + 1) }), name: OBJECTIVES, old: null }));
                        }
                    }

                    contactHobbies.onChange(JSON.parse('["' + _.join(contact.hobbies, '","') + '"]'));
                    contactSports.onChange(JSON.parse('["' + _.join(contact.sports, '","') + '"]'));

                    // Se vuelve a setear la ciudad para evitar que el cambio en el departamento deje vacio el campo ciudad
                    setTimeout(() => {
                        contactCity.onChange(contact.city);
                    }, 1000);

                });
        });
    }

    _downloadFileSocialStyle() {
        const { dispatchDownloadFilePdf, dispatchChangeStateSaveData } = this.props;
        dispatchDownloadFilePdf(FILE_OPTION_SOCIAL_STYLE_CONTACT,  NAME_FILE_SOCIAL_STYLE_CONTACT, dispatchChangeStateSaveData);
        this.setState({ generoData: genero });
    }

    _genero(val) {
        const { fields: { contactGender }, selectsReducer } = this.props;
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

        if (genero.length == 1) {
            this.setState({ generoData: genero });
            contactGender.onChange(genero[0].id);
        } else {
            this.setState({ generoData: '' });
            contactGender.onChange('');
        }
    }

    _onchangeValue(type, val) {
        switch (type) {
            case "contactIdentityNumber":
                var { fields: { contactIdentityNumber } } = this.props;
                contactIdentityNumber.onChange(val);
                break;
            case "contactFirstName":
                var { fields: { contactFirstName } } = this.props;
                contactFirstName.onChange(val);
                break;
            case "contactFirstLastName":
                var { fields: { contactFirstLastName } } = this.props;
                contactFirstLastName.onChange(val);
                break;
            case "contactMiddleName":
                var { fields: { contactMiddleName } } = this.props;
                contactMiddleName.onChange(val);
                break;
            case "contactSecondLastName":
                var { fields: { contactSecondLastName } } = this.props;
                contactSecondLastName.onChange(val);
                break;
            case "contactPostalCode":
                var { fields: { contactPostalCode } } = this.props;
                contactPostalCode.onChange(val);
                break;
            case "contactTelephoneNumber":
                var { fields: { contactTelephoneNumber } } = this.props;
                contactTelephoneNumber.onChange(val);
                break;
            case "contactExtension":
                var { fields: { contactExtension } } = this.props;
                contactExtension.onChange(val);
                break;
            case "contactMobileNumber":
                var { fields: { contactMobileNumber } } = this.props;
                contactMobileNumber.onChange(val);
                break;
            case "contactEmailAddress":
                var { fields: { contactEmailAddress } } = this.props;
                contactEmailAddress.onChange(val);
                break;
            case "contactAddress":
                var { fields: { contactAddress } } = this.props;
                contactAddress.onChange(val);
                break;
            case "contactCountry":
                var { fields: { contactCountry } } = this.props;
                contactCountry.onChange(val);
                break;
            case "contactProvince":
                var { fields: { contactProvince } } = this.props;
                contactProvince.onChange(val);
                break;
            case "contactCity":
                var { fields: { contactCity } } = this.props;
                contactCity.onChange(val);
                break;
            case "contactDateOfBirth":
                const { fields: { contactDateOfBirth } } = this.props;
                contactDateOfBirth.onChange(val);
                break;
            case "updateCheckObservation":
                const { fields: { updateCheckObservation } } = this.props;
                updateCheckObservation.onChange(val);
                break;
            default:
                break;
        }

        const { clearState } = this.props;
        clearState();
    }

    _uploadProvincesByCountryId(countryId) {
        const { consultListWithParameterUbication } = this.props;
        if (countryId !== undefined && countryId !== null) {
            consultListWithParameterUbication(FILTER_PROVINCE, countryId);
        }
    }

    _uploadCitiesByProvinceId(provinceId) {
        const { consultListWithParameterUbication } = this.props;
        if (provinceId !== undefined && provinceId !== null) {
            consultListWithParameterUbication(FILTER_CITY, provinceId);
        }
    }

    _editContact() {
        this.setState({
            isEditable: !this.state.isEditable
        });
    }

    _closeViewOrEditContact() {
        const { isOpen, clearClienEdit, clearContactOrder, clearContactCreate, callFromModuleContact } = this.props;
        this.setState({ isEditable: false });
        if (!callFromModuleContact) {
            isOpen();
            this.props.resetForm();
            clearClienEdit();
            clearContactCreate();
            clearContactOrder();
        }
    }

    _handlerSubmitContact() {
        const {
            fields: {
                contactTitle, contactGender, contactType, contactIdentityNumber, contactFirstName, contactMiddleName,
                contactFirstLastName, contactSecondLastName, contactPosition, contactDependency, contactAddress,
                contactCountry, contactProvince, contactCity, contactNeighborhood, contactPostalCode,
                contactTelephoneNumber, contactExtension, contactMobileNumber, contactEmailAddress, contactTypeOfContact,
                contactLineOfBusiness, contactFunctions, contactHobbies, contactSports, contactSocialStyle,
                contactAttitudeOverGroup, contactDateOfBirth, contactRelevantFeatures, updateCheckObservation
            }, dispatchChangeStateSaveData, callFromModuleContact, resetPage, dispatchsSwtShowMessage, elementsReducer
        } = this.props;
        const { contactDetail, contactsByClientFindServer } = this.props;
        const contact = contactDetail.get('contactDetailList');
        const { saveContact } = this.props;

        let interlocutor = elementsReducer[OBJECTIVES];

        if (interlocutor && interlocutor.open) {
            dispatchsSwtShowMessage('error', 'Error', OBJECTIVES_OPEN_ERROR_MSG);
            return;
        }

        const jsonUpdateContact = {
            "client": window.sessionStorage.getItem('idClientSelected'),
            "id": contact.id,
            "title": contactTitle.value !== undefined ? contactTitle.value : null,
            "gender": contactGender.value !== undefined ? contactGender.value : null,
            "contactType": contactType.value !== undefined ? contactType.value : null,
            "contactIdentityNumber": contactIdentityNumber.value !== undefined ? contactIdentityNumber.value : null,
            "firstName": contactFirstName.value !== undefined ? contactFirstName.value : null,
            "middleName": contactMiddleName.value !== undefined ? contactMiddleName.value : null,
            "firstLastName": contactFirstLastName.value !== undefined ? contactFirstLastName.value : null,
            "secondLastName": contactSecondLastName.value !== undefined ? contactSecondLastName.value : null,
            "contactPosition": contactPosition.value !== undefined ? contactPosition.value : null,
            "unit": contactDependency.value !== undefined ? contactDependency.value : null,
            "function": JSON.parse('[' + ((contactFunctions.value) ? contactFunctions.value : "") + ']'),
            "dateOfBirth": contactDateOfBirth.value !== '' && contactDateOfBirth.value !== null && contactDateOfBirth.value !== undefined ? moment(contactDateOfBirth.value, "DD/MM/YYYY").format('x') : null,
            "address": contactAddress.value !== undefined ? contactAddress.value : null,
            "country": contactCountry.value !== undefined ? contactCountry.value : null,
            "province": contactProvince.value !== undefined ? contactProvince.value : null,
            "city": contactCity.value !== undefined ? contactCity.value : null,
            "neighborhood": contactNeighborhood.value !== undefined ? contactNeighborhood.value : null,
            "postalCode": contactPostalCode.value !== undefined ? contactPostalCode.value : null,
            "typeOfAddress": null,
            "telephoneNumber": contactTelephoneNumber.value !== undefined ? contactTelephoneNumber.value : null,
            "extension": contactExtension.value !== undefined ? contactExtension.value : null,
            "mobileNumber": contactMobileNumber.value !== undefined ? contactMobileNumber.value : null,
            "emailAddress": contactEmailAddress.value !== undefined ? contactEmailAddress.value : null,
            "contactRelevantFeatures": contactRelevantFeatures.value !== undefined ? contactRelevantFeatures.value : null,
            "modeOfContact": null,
            "registryKey": null,
            "notes": null,
            "hobbies": JSON.parse('[' + ((contactHobbies.value) ? contactHobbies.value : "") + ']'),
            "sports": JSON.parse('[' + ((contactSports.value) ? contactSports.value : "") + ']'),
            "typeOfContact": contactTypeOfContact.value !== undefined ? contactTypeOfContact.value : null,
            "shippingInformation": null,
            "lineOfBusiness": JSON.parse('[' + ((contactLineOfBusiness.value) ? contactLineOfBusiness.value : "") + ']'),
            "socialStyle": contactSocialStyle.value !== undefined ? contactSocialStyle.value : null,
            "attitudeOverGroup": contactAttitudeOverGroup.value !== undefined ? contactAttitudeOverGroup.value : null,
            "callFromModuleContact": _.isNull(callFromModuleContact) || _.isUndefined(callFromModuleContact) ? false : callFromModuleContact,
            "interlocutorObjsDTO": interlocutor.elements
        };

        dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);
        saveContact(jsonUpdateContact).then((data) => {
            dispatchChangeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === "false") {
                redirectUrl("/login");
            } else {
                if (_.get(data, 'payload.data.status') === 200) {
                    this.setState({ isUpdatedInSubmit: true });
                    if (this.state.updateCheck == true || !_.isEmpty(updateCheckObservation.value)) {
                        this.setState({ showMessage: true });
                    } else {
                        this._closeViewOrEditContact();
                        dispatchsSwtShowMessage('success', 'Edición de contacto', 'Señor usuario, el contacto se editó de forma exitosa.');
                    }
                    contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "", "", "", "", "");
                    if (!_.isUndefined(resetPage)) {
                        resetPage();
                    }
                } else {
                    dispatchsSwtShowMessage('error', 'Error editando contacto', 'Señor usuario, ocurrió un error editando el contacto.');
                }
            }
        }, () => {
            dispatchChangeStateSaveData(false, "");
            dispatchsSwtShowMessage('error', 'Error editando contacto', 'Señor usuario, ocurrió un error editando el contacto.');
        });
    }
    _handleChangeUpdateCheck() {
        const { fields: { updateCheckObservation } } = this.props;
        const updateCheck = !(this.state.updateCheck);
        this.setState({ updateCheck });
        if (this.state.updateCheck && !_.isEmpty(updateCheckObservation.value)) {
            this.setState({ showMessage: true });
        } else {
            this.setState({ showMessage: false });
        }
    }
    cancelAlert() {
        const { contactsByClientFindServer, dispatchShowLoading } = this.props;
        this.setState({
            updateCheck: true,
            showMessage: false
        })
        if (this.state.isUpdatedInSubmit) {
            dispatchShowLoading(false, "");
            this._closeViewOrEditContact();
            contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "", "", "", "");
        }
    }
    unmarkContact() {
        const { fields: { updateCheckObservation }, dispatchShowLoading } = this.props;
        dispatchShowLoading(true, MESSAGE_LOAD_DATA);
        this.setState({
            updateCheck: false,
            showMessage: false
        })
        updateCheckObservation.value = "";
        this._markAsOutdated();
    }
    _markAsOutdated() {
        const { fields: { updateCheckObservation }, dispatchChangeStateSaveData, resetPage, dispatchsSwtShowMessage, dispatchShowLoading } = this.props;
        const { markAsOutdated } = this.props;
        const { contactDetail, contactsByClientFindServer } = this.props;

        const contact = contactDetail.get('contactDetailList');
        const jsonContact = {
            "updatedInfo": !this.state.updateCheck,
            "updatedInfoDesc": !_.isUndefined(updateCheckObservation.value) && !_.isNull(updateCheckObservation.value) ? updateCheckObservation.value : "",
            "contactType": contact.contactType,
            "contactIdentityNumber": contact.contactIdentityNumber,
        };
        dispatchShowLoading(true, MESSAGE_LOAD_DATA);
        markAsOutdated(jsonContact).then((data) => {
            dispatchShowLoading(false, "");
            dispatchChangeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === "false") {
                redirectUrl("/login");
            } else {
                if (_.get(data, 'payload.data.status') === 200) {
                    this.setState({ isUpdatedInSubmit: false });
                    this._closeViewOrEditContact();
                    dispatchsSwtShowMessage('success', 'Actualización de información', 'Señor usuario, la información se guardó de forma exitosa.');
                    contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "", "", "", "");
                    if (!_.isUndefined(resetPage)) {
                        resetPage();
                    }
                } else if (_.get(data, 'payload.data.status') === 422) {
                    const result = _.get(data, 'payload.data.data');
                    updateCheckObservation.error = result[0].detail[0].message[0];
                    updateCheckObservation.touched = true;
                    const val_ = updateCheckObservation.value;
                    updateCheckObservation.onChange(val_);
                } else {
                    dispatchsSwtShowMessage('error', 'Error actualizando información', 'Señor usuario, ocurrió un error guardando la información.');
                }
            }
        }, () => {
            dispatchChangeStateSaveData(false, "");
            dispatchsSwtShowMessage('error', 'Error actualizando información', 'Señor usuario, ocurrió un error guardando la información.');
        });

    }
    render() {
        const { callFromModuleContact } = this.props;
        const {
            fields: {
                contactTitle, contactGender, contactType, contactIdentityNumber, contactFirstName, contactMiddleName,
                contactFirstLastName, contactSecondLastName, contactPosition, contactDependency, contactAddress,
                contactCountry, contactProvince, contactCity, contactNeighborhood, contactPostalCode,
                contactTelephoneNumber, contactExtension, contactMobileNumber, contactEmailAddress,
                contactTypeOfContact, contactLineOfBusiness, contactFunctions, contactHobbies, contactSports,
                contactSocialStyle, contactAttitudeOverGroup, contactDateOfBirth, contactRelevantFeatures, updateCheckObservation
            }, handleSubmit, selectsReducer, reducerGlobal, clientInfo, consultListWithParameterUbication, origin
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this._handlerSubmitContact)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalEditCotact" style={callFromModuleContact ? { backgroundColor: '#FFF' } : {}}>
                    {this.state.updateCheckPermission &&

                        <div>
                            <dt className="business-title" style={{ fontSize: '17px' }}>
                                <span style={{ paddingLeft: '20px' }}>Check de actualización de contacto.</span>
                            </dt>
                            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <div style={{ padding: '2.65em 0px 1em 0em' }} class="ui fitted toggle checkbox">
                                            <Checkbox
                                                toggle
                                                label="La información del contacto está desactualizada"
                                                checked={this.state.updateCheck}
                                                onClick={this._handleChangeUpdateCheck}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        {this.state.updateCheck &&
                                            <div>
                                                <dt><span>{'Observación ('}</span><span
                                                    style={{ color: 'red' }}>{'*'}</span><span>{')'}</span></dt>
                                                <dd>
                                                    <Textarea style={{ height: '10em' }}
                                                        name="updateCheckObservation"
                                                        className="UpdateCheckObservation"
                                                        {...updateCheckObservation}
                                                        type="text"
                                                        disabled={this.state.updateCheck ? '' : 'disabled'}
                                                    />
                                                </dd>
                                                <div style={{ padding: '1.5em 0em 1.5em 0em' }}>
                                                    <button
                                                        type="button"
                                                        onClick={this._markAsOutdated}
                                                        className="btn btn-primary modal-button-edit"
                                                    >{'Guardar'}</button>
                                                </div>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    }
                    {this.state.hasToUpdateInfo &&
                        <div>
                            <Message negative style={{ margin: '1.5em' }}>
                                <Message.Content style={{ float: 'rigth' }}>
                                    <Message.Header style={{ minHeight: '28px' }}>La información del contacto está desactualizada</Message.Header>
                                    {updateCheckObservation.value}
                                </Message.Content>
                            </Message>
                        </div>
                    }

                    <dt className="business-title" style={{ fontSize: '17px' }}>
                        <span style={{ paddingLeft: '20px' }}>Información básica</span>
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4}>
                                <dt><span>Tipo de documento</span></dt>
                                <dt>
                                    <p style={{ fontWeight: "normal" }}>
                                        {(contactType.value !== "" && contactType.value !== null && contactType.value !== undefined && !_.isEmpty(selectsReducer.get(CONTACT_ID_TYPE))) ? _.get(_.filter(selectsReducer.get(CONTACT_ID_TYPE), ['id', parseInt(contactType.value)]), '[0].value') : ''}
                                    </p>
                                </dt>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>Número de documento</span></dt>
                                <dt>
                                    <p style={{ fontWeight: "normal" }}>
                                        {contactIdentityNumber.value}
                                    </p>
                                </dt>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                {_.get(reducerGlobal.get('permissionsContacts'), _.indexOf(reducerGlobal.get('permissionsContacts'), EDITAR), false) &&
                                    <button type="button" onClick={this._editContact}
                                        className={'btn btn-primary modal-button-edit'} style={{ marginTop: '35px' }}>
                                        Editar <i className={'icon edit'}></i>
                                    </button>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4}>
                                <dt><span>{'Tratamiento ('}</span><span
                                    style={{ color: 'red' }}>{'*'}</span><span>{')'}</span></dt>
                                <dd>
                                    <ComboBox
                                        name="contactTitle"
                                        labelInput="Seleccione"
                                        {...contactTitle}
                                        onChange={val => this._genero(val)}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_TITLE) || []}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={4} lg={4}>
                                <dt><span>{'Género ('}</span><span style={{ color: 'red' }}>{'*'}</span><span>{')'}</span>
                                </dt>
                                <dd>
                                    <ComboBox
                                        name="contactGender"
                                        labelInput="Seleccione"
                                        {...contactGender}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_GENDER)}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Primer nombre ('}</span><span
                                    style={{ color: 'red' }}>{'*'}</span><span>{')'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactFirstName"
                                        type="text"
                                        max="60"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactFirstName}
                                    />
                                </dd>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Segundo nombre'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactMiddleName"
                                        type="text"
                                        max="60"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactMiddleName}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Primer apellido ('}</span><span
                                    style={{ color: 'red' }}>{'*'}</span><span>{')'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactFirstLastName"
                                        type="text"
                                        max="60"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactFirstLastName}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Segundo apellido'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactSecondLastName"
                                        type="text"
                                        max="60"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactSecondLastName}
                                    />
                                </dd>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Cargo ('}</span><span style={{ color: 'red' }}>{'*'}</span><span>{')'}</span>
                                </dt>
                                <dd>
                                    <ComboBox
                                        name="contactPosition"
                                        labelInput="Seleccione"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactPosition}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_CONTACT_POSITION) || []}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Área dependencia ('}</span><span
                                    style={{ color: 'red' }}>{'*'}</span><span>{')'}</span></dt>
                                <dd>
                                    <ComboBox
                                        name="contactDependency"
                                        labelInput="Seleccione"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactDependency}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_DEPENDENCY) || []}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt>{'Fecha de nacimiento'}</dt>
                                <dd>
                                    <DateTimePickerUi
                                        name="contactDateOfBirth"
                                        onChange={val => this._onchangeValue("contactDateOfBirth", val)}
                                        culture='es'
                                        format={"DD/MM/YYYY"}
                                        time={false}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactDateOfBirth}
                                    />
                                </dd>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dt>
                                    {'Estilo social'}
                                    <i onClick={this._downloadFileSocialStyle}
                                        style={{ marginLeft: "10px", cursor: "pointer" }}
                                        title="Descargar archivo de estilo social"
                                        className="red file pdf outline icon"></i>
                                </dt>
                                <dd>
                                    <ComboBox
                                        name="contactSocialStyle"
                                        labelInput="Seleccione"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactSocialStyle}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_SOCIAL_STYLE) || []}
                                    />
                                </dd>
                            </Col>
                            <Col xs>
                                <dt>{'Actitud frente al grupo'}</dt>
                                <dd>
                                    <ComboBox
                                        name="contactAttitudeOverGroup"
                                        labelInput="Seleccione"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactAttitudeOverGroup}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_ATTITUDE_OVER_GROUP) || []}
                                    />
                                </dd>
                            </Col>
                        </Row>
                    </div>
                    <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información de ubicación y correspondencia</span>
                    </dt>
                    <Ubicacion fields={{ contactCountry, contactProvince, contactCity, contactAddress, contactNeighborhood }} selectsReducer={selectsReducer}
                        isEditable={this.state.isEditable} clientInfo={clientInfo} consultListWithParameterUbication={consultListWithParameterUbication} origin={origin}
                    />
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt>
                                    <span>{"Barrio"}</span>
                                </dt>
                                <dd>
                                    <Input
                                        name="contactNeighborhood"
                                        type="text"
                                        max="40"
                                        disabled={this.state.isEditable ? "" : "disabled"}
                                        {...contactNeighborhood}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Código postal'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactPostalCode"
                                        type="text"
                                        max="10"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactPostalCode}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Teléfono ('}</span><span style={{ color: 'red' }}>*</span><span>{')'}</span>
                                </dt>
                                <dd>
                                    <Input
                                        name="contactTelephoneNumber"
                                        type="text"
                                        max="30"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactTelephoneNumber}
                                    />
                                </dd>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Extensión'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactExtension"
                                        type="text"
                                        max="14"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactExtension}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Celular'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactMobileNumber"
                                        type="text"
                                        max="30"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactMobileNumber}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <dt><span>{'Correo electrónico ('}</span><span
                                    style={{ color: 'red' }}>{'*'}</span><span>{')'}</span></dt>
                                <dd>
                                    <Input
                                        name="contactEmailAddress"
                                        type="text"
                                        max="55"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactEmailAddress}
                                    />
                                </dd>
                            </Col>
                        </Row>
                    </div>

                    {!callFromModuleContact &&
                        <div>
                            <dt className="business-title"><span
                                style={{ paddingLeft: '20px' }}>Clasificación del contacto</span></dt>
                            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Row>
                                    <Col xs>
                                        <dt><span>Tipo de contacto (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                        <dd>
                                            <ComboBox
                                                name="contactTypeOfContact"
                                                labelInput="Seleccione"
                                                disabled={this.state.isEditable ? '' : 'disabled'}
                                                {...contactTypeOfContact}
                                                valueProp={'id'}
                                                textProp={'value'}
                                                data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                                            />
                                        </dd>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs>
                                        <dt><span>Entidad / Línea de negocio</span></dt>
                                        <dd>
                                            <MultipleSelect
                                                name="contactLineOfBusiness"
                                                labelInput="Seleccione"
                                                disabled={this.state.isEditable ? '' : 'disabled'}
                                                {...contactLineOfBusiness}
                                                valueProp={'id'}
                                                textProp={'value'}
                                                data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                                            />
                                        </dd>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs>
                                        <dt><span>Función (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                        <dd>
                                            <MultipleSelect
                                                name="contactFunctions"
                                                labelInput="Seleccione"
                                                disabled={this.state.isEditable ? '' : 'disabled'}
                                                {...contactFunctions}
                                                valueProp={'id'}
                                                textProp={'value'}
                                                data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                                            />
                                        </dd>
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
                                            isEditable={this.state.isEditable}
                                            singularTitle={'el objetivo del interlocutor'}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    }
                    <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Hobbies y deportes</span></dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <dt><span>{'Hobbies'}</span></dt>
                                <dd>
                                    <MultipleSelect
                                        name="contactHobbies"
                                        labelInput="Seleccione"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactHobbies}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_HOBBIES) || []}
                                    />
                                </dd>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <dt><span>{'Deportes'}</span></dt>
                                <dd>
                                    <MultipleSelect
                                        name="contactSports"
                                        labelInput="Seleccione"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        {...contactSports}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        data={selectsReducer.get(FILTER_SPORTS) || []}
                                    />
                                </dd>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dl style={{ width: '100%' }}>
                                    <dt><span>Particularidades relevantes del contacto</span></dt>
                                    <dd>
                                        <Textarea
                                            name="contactRelevantFeatures"
                                            validateEnter={false}
                                            type="text"
                                            max="1000"
                                            style={{ width: '100%', height: '100%' }}
                                            rows={4}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            {...contactRelevantFeatures}
                                        /></dd>
                                </dl>
                            </Col>
                        </Row>
                    </div>
                </div>
                {!callFromModuleContact ?
                    <div className="modalBt4-footer modal-footer">
                        <button
                            type="submit"
                            className="btn btn-primary modal-button-edit"
                            disabled={this.state.isEditable ? '' : 'disabled'}
                        >{'Guardar'}</button>
                    </div> :
                    <div style={{ float: 'right', cursor: 'pointer', marginRight: '35px' }}>
                        <button
                            type="submit"
                            className="btn btn-primary modal-button-edit"
                            disabled={this.state.isEditable ? '' : 'disabled'}
                        >{'Guardar información contacto'}</button>
                    </div>
                }
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
                    text="Señor usuario, para editar un contacto debe ingresar los campos obligatorios."
                    onConfirm={() => this.setState({ showErrorForm: false })}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showErrorFormInvalidValue}
                    title="Valores no validos"
                    text="Señor usuario, algunos campos del formulario contienen valores inválidos."
                    onConfirm={() => this.setState({ showErrorFormInvalidValue: false })}
                />
                <SweetAlert
                    type={this.state.isUpdatedInSubmit ? "success" : "warning"}
                    show={this.state.showMessage}
                    title={this.state.isUpdatedInSubmit ? "¡Contacto guardado!" : "Advertencia"}
                    text="¿Señor usuario, certifica que con los cambios realizados, el contacto queda actualizado con las observaciones descritas?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='¡Sí, estoy seguro!'
                    cancelButtonText={this.state.isUpdatedInSubmit ? "Guardar sin certificar" : "Cancelar"}
                    showCancelButton={true}
                    onCancel={this.cancelAlert}
                    onConfirm={this.unmarkContact}
                />
            </form>
        );
    }
}

ContactDetailsModalComponent.PropTypes = {
    contactId: PropTypes.number
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getContactDetails,
        saveContact,
        clearContactOrder,
        clearContactCreate,
        consultDataSelect,
        getMasterDataFields,
        consultListWithParameterUbication,
        contactsByClientFindServer,
        clearClienEdit,
        nonValidateEnter,
        deleteRelationshipServer,
        markAsOutdated,
        dispatchShowLoading: showLoading,
        dispatchsSwtShowMessage: swtShowMessage,
        dispatchCleanList: cleanList,
        dispatchAddToList: addToList,
        dispatchCreateList: createList,
        dispatchDownloadFilePdf : downloadFilePdf,
        dispatchChangeStateSaveData : changeStateSaveData
    }, dispatch);
}

function mapStateToProps({ contactDetail, selectsReducer, reducerGlobal, clientInformacion, elementsReducer }) {
    const contact = contactDetail.get('contactDetailList');
    const clientInfo = Object.assign({}, clientInformacion.get('responseClientInfo'));
    if (contact) {
        return {
            contactDetail,
            selectsReducer,
            reducerGlobal,
            clientInfo,
            elementsReducer,
            initialValues: {
                id: contact.id,
                contactType: contact.contactType,
                contactIdentityNumber: contact.contactIdentityNumber,
                contactTitle: contact.title,
                contactGender: contact.gender,
                contactFirstName: contact.firstName,
                contactMiddleName: contact.middleName,
                contactFirstLastName: contact.firstLastName,
                contactSecondLastName: contact.secondLastName,
                contactPosition: contact.contactPosition,
                contactDependency: contact.unit,
                contactDateOfBirth: contact.dateOfBirth !== '' && contact.dateOfBirth !== null && contact.dateOfBirth !== undefined ? moment(contact.dateOfBirth).format('DD/MM/YYYY') : null,
                contactSocialStyle: contact.socialStyle,
                contactAttitudeOverGroup: contact.attitudeOverGroup,
                contactCountry: contact.country,
                contactProvince: contact.province,
                contactCity: contact.city,
                contactAddress: contact.address,
                contactNeighborhood: contact.neighborhood,
                contactPostalCode: contact.postalCode,
                contactTelephoneNumber: contact.telephoneNumber,
                contactExtension: contact.extension,
                contactMobileNumber: contact.mobileNumber,
                contactEmailAddress: contact.emailAddress,
                contactTypeOfContact: contact.typeOfContact,
                contactLineOfBusiness: '',
                contactFunctions: '',
                contactRelevantFeatures: contact.contactRelevantFeatures,
                contactHobbies: JSON.parse('["' + _.join(contact.hobbies, '","') + '"]'),
                contactSports: JSON.parse('["' + _.join(contact.sports, '","') + '"]'),
                updateCheckObservation: contact.updatedInfoDesc,
            }
        };
    } else {
        return {
            contactDetail,
            selectsReducer,
            reducerGlobal,
            clientInfo,
            elementsReducer
        };
    }
}

export default reduxForm({
    form: 'submitValidationContactDetails',
    fields,
    destroyOnUnmount: true,
    validate,
    onSubmitFail: errors => {
        document.getElementById('modalEditCotact').scrollTop = 0;
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
}, mapStateToProps, mapDispatchToProps)(ContactDetailsModalComponent);