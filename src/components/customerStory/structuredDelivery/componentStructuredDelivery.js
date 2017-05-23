import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Row, Col} from 'react-flexbox-grid';
import {consultList} from '../../selectsComponent/actions';
import {TEAM_FOR_EMPLOYEE} from '../../selectsComponent/constants';
import {
    VALUE_REQUIERED, MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_SAVE_DATA
} from '../../../constantsGlobal';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import {validateResponse, formValidateKeyEnter, stringValidate, mapDateValueFromTask} from '../../../actionsGlobal';
import {changeStateSaveData} from '../../dashboard/actions';
import SweetAlert from 'sweetalert-react';
import {swtShowMessage} from '../../sweetAlertMessages/actions';
import Textarea from '../../../ui/textarea/textareaComponent';
import ComponentEvents from './events/componentEvents';
import {saveStructuredDelivery, structuredDeliveryDetail} from './actions';
import _ from 'lodash';
import {CORPORATE_GOVERNANCE_HELP, BUSINESS_WITH_AFFILIATES_HELP, MERGERS_HELP} from './constants';
import moment from 'moment';
import {setEvents, clearEvents} from './events/actions';
import ToolTip from '../../toolTip/toolTipComponent';

const fields = ["id", "corporateGobernance", "corporateGobernanceDate", "reciprocity", "reciprocityDate", "specialConsiderations",
    "specialConsiderationsDate", "businessWithAffiliates", "businessWithAffiliatesDate", "mergers", "mergersDate", "dificultSituations",
    "dificultSituationsDate"];

class componentStructuredDelivery extends Component {
    constructor(props) {
        super(props);
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
            fields: {id, corporateGobernance, reciprocity, specialConsiderations, businessWithAffiliates, mergers, dificultSituations},
            structuredDeliveryEvents, swtShowMessage, saveStructuredDelivery, changeStateSaveData, idClientSeleted
        } = this.props;
        if (stringValidate(corporateGobernance.value) || stringValidate(reciprocity.value) || stringValidate(specialConsiderations.value)
            || stringValidate(businessWithAffiliates.value) || stringValidate(mergers.value) || stringValidate(dificultSituations.value)
            || structuredDeliveryEvents.size > 0) {
            var listEvents = [], allowSave = true;
            structuredDeliveryEvents.map((event) => {
                if (!stringValidate(event.name) || !stringValidate(event.date)) {
                    allowSave = false;
                }
                listEvents.push({
                    name: event.name,
                    dateEvent: moment(event.date, 'DD/MM/YYYY').format("YYYY-MM-DD HH:mm:ss")
                });
            });
            const idClientSave = _.isUndefined(idClientSeleted) || _.isNull(idClientSeleted) ? window.localStorage.getItem('idClientSelected') : idClientSeleted;
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
                        this.setState({
                            typeMessage: 'success',
                            titleMessage: 'Entrega estructurada',
                            message: 'Señor usuario, se ha guardado la información exitosamente.',
                            showMessage: true
                        });
                    }
                    changeStateSaveData(false, "");
                }, (reason) => {
                    changeStateSaveData(false, "");
                    swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                });
            } else {
                swtShowMessage('error', 'Información incompleta', 'Señor usuario, debe diligenciar todos los campos de los eventos.');
            }
        } else {
            swtShowMessage('error', 'Información incompleta', 'Señor usuario, para guardar debe diligenciar al menos un campo.');
        }
    }

    _closeEdit() {
        const {closeModal} = this.props
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
        const idClientSave = _.isUndefined(idClientSeleted) || _.isNull(idClientSeleted) ? window.localStorage.getItem('idClientSelected') : idClientSeleted;
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
                            date: moment(event.dateEvent, 'YYYY-MM-DD').format('DD/MM/YYYY')
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
        const {clearEvents, changeStateSaveData} = this.props;
        clearEvents();
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
                  } : {backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px"}}>
                <div style={callFromDeliveryClient ? {overflowX: 'hidden', marginLeft: '20px'} : {}}
                     className={callFromDeliveryClient ? "modalBt4-body modal-body business-content editable-form-content clearfix" : ''}>
                    <Row style={{marginBottom: "20px"}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{paddingRight: "15px"}}>
                                <dt>
                                    <span>Gobierno corporativo - Junta directiva del cliente</span>
                                    {
                                        corporateGobernanceDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(corporateGobernanceDate.value)}</span>
                                    }
                                    <ToolTip text={CORPORATE_GOVERNANCE_HELP}>
                                        <i className="help circle icon blue"
                                           style={{fontSize: "15px", cursor: "pointer", marginLeft: "5px"}}/>
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    name="corporateGobernance"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{width: '100%', height: '100px'}}
                                    {...corporateGobernance}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: "20px"}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{paddingRight: "15px"}}>
                                <dt>
                                    <span>Reciprocidades</span>
                                    {
                                        reciprocityDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(reciprocityDate.value)}</span>
                                    }
                                </dt>
                                <Textarea
                                    name="reciprocity"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{width: '100%', height: '100px'}}
                                    {...reciprocity}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: "20px"}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{paddingRight: "15px"}}>
                                <dt>
                                    <span>Consideraciones especiales de cuotas de manejo</span>
                                    {
                                        specialConsiderationsDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(specialConsiderationsDate.value)}</span>
                                    }
                                </dt>
                                <Textarea
                                    name="specialConsiderations"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{width: '100%', height: '100px'}}
                                    {...specialConsiderations}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: "20px"}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{paddingRight: "15px"}}>
                                <dt>
                                    <span>Negocios del cliente con filiales</span>
                                    {
                                        businessWithAffiliatesDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(businessWithAffiliatesDate.value)}</span>
                                    }
                                    <ToolTip text={BUSINESS_WITH_AFFILIATES_HELP}>
                                        <i className="help circle icon blue"
                                       style={{fontSize: "15px", cursor: "pointer", marginLeft: "5px"}}/>
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    name="businessWithAffiliates"
                                    type="text"
                                    max="2000"
                                    title="La longitud máxima de caracteres es de 2000"
                                    style={{width: '100%', height: '100px'}}
                                    {...businessWithAffiliates}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: "20px"}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{paddingRight: "15px"}}>
                                <dt>
                                    <span>Fusiones - Adquisiciones</span>
                                    {
                                        mergersDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(mergersDate.value)}</span>
                                    }
                                    <ToolTip text={MERGERS_HELP}>
                                    <i className="help circle icon blue"
                                       style={{fontSize: "15px", cursor: "pointer", marginLeft: "5px"}}
                                       />
                                    </ToolTip>
                                </dt>
                                <Textarea
                                    name="mergers"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{width: '100%', height: '100px'}}
                                    {...mergers}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: "20px"}}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{paddingRight: "15px"}}>
                                <dt>
                                    <span>Situaciones difíciles - Nuevos mercados</span>
                                    {
                                        dificultSituationsDate.value &&
                                        <span style={{
                                            fontWeight: "normal",
                                            color: "#B5B5B5"
                                        }}> - {mapDateValueFromTask(dificultSituationsDate.value)}</span>
                                    }
                                </dt>
                                <Textarea
                                    name="dificultSituations"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{width: '100%', height: '100px'}}
                                    {...dificultSituations}
                                />
                            </div>
                        </Col>
                    </Row>
                    <ComponentEvents callFromDeliveryClient={callFromDeliveryClient}/>
                </div>
                {callFromDeliveryClient ?
                    <div className="modalBt4-footer modal-footer">
                        <button className="btn btn-primary modal-button-edit" type="submit">
                            <span style={{color: '#FFFFFF', padding: '10px'}}>Guardar</span>
                        </button>
                    </div>
                    :
                    <div style={{
                        marginLeft: '-35px',
                        position: 'fixed',
                        border: '1px solid rgb(194, 194, 194)',
                        bottom: '0px',
                        width: '100%',
                        marginBottom: '0px',
                        height: '50px',
                        background: 'rgba(255, 255, 255, 0.74902)'
                    }}>
                        <div style={{width: '580px', height: '100%', position: 'fixed', right: '0px'}}>
                            <button className="btn" type="submit"
                                    style={{float: 'right', margin: '8px 0px 0px 450px', position: 'fixed'}}>
                                <span style={{color: '#FFFFFF', padding: '10px'}}>Guardar</span>
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
        changeStateSaveData
    }, dispatch);
}

function mapStateToProps({navBar, customerStory, selectsReducer, reducerGlobal, structuredDeliveryEvents, structuredDelivery}, ownerProps) {
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
    fields
}, mapStateToProps, mapDispatchToProps)(componentStructuredDelivery);