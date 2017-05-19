import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import Textarea from '../../../ui/textarea/textareaComponent';
import { nonValidateEnter, formValidateKeyEnter, validateResponse } from '../../../actionsGlobal';
import * as constants from './constants';
import { changeStateSaveData } from '../../dashboard/actions';
import numeral from 'numeral';
import _ from 'lodash';
import { saveCommercialObservations, getDetailAEC, clearDetailAEC } from './actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT } from '../../../constantsGlobal';

const fields = ["commercialObservations"];
const errors = {};

const validate = (values) => {
    if (!values.commercialObservations) {
        errors.commercialObservations = "Debe ingresar un valor";
    } else {
        errors.commercialObservations = null;
    }
    return errors;
};

class ModalPendingAEC extends Component {
    constructor(props) {
        super(props);
        this._handleEditAEC = this._handleEditAEC.bind(this);
        this._closeEdit = this._closeEdit.bind(this);
        this.state = {
            typeMessage: 'error',
            showMessage: false,
            titleMessage: '',
            message: '',
            disabled: '',
            botonBus: 'block',
            typeShareholder: [],
            disabledPer: 'disabled',
            valueTypeShareholder: ""
        }
    }

    _handleEditAEC() {
        const { fields: { commercialObservations }, saveCommercialObservations, aec, swtShowMessage } = this.props;
        const json = {
            idAEC: aec.idAEC,
            commercialObservations: commercialObservations.value
        }
        saveCommercialObservations(json).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                this.setState({
                    typeMessage: 'success',
                    titleMessage: 'Guardar AEC',
                    message: 'Señor usuario, las observaciones se han guardado exitosamente.',
                    showMessage: true
                });
            }
        }, (reason) => {
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    _closeEdit() {
        const { isOpen } = this.props;
        this.setState({
            showMessage: false
        });
        isOpen();
    }

    componentWillMount() {
        const { fields: { commercialObservations }, nonValidateEnter, aec, getDetailAEC, clearDetailAEC, swtShowMessage } = this.props;
        clearDetailAEC();
        nonValidateEnter(true);
        this.props.resetForm();
        getDetailAEC(aec.idAEC).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                var detailAEC = _.get(data, 'payload.data.data', []);
                commercialObservations.onChange(detailAEC.commercialObservations);
            }
        }, (reason) => {
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    render() {
        const { fields: { commercialObservations }, handleSubmit, aec, reducerGlobal } = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleEditAEC)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <Row>
                            <Col xs={12} md={6} lg={4} >
                                <dt style={{ paddingTop: '5px' }}>Número de documento</dt>
                                <dd style={{ minHeight: '26px' }}>{aec.numberClient}</dd>
                            </Col>
                            <Col xs={12} md={6} lg={8} >
                                <dt style={{ paddingTop: '5px' }}>Nombre/Razón social</dt>
                                <dd style={{ minHeight: '26px' }}>{aec.nameClient}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} >
                                <dt style={{ paddingTop: '5px' }}>Plan de acción</dt>
                                <dd style={{ minHeight: '26px', textAlign: 'justify' }}>{aec.actionPlan}</dd>
                            </Col>
                            <Col xs={12} md={12} lg={12} style={{ marginTop: '10px' }}>
                                <dt style={{ paddingTop: '5px' }}>Observaciones</dt>
                                <Textarea
                                    name="commercialObservations"
                                    type="text"
                                    max="500"
                                    title="La longitud máxima de caracteres es de 500"
                                    style={{ width: '100%', height: '120px' }}
                                    {...commercialObservations}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit">
                        Guardar
                    </button>
                </div>
                <SweetAlert
                    type={this.state.typeMessage}
                    show={this.state.showMessage}
                    title={this.state.titleMessage}
                    text={this.state.message}
                    onConfirm={this._closeEdit}
                />
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        nonValidateEnter,
        saveCommercialObservations,
        getDetailAEC,
        clearDetailAEC,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ selectsReducer, reducerGlobal }, ownerProps) {
    return {
        selectsReducer,
        reducerGlobal
    };
}

export default reduxForm({
    form: 'submitValidationPendingAEC',
    fields,
    destroyOnUnmount: false,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalPendingAEC);
