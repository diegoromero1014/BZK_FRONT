import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import {
    MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_SAVE_DATA, STYLE_BUTTON_BOTTOM, REGEX_SIMPLE_XSS_MESAGE,
    INCOMPLETE_INFORMATION, ALL_FIELDS_REQUIERED, MOST_ADD_AN_EVENT
} from '../../../constantsGlobal';
import { validateResponse, formValidateKeyEnter, stringValidate, mapDateValueFromTask, xssValidation } from '../../../actionsGlobal';
import {MAX_LENGTH_EVENT_NAME} from '../../../constantsGlobal';
import { changeStateSaveData } from '../../main/actions';
import SweetAlert from '../../sweetalertFocus';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import Textarea from '../../../ui/textarea/textareaComponent';
import ComponentEvents from './events/componentEvents';
import { addEvent } from './events/actions';

import {
    patternOfHistoryEvent, patternOfForbiddenCharacter
} from './../../../validationsFields/patternsToValidateField';

import {
    MESSAGE_WARNING_HISTORY_EVENT, MESSAGE_WARNING_MAX_LENGTH, MESSAGE_WARNING_FORBIDDEN_CHARACTER
} from './../../../validationsFields/validationsMessages';

import { saveStructuredDelivery, structuredDeliveryDetail, updateEventErrors } from './actions';
import _ from 'lodash';
import {
    CORPORATE_GOVERNANCE_HELP, BUSINESS_WITH_AFFILIATES_HELP, MERGERS_HELP, RECIPROCITY_HELP
} from './constants';
import moment from 'moment';
import { setEvents, clearEvents, } from './events/actions';
import ToolTip from '../../toolTip/toolTipComponent';
import { fields, validations as validate } from './fieldsAndRulesForReduxForm';
import { setGlobalCondition } from './../../../validationsFields/rulesField'
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _STORY } from '../../../constantsAnalytics';

let thisForm = null;

class componentStructuredDelivery extends Component {
    constructor(props) {
        super(props);

        thisForm = this;

        this._submitStructuredDelivery = this._submitStructuredDelivery.bind(this);
        this._getStructuredDeliveryDetail = this._getStructuredDeliveryDetail.bind(this);
        this._closeEdit = this._closeEdit.bind(this);
        this.state = {
            typeMessage: 'error',
            showMessage: false,
            titleMessage: '',
            message: ''
        }
    }

    _submitStructuredDelivery() {
        const {
            fields: { id, corporateGobernance, reciprocity, specialConsiderations, businessWithAffiliates, mergers, dificultSituations },
            structuredDeliveryEvents, swtShowMessage, saveStructuredDelivery, changeStateSaveData,
            idClientSeleted, updateEventErrors, callFromDeliveryClient, addEvent
        } = this.props;

        let invalidMessage = 'Señor usuario, debe diligenciar todos los campos de los eventos.';
        let _arrValues = [corporateGobernance.value, reciprocity.value, specialConsiderations.value, businessWithAffiliates.value, mergers.value, dificultSituations.value]

        let succesValidateEmpty = stringValidate(_arrValues.join(""));

        let succesValidateXss = _arrValues.filter((value) => xssValidation(value)).length == 0;

        invalidMessage = !succesValidateXss ? REGEX_SIMPLE_XSS_MESAGE : invalidMessage;

        if (callFromDeliveryClient && structuredDeliveryEvents.size == 0) {
            const uuid = _.uniqueId('event_');
            addEvent(uuid);
            updateEventErrors(true, "Debe ingresar un evento");
            swtShowMessage('error', INCOMPLETE_INFORMATION, MOST_ADD_AN_EVENT);
            return;
        }

        if ((succesValidateEmpty || structuredDeliveryEvents.size > 0) && succesValidateXss) {
            let listEvents = [];
            let allowSave = true;
            let message = null;
            structuredDeliveryEvents.map((event) => {
                if (!stringValidate(event.name) || !stringValidate(event.date)) {
                    updateEventErrors(true, "Debe ingresar todos los campos")
                    allowSave = false;
                } else if (!_.isUndefined(event.name) && !_.isNull(event.name) && !patternOfHistoryEvent.test(event.name)) {                                    
                    message = MESSAGE_WARNING_HISTORY_EVENT;
                    updateEventErrors(true, message);
                    allowSave = false;
                } else if(!_.isUndefined(event.name) && !_.isNull(event.name) && event.name.length > MAX_LENGTH_EVENT_NAME) {
                    message = MESSAGE_WARNING_MAX_LENGTH(MAX_LENGTH_EVENT_NAME);
                    updateEventErrors(true, message);
                    allowSave = false;
                } else if(!_.isNil(event.name) && patternOfForbiddenCharacter.test(event.name)) {                                       
                    message = MESSAGE_WARNING_FORBIDDEN_CHARACTER;                    
                    updateEventErrors(true, message);
                    allowSave = false;
                }
                listEvents.push({
                    name: event.name,
                    dateEvent: moment(event.date, 'DD/MM/YYYY').format("YYYY-MM-DD HH:mm:ss")
                });
            });
            const idClientSave = _.isUndefined(idClientSeleted) || _.isNull(idClientSeleted) ? window.sessionStorage.getItem('idClientSelected') : idClientSeleted;
            var jsonStructuredDelivery = {
                "id": id.value,
                "idClient": idClientSave,
                "corporateGobernance": corporateGobernance.value,
                "reciprocity": reciprocity.value,
                "specialConsiderations": specialConsiderations.value,
                "businessWithAffiliates": businessWithAffiliates.value,
                "mergers": mergers.value,
                "dificultSituations": dificultSituations.value,
                "listEvents": listEvents
            };
            if (allowSave) {
                changeStateSaveData(true, MESSAGE_SAVE_DATA);
                saveStructuredDelivery(jsonStructuredDelivery).then((data) => {
                    if (!validateResponse(data)) {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                    } else {
                        this._getStructuredDeliveryDetail();
                        swtShowMessage('success', "Entrega estructurada", "Señor usuario, se ha guardado la información exitosamente.");
                        this._closeEdit();
                    }
                    changeStateSaveData(false, "");
                    updateEventErrors(false);
                }, (reason) => {
                    changeStateSaveData(false, "");
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                });
            } else {
                swtShowMessage('error', 'Historial', invalidMessage);
            }
        } else {
            swtShowMessage('error', 'Información incompleta', 'Señor usuario, para guardar debe diligenciar al menos un campo.');
        }
    }

    _closeEdit() {

        const { closeModal } = this.props

        this.setState({
            showMessage: false
        });
        if (!_.isUndefined(closeModal)) {

            closeModal();
        }
    }

    _getStructuredDeliveryDetail() {
        const {
            fields: {
                id, corporateGobernance, corporateGobernanceDate, reciprocity, reciprocityDate, specialConsiderations,
                specialConsiderationsDate, businessWithAffiliates, businessWithAffiliatesDate, mergers, mergersDate, dificultSituations,
                dificultSituationsDate
            }, structuredDeliveryDetail, swtShowMessage, setEvents, clearEvents, changeStateSaveData, idClientSeleted
        } = this.props;
        clearEvents();
        const idClientSave = _.isUndefined(idClientSeleted) || _.isNull(idClientSeleted) ? window.sessionStorage.getItem('idClientSelected') : idClientSeleted;
        structuredDeliveryDetail(idClientSave).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                var structuredDeliveryInfo = _.get(data, 'payload.data.data');
                if (structuredDeliveryInfo !== null) {
                    id.onChange(structuredDeliveryInfo.id);
                    corporateGobernance.onChange(structuredDeliveryInfo.corporateGobernance);
                    corporateGobernanceDate.onChange(structuredDeliveryInfo.corporateGobernanceDate);
                    reciprocity.onChange(structuredDeliveryInfo.reciprocity);
                    reciprocityDate.onChange(structuredDeliveryInfo.reciprocityDate);
                    specialConsiderations.onChange(structuredDeliveryInfo.specialConsiderations);
                    specialConsiderationsDate.onChange(structuredDeliveryInfo.specialConsiderationsDate);
                    businessWithAffiliates.onChange(structuredDeliveryInfo.businessWithAffiliates);
                    businessWithAffiliatesDate.onChange(structuredDeliveryInfo.businessWithAffiliatesDate);
                    mergers.onChange(structuredDeliveryInfo.mergers);
                    mergersDate.onChange(structuredDeliveryInfo.mergersDate);
                    dificultSituations.onChange(structuredDeliveryInfo.dificultSituations);
                    dificultSituationsDate.onChange(structuredDeliveryInfo.dificultSituationsDate);
                    var listEventsData = structuredDeliveryInfo.listEvents;
                    var listEvents = [];
                    listEventsData.map((event) => {
                        listEvents.push({
                            name: event.name,
                            date: moment(event.dateEvent).format('DD/MM/YYYY')
                        });
                    });
                    setEvents(listEvents);
                }
            }
            changeStateSaveData(false, "");
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    componentWillMount() {
        window.dataLayer.push({
            'nombreflujo': nombreflujoAnalytics,
            'event': BIZTRACK_MY_CLIENTS + _STORY,
            'pagina':_STORY

          });
        const { clearEvents, changeStateSaveData, callFromDeliveryClient, updateEventErrors } = this.props;
        setGlobalCondition(callFromDeliveryClient);
        clearEvents();
        updateEventErrors(false);
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        this._getStructuredDeliveryDetail();
    }

    render() {
        const {
            fields: {
                corporateGobernance, corporateGobernanceDate, reciprocity, reciprocityDate, specialConsiderations,
                specialConsiderationsDate, businessWithAffiliates, businessWithAffiliatesDate, mergers, mergersDate, dificultSituations,
                dificultSituationsDate
            }, reducerGlobal, handleSubmit, callFromDeliveryClient
        } = this.props;
        return (
            <form className="my-custom-tab" onSubmit={handleSubmit(this._submitStructuredDelivery)}
                onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                style={callFromDeliveryClient ? {
                    backgroundColor: "#FFFFFF",
                    paddingTop: "10px",
                    width: "100%"
                } : { backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
                <div style={callFromDeliveryClient ? { overflowX: 'hidden', marginLeft: '20px' } : {}}
                    className={callFromDeliveryClient ? "modalBt4-body modal-body business-content editable-form-content clearfix" : ''}>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ paddingRight: "15px" }}>
                                <dt>
                                    <span>Gobierno corporativo - Junta directiva del cliente</span>
                                    {callFromDeliveryClient &&
                                        <span>
                                            (<span style={{ color: "red" }}>*</span>)
                                    </span>
                                    }
                                    {
                                        corporateGobernanceDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(corporateGobernanceDate.value)}</span>
                                    }
                                    <ToolTip text={CORPORATE_GOVERNANCE_HELP}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    {...corporateGobernance}
                                    name="corporateGobernance"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{ width: '100%', height: '100px' }}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ paddingRight: "15px" }}>
                                <dt>
                                    <span>Reciprocidades /  Negociación tarifas Cash Management</span>
                                    {callFromDeliveryClient &&
                                        <span>
                                            (<span style={{ color: "red" }}>*</span>)
                                    </span>
                                    }
                                    {
                                        reciprocityDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(reciprocityDate.value)}</span>
                                    }
                                    <ToolTip text={RECIPROCITY_HELP}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    {...reciprocity}
                                    name="reciprocity"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{ width: '100%', height: '100px' }}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ paddingRight: "15px" }}>
                                <dt>
                                    <span>Consideraciones especiales de cuotas de manejo</span>
                                    {callFromDeliveryClient &&
                                        <span>
                                            (<span style={{ color: "red" }}>*</span>)
                                    </span>
                                    }
                                    {
                                        specialConsiderationsDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(specialConsiderationsDate.value)}</span>
                                    }
                                </dt>
                                <Textarea
                                    {...specialConsiderations}
                                    name="specialConsiderations"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{ width: '100%', height: '100px' }}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ paddingRight: "15px" }}>
                                <dt>
                                    <span>Negocios del cliente con filiales</span>
                                    {callFromDeliveryClient &&
                                        <span>
                                            (<span style={{ color: "red" }}>*</span>)
                                    </span>
                                    }
                                    {
                                        businessWithAffiliatesDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(businessWithAffiliatesDate.value)}</span>
                                    }
                                    <ToolTip text={BUSINESS_WITH_AFFILIATES_HELP}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    {...businessWithAffiliates}
                                    name="businessWithAffiliates"
                                    type="text"
                                    max="2000"
                                    title="La longitud máxima de caracteres es de 2000"
                                    style={{ width: '100%', height: '100px' }}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ paddingRight: "15px" }}>
                                <dt>
                                    <span>Fusiones - Adquisiciones</span>
                                    {callFromDeliveryClient &&
                                        <span>
                                            (<span style={{ color: "red" }}>*</span>)
                                    </span>
                                    }
                                    {
                                        mergersDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(mergersDate.value)}</span>
                                    }
                                    <ToolTip text={MERGERS_HELP}>
                                        <i className="help circle icon blue"
                                            style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }}
                                        />
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    {...mergers}
                                    name="mergers"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{ width: '100%', height: '100px' }}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "20px" }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ paddingRight: "15px" }}>
                                <dt>
                                    <span>Situaciones difíciles - Nuevos mercados</span>
                                    {callFromDeliveryClient &&
                                        <span>
                                            (<span style={{ color: "red" }}>*</span>)
                                    </span>
                                    }
                                    {
                                        dificultSituationsDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(dificultSituationsDate.value)}</span>
                                    }
                                </dt>
                                <Textarea
                                    {...dificultSituations}
                                    name="dificultSituations"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{ width: '100%', height: '100px' }}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    <ComponentEvents callFromDeliveryClient={callFromDeliveryClient} />
                </div>
                {callFromDeliveryClient ?
                    <div className="modalBt4-footer modal-footer">
                        <button className="btn btn-primary modal-button-edit" type="submit">
                            <span style={{ color: '#FFFFFF', padding: '10px' }}>Guardar</span>
                        </button>
                    </div>
                    :
                    <div style={STYLE_BUTTON_BOTTOM}>
                        <div style={{ width: '580px', height: '100%', position: 'fixed', right: '0px' }}>
                            <button className="btn" type="submit"
                                style={{ float: 'right', margin: '8px 0px 0px 450px', position: 'fixed' }}>
                                <span style={{ color: '#FFFFFF', padding: '10px' }}>Guardar</span>
                            </button>
                        </div>
                    </div>
                }
                <SweetAlert
                    type={this.state.typeMessage}
                    show={this.state.showMessage}
                    title={this.state.titleMessage}
                    text={this.state.message}
                    onConfirm={this._closeEdit}
                />
            </form>
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        swtShowMessage,
        saveStructuredDelivery,
        structuredDeliveryDetail,
        stringValidate,
        setEvents,
        clearEvents,
        changeStateSaveData,
        updateEventErrors,
        addEvent
    }, dispatch);
}

function mapStateToProps({ navBar, customerStory, selectsReducer, reducerGlobal, structuredDeliveryEvents, structuredDelivery }, ownerProps) {
    return {
        navBar,
        customerStory,
        selectsReducer,
        reducerGlobal,
        structuredDelivery,
        structuredDeliveryEvents
    };
}

export default reduxForm({
    form: 'formStructuredCustomer',
    fields,
    validate,
    onSubmitFail: (data) => {
        const { swtShowMessage } = thisForm.props;
        swtShowMessage('error', INCOMPLETE_INFORMATION, ALL_FIELDS_REQUIERED);
    }
}, mapStateToProps, mapDispatchToProps)(componentStructuredDelivery);