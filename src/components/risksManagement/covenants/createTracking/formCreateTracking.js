import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { reduxForm } from "redux-form";
import { Col, Row } from "react-flexbox-grid";
import moment from "moment";
import _ from "lodash";
import { fields, validations as validate } from './filesAndRules';

import ComboBox from "../../../../ui/comboBox/comboBoxComponent";
import InputComponent from "../../../../ui/input/inputComponent";
import Textarea from "../../../../ui/textarea/textareaComponent";
import DateTimePickerUi from "../../../../ui/dateTimePicker/dateTimePickerComponent";

import { validateIsNullOrUndefined } from "../../../../actionsGlobal";
import { redirectUrl } from "../../../globalComponents/actions";
import { changeStatusCreate, clientCovenants, createTrackingCovenant, getInfoCovenant } from "../actions";
import { getMasterDataFields } from "../../../selectsComponent/actions";
import { changePage, covenantsFindServer } from "../../../alertCovenants/actions";
import { showLoading } from "../../../loading/actions";
import { swtShowMessage } from "../../../sweetAlertMessages/actions";

import { DATE_FORMAT, MESSAGE_SAVE_DATA, STR_YES } from "../../../../constantsGlobal";
import { FULLFILLMENT_COVENANT, VALID_COVENANT } from "../../../selectsComponent/constants";
import { TITLE_FIELD_OBSERVED_VALUE, CLASSIFICATION_SPECIFIC } from "../constants";
import { NUMBER_RECORDS } from "../../../alertCovenants/constants";

let isMandatoryObservations = false;
let isFinancialStatements = false;

export class FormCreateTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMandatoryObservations: false,
            isFinancialStatements: false
        };
        this._handleCreateTracking = this._handleCreateTracking.bind(this);
        this._handleRefreshAlertCovenants = this._handleRefreshAlertCovenants.bind(this);
        this._cancelCreate = this._cancelCreate.bind(this);
        this._onChangeValidCovenant = this._onChangeValidCovenant.bind(this);
        this._onFullfillmentCovenant = this._onFullfillmentCovenant.bind(this);
        this.validateCovenantObservation = this.validateCovenantObservation.bind(this);
        this._onBlurComboBox = this._onBlurComboBox.bind(this);

    }

    componentWillMount() {
        const { getMasterDataFields } = this.props;
        getMasterDataFields([VALID_COVENANT, FULLFILLMENT_COVENANT]);
    }

    validateCovenantObservation(validCovenantVal, fullfillmentCovenantVal) {
        const { selectsReducer, fields: { isMandatoryObservations } } = this.props;
        let validCovenantObj = _.find(_.toArray(selectsReducer.get(VALID_COVENANT)), (item) => item.id == validCovenantVal);
        let fullfillmentCovenantObj = _.find(_.toArray(selectsReducer.get(FULLFILLMENT_COVENANT)), (item) => item.id == fullfillmentCovenantVal);
        
        let newValue = isMandatoryObservations.value;
        
        if (!validateIsNullOrUndefined(validCovenantObj) && !validateIsNullOrUndefined(fullfillmentCovenantObj)) {
            newValue = !_.isEqual(_.get(validCovenantObj, 'value'), STR_YES) || (_.isEqual(_.get(validCovenantObj, 'value'), STR_YES) && !_.isEqual(_.get(fullfillmentCovenantObj, 'value'), STR_YES));
        } else {
            if (!validateIsNullOrUndefined(validCovenantObj)) {
                newValue = !_.isEqual(_.get(validCovenantObj, 'value'), STR_YES);
            }
        }

        if (newValue != isMandatoryObservations.value) {
            isMandatoryObservations.onChange(newValue);
        }

        this.setState({ isMandatoryObservations: newValue});

    }

    _onBlurComboBox() {
        this.setState(this.state);
    }

    _onChangeValidCovenant(val) {
        const { fields: { validCovenant, fullfillmentCovenant } } = this.props;
        this.validateCovenantObservation(val, fullfillmentCovenant.value);
        validCovenant.onChange(val);
    }

    _onFullfillmentCovenant(val) {
        const { selectsReducer, covenant, fields: { validCovenant, fullfillmentCovenant, isFinancialStatements } } = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        this.validateCovenantObservation(validCovenant.value, val);

        let fullfillmentCovenantObj = _.find(_.toArray(selectsReducer.get(FULLFILLMENT_COVENANT)), (item) => item.id == val);
        let newValue = isFinancialStatements.value;
        newValue = _.isEqual(_.get(fullfillmentCovenantObj, 'value'), STR_YES) && _.isEqual(_.get(infoCovenant, 'strClassification'), CLASSIFICATION_SPECIFIC);
        if (newValue != isFinancialStatements.value) {
            isFinancialStatements.onChange(newValue);
        }
        this.setState({ isFinancialStatements: newValue });

        fullfillmentCovenant.onChange(val);
    }

    _handleCreateTracking() {
        const {
            fields: { validCovenant, fullfillmentCovenant, observedValue, dateFinancialStatements, observations },
            covenant, showLoading, createTrackingCovenant, swtShowMessage, changeStatusCreate, getInfoCovenant,
            clientCovenants, isOpen
        } = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        const trackingCovenant = {
            idCovenant: infoCovenant.idCovenant,
            validCovenant: validCovenant.value,
            fullfillmentCovenant: fullfillmentCovenant.value,
            observedValue: observedValue.value,
            dateFinancialStatements: parseInt(moment(dateFinancialStatements.value, DATE_FORMAT).format('x')),
            observations: observations.value
        };
        showLoading(true, MESSAGE_SAVE_DATA);
        createTrackingCovenant(trackingCovenant).then((data) => {
            showLoading(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            } else {
                var messageProcess = _.get(data, 'payload.data.data');
                if (_.isEqual(_.get(data, 'payload.data.status'), 500)) {
                    if(messageProcess){
                        swtShowMessage("error", "Creación seguimiento", messageProcess);
                    }else{
                        swtShowMessage("error", "Creación seguimiento", "Señor usuario, ocurrió un error tratando de crear el seguimiento.");
                    }
                } else {
                    swtShowMessage("success", "Creación seguimiento", "Señor usuario, el seguimiento se creó de forma exitosa.");
                    if (messageProcess || messageProcess === true) {
                        isOpen();
                    } else {
                        getInfoCovenant(_.get(covenant.get('covenantInfo'), 'idCovenant'));
                    }
                    this._handleRefreshAlertCovenants();
                    this.props.resetForm();
                    changeStatusCreate(false);
                    clientCovenants();
                }
            }
        });
    }

    _handleRefreshAlertCovenants() {
        const { covenantsFindServer, alertCovenant, changePage, showLoading } = this.props;
        const keyWordNameNit = alertCovenant.get('keywordNameNit');
        const statusCovenant = alertCovenant.get('statusCovenant');
        const order = alertCovenant.get('order');
        const columnOrder = alertCovenant.get('columnOrder');
        showLoading(true, 'Cargando..');
        covenantsFindServer(keyWordNameNit, statusCovenant, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
                changePage(1);
            }
        });
    }

    _cancelCreate() {
        const { changeStatusCreate } = this.props;
        this.props.resetForm();
        changeStatusCreate(false);
    }

    render() {
        const {
            fields: { validCovenant, fullfillmentCovenant, observedValue, dateFinancialStatements, observations },
            handleSubmit, selectsReducer
        } = this.props;
        
        return (
            <form onSubmit={handleSubmit(this._handleCreateTracking)}>
                <div className="tab-content break-word" style={{
                    zIndex: 0,
                    border: '1px solid #cecece',
                    padding: '16px',
                    borderRadius: '3px',
                    overflow: 'initial',
                    marginTop: '10px'
                }}>
                    <Row xs={12} md={12} lg={12} style={{ paddingBottom: '20px' }}>
                        <Col xs={12} md={6} lg={4} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Covenant vigente (</span><span style={{ color: "red" }}>*</span>)
                            </dt>
                            <ComboBox
                                name="validCovenant"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                {...validCovenant}
                                onChange={val => this._onChangeValidCovenant(val)}
                                onBlur={() => this._onBlurComboBox()}
                                data={selectsReducer.get(VALID_COVENANT) || []}
                            />
                        </Col>
                        <Col xs={12} md={6} lg={4} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Cumplimiento del covenant (</span><span style={{ color: "red" }}>*</span>)
                            </dt>
                            <ComboBox
                                name="fullfillmentCovenant"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                {...fullfillmentCovenant}
                                onChange={val => this._onFullfillmentCovenant(val)}
                                onBlur={() => this._onBlurComboBox()}
                                data={selectsReducer.get(FULLFILLMENT_COVENANT) || []}
                            />
                        </Col>
                        <Col xs={12} md={6} lg={4} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Fecha de estados financieros
                                    {this.state.isFinancialStatements ?
                                        <span> (<span style={{ color: "red" }}>*</span>)</span> : ""}
                                </span>
                            </dt>
                            <DateTimePickerUi
                                name='dateFinancialStatements'
                                culture='es'
                                format={DATE_FORMAT}
                                time={false}
                                {...dateFinancialStatements}
                            />
                        </Col>
                        <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Valor observado (</span><span style={{ color: "red" }}>*</span>)
                                <i className="help circle icon blue"
                                    style={{ fontSize: "14px", cursor: "pointer", marginLeft: "2px" }}
                                    title={TITLE_FIELD_OBSERVED_VALUE} />
                            </dt>
                            <InputComponent
                                name="observedValue"
                                type="text"
                                {...observedValue}
                                max="100"
                            />
                        </Col>
                        <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Observaciones
                                    {this.state.isMandatoryObservations ?
                                        <span> (<span style={{ color: "red" }}>*</span>)</span> : ""}
                                </span>
                            </dt>
                            <Textarea
                                {...observations}
                                name="observations"
                                type="text"
                                max="2000"
                                title="La longitud máxima de caracteres es de 2000"
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                    <Row xs={12} md={12} lg={12} style={{ paddingBottom: '30px', marginLeft: '3px' }}>
                        <button className="btn" type="submit">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                        </button>
                        <button className="btn" type="button" onClick={this._cancelCreate}
                            style={{ backgroundColor: "rgb(193, 193, 193)", marginLeft: '15px' }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </Row>
                </div>
            </form>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeStatusCreate,
        getMasterDataFields,
        createTrackingCovenant,
        getInfoCovenant,
        clientCovenants,
        redirectUrl,
        covenantsFindServer,
        showLoading,
        changePage,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ selectsReducer, reducerGlobal, covenant, alertCovenant }) {
    return {
        selectsReducer,
        reducerGlobal,
        covenant,
        alertCovenant
    };
}

export default reduxForm({
    form: 'submitValidationTrackingCovenant',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormCreateTracking);