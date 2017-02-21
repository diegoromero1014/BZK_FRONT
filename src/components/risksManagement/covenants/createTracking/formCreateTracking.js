import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../ui/input/inputComponent';
import Textarea from '../../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../../ui/dateTimePicker/dateTimePickerComponent';
import { Row, Col } from 'react-flexbox-grid';
import { DATE_FORMAT, OPTION_REQUIRED, VALUE_REQUIERED, MESSAGE_SAVE_DATA } from '../../../../constantsGlobal';
import { redirectUrl } from '../../../globalComponents/actions';
import { changeStatusCreate, createTrackingCovenant, getInfoCovenant, clientCovenants } from '../actions';
import { VALID_COVENANT, FULLFILLMENT_COVENANT } from '../../../selectsComponent/constants';
import { getMasterDataFields } from '../../../selectsComponent/actions';
import { changeStateSaveData } from '../../../dashboard/actions';
import { covenantsFindServer, changePage } from '../../../alertCovenants/actions';
import { showLoading } from '../../../loading/actions';
import { NUMBER_RECORDS } from '../../../alertCovenants/constants';
import moment from 'moment';
import _ from 'lodash';

var response = false;
const fields = ["validCovenant", "fullfillmentCovenant", "observedValue", "dateFinancialStatements", "observations"];
const errors = {};

const validate = (values) => {
    if (!values.validCovenant) {
        errors.validCovenant = OPTION_REQUIRED;
    } else {
        errors.validCovenant = null;
    }
    if (!values.fullfillmentCovenant) {
        errors.fullfillmentCovenant = OPTION_REQUIRED;
    } else {
        errors.fullfillmentCovenant = null;
    }
    if (!values.observedValue) {
        errors.observedValue = VALUE_REQUIERED;
    } else {
        errors.observedValue = null;
    }
    return errors;
}

class FormCreateTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlertCreatetracking: false,
            showErrorAlertCreatetracking: false
        };
        this._closeMessageCreateTracking = this._closeMessageCreateTracking.bind(this);
        this._closeMessageErrorCreateTracking = this._closeMessageErrorCreateTracking.bind(this);
        this._handleCreateTracking = this._handleCreateTracking.bind(this);
        this._handleRefreshAlertCovenants = this._handleRefreshAlertCovenants.bind(this);
        this._canceCreate = this._canceCreate.bind(this);
    }

    componentWillMount() {
        const {getMasterDataFields} = this.props;
        getMasterDataFields([VALID_COVENANT, FULLFILLMENT_COVENANT]);
    }

    _closeMessageCreateTracking() {
        const {changeStatusCreate, getInfoCovenant, clientCovenants, isOpen, covenant } = this.props;
        this.setState({ showAlertCreatetracking: false });
        this.props.resetForm();
        changeStatusCreate(false);
        if (response) {
            this._handleRefreshAlertCovenants();
            clientCovenants();
            isOpen();
        } else {
            const infoCovenant = covenant.get('covenantInfo');
            getInfoCovenant(infoCovenant.idCovenant);
        }
    }

    _closeMessageErrorCreateTracking() {
        this.setState({ showErrorAlertCreatetracking: false });
    }

    _handleCreateTracking() {
        const {fields: {validCovenant, fullfillmentCovenant, observedValue, dateFinancialStatements, observations}, covenant,
            changeStateSaveData, createTrackingCovenant} = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        const trackingCovenant = {
            idCovenant: infoCovenant.idCovenant,
            validCovenant: validCovenant.value,
            fullfillmentCovenant: fullfillmentCovenant.value,
            observedValue: observedValue.value,
            dateFinancialStatements: parseInt(moment(dateFinancialStatements.value, DATE_FORMAT).format('x')),
            observations: observations.value
        };
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        createTrackingCovenant(trackingCovenant).then((data) => {
            changeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            } else {
                if (_.isEqual(_.get(data, 'payload.data.status'), 500)) {
                    console.log('Error creando seguimiento', _.get(data, 'payload.data.data'));
                    this.setState({ showErrorAlertCreatetracking: true });
                } else {
                    this.setState({ showAlertCreatetracking: true });
                if (_.get(data, 'payload.data.data') || _.get(data, 'payload.data.data') === true) {
                    response = true;
                } else {
                    response = false;
                }
                }
            }
        });
    }

    _handleRefreshAlertCovenants() {
        const {covenantsFindServer, alertCovenant, changePage, showLoading} = this.props;
        const keyWordNameNit = alertCovenant.get('keywordNameNit');
        const statusCovenant = alertCovenant.get('statusCovenant');
        const pageNum = alertCovenant.get('pageNum');
        const order = alertCovenant.get('order');
        const columnOrder = alertCovenant.get('columnOrder');
        showLoading(true, 'Cargando..');
        covenantsFindServer(keyWordNameNit, statusCovenant, pageNum, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
        changePage(1);
    }

    _canceCreate() {
        const {changeStatusCreate} = this.props;
        this.props.resetForm();
        changeStatusCreate(false);
    }

    render() {
        const { fields: {validCovenant, fullfillmentCovenant, observedValue, dateFinancialStatements, observations},
            handleSubmit, formValidateKeyEnter, selectsReducer, reducerGlobal} = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleCreateTracking)} >
                <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial', marginTop: '10px' }}>
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
                                data={selectsReducer.get(FULLFILLMENT_COVENANT) || []}
                                />
                        </Col>
                        <Col xs={12} md={6} lg={4} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Fecha de estados financieros </span>
                            </dt>
                            <DateTimePickerUi
                                culture='es'
                                format={DATE_FORMAT}
                                time={false}
                                {...dateFinancialStatements}
                                />
                        </Col>
                        <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Valor observado (</span><span style={{ color: "red" }}>*</span>)
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
                                <span>Observaciones</span>
                            </dt>
                            <Textarea
                                name="observations"
                                type="text"
                                max="2000"
                                {...observations}
                                title="La longitud máxima de caracteres es de 2000"
                                style={{ width: '100%' }}
                                />
                        </Col>
                    </Row>

                    <Row xs={12} md={12} lg={12} style={{ paddingBottom: '30px', marginLeft: '3px' }}>
                        <button className="btn" type="submit" >
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                        </button>
                        <button className="btn" type="button" onClick={this._canceCreate} style={{ backgroundColor: "rgb(193, 193, 193)", marginLeft: '15px' }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </Row>
                </div>
                <SweetAlert
                    type="success"
                    show={this.state.showAlertCreatetracking}
                    title="Creación seguimiento"
                    text="Señor usuario, el seguimiento se creó de forma exitosa."
                    onConfirm={this._closeMessageCreateTracking}
                    />
                <SweetAlert
                    type="error"
                    show={this.state.showErrorAlertCreatetracking}
                    title="Creación seguimiento"
                    text="Señor usuario, ocurrió un error tratando de crear el seguimiento."
                    onConfirm={this._closeMessageErrorCreateTracking}
                    />
            </form>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeStatusCreate,
        getMasterDataFields,
        changeStateSaveData,
        createTrackingCovenant,
        getInfoCovenant,
        clientCovenants,
        redirectUrl,
        covenantsFindServer,
        showLoading,
        changePage
    }, dispatch);
}

function mapStateToProps({selectsReducer, reducerGlobal, covenant, alertCovenant}, ownerProps) {
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