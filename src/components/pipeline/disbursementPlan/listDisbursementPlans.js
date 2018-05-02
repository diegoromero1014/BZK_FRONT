import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import _ from "lodash";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import Input from '../../../ui/input/inputComponent';
import { ONLY_POSITIVE_INTEGER, VALUE_REQUIERED, MESSAGE_ERROR } from '../../../constantsGlobal';
import { stringValidate, handleFocusValueNumber, handleBlurValueNumber } from '../../../actionsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { updateDisbursementPlans } from '../actions';
import ToolTip from '../../toolTip/toolTipComponent';
import SweetAlert from '../../sweetalertFocus';
import { ORIGIN_PIPELIN_BUSINESS } from '../constants';
import moment from 'moment';

class ListDisbursementPlans extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            errorForm: false,
            entityDelete: null,
            entitySeleted: null
        }
        this._clearValues = this._clearValues.bind(this);
        this._validateInfo = this._validateInfo.bind(this);
        this._mapValuesDisbursementPlans = this._mapValuesDisbursementPlans.bind(this);
        this._viewInformationDisbursementPlan = this._viewInformationDisbursementPlan.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteDisbursementPlan = this._deleteDisbursementPlan.bind(this);
        this._getNameDisbursementPlansInReducer = this._getNameDisbursementPlansInReducer.bind(this);
    }

    _mapValuesDisbursementPlans(entity, isEditable, idx) {
        return <tr key={idx}>
            {isEditable && <td className="collapsing">
                <ToolTip text={'Editar plan de desembolso'}>
                    <i className="zoom icon" style={{ cursor: "pointer" }}
                        onClick={() => this._viewInformationDisbursementPlan(entity)} />
                </ToolTip>
            </td>
            }
            <td>{handleBlurValueNumber(ONLY_POSITIVE_INTEGER, null, (entity.disbursementAmount).toString(), true, 2)}</td>
            <td>{entity.estimatedDisburDate}</td>
            {isEditable && <td className="collapsing">
                <ToolTip text={'Eliminar plan de desembolso'}>
                    <i className="trash icon" style={{ cursor: "pointer" }}
                        onClick={() => this._openConfirmDelete(entity)} />
                </ToolTip>
            </td>
            }
        </tr>
    }

    _viewInformationDisbursementPlan(entity) {
        const { disbursementAmount, estimatedDisburDate, fnShowForm } = this.props;
        fnShowForm(true);
        disbursementAmount.onChange(entity.disbursementAmount);
        estimatedDisburDate.onChange(entity.estimatedDisburDate);
        this.setState({ entitySeleted: entity });
    }

    _openConfirmDelete(entity) {
        this.setState({
            entityDelete: entity,
            showConfirmDelete: true
        });
    }

    _deleteDisbursementPlan() {
        const { updateDisbursementPlans, pipelineReducer, showFormDisbursementPlan,
            pendingDisbursementAmount, origin } = this.props;
        const listDisbursementPlans = pipelineReducer.get(this._getNameDisbursementPlansInReducer());
        var disbursementAmountItem = 0;
        const pendingDisbursementAmountNum = parseFloat(((pendingDisbursementAmount.value).toString()).replace(/,/g, ""));
        const newListPart = _.remove(listDisbursementPlans, (item) => {
            if (_.isEqual(item.id, this.state.entityDelete.id)) {
                disbursementAmountItem = parseFloat((item.disbursementAmount.toString()).replace(/,/g, ""));
                return false;
            } else {
                return true;
            }
        });
        handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisbursementAmount, _.sum([pendingDisbursementAmountNum, disbursementAmountItem]).toFixed(2), true, 2);
        updateDisbursementPlans(newListPart, origin);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _clearValues() {
        const { disbursementAmount, estimatedDisburDate, fnShowForm } = this.props;
        disbursementAmount.onChange('');
        estimatedDisburDate.onChange('');
        fnShowForm(false);
    }

    _validateInfo() {
        const { disbursementAmount, estimatedDisburDate, swtShowMessage, nominalValue, origin,
            updateDisbursementPlans, pipelineReducer, pendingDisbursementAmount } = this.props;
        if (!stringValidate(disbursementAmount.value) || !stringValidate(estimatedDisburDate.value)) {
            this.setState({ errorForm: true });
            swtShowMessage(MESSAGE_ERROR, 'Plan de desembolso', 'Señor usuario, debe ingresar todos los campos.');
        } else {
            if (!moment(estimatedDisburDate.value, 'MM/YYYY').isValid()) {
                swtShowMessage(MESSAGE_ERROR, 'Plan de desembolso', 'Señor usuario, debe seleccionar un valor válido para la fecha de desembolso.');
            } else {
                var listDisbursementPlans = pipelineReducer.get(this._getNameDisbursementPlansInReducer());
                var totalDisbursementAmount = _.sumBy(listDisbursementPlans, 'disbursementAmount');
                const disbursementAmountNum = parseFloat((disbursementAmount.value.toString()).replace(/,/g, ""));
                var pendingDisbursementAmountNum = parseFloat((pendingDisbursementAmount.value.toString()).replace(/,/g, ""));
                if (this.state.entitySeleted != null) {
                    var disbursementAmountEntitySelected = _.get(_.filter(listDisbursementPlans, ['id', this.state.entitySeleted.id]), '[0].disbursementAmount');
                    totalDisbursementAmount = _.subtract(totalDisbursementAmount, disbursementAmountEntitySelected);
                    pendingDisbursementAmountNum = _.sum([pendingDisbursementAmountNum, disbursementAmountEntitySelected]);
                }
                if ((disbursementAmountNum > pendingDisbursementAmountNum && this.state.entitySeleted == null) ||
                    (this.state.entitySeleted != null && disbursementAmountNum > pendingDisbursementAmountNum)) {
                    swtShowMessage(MESSAGE_ERROR, 'Plan de desembolso', 'Señor usuario, el valor de desembolso no puede superar el valor pendiente por desembolsar.');
                } else {
                    var disbursementAmountItem;
                    if (_.isNull(this.state.entitySeleted)) {
                        const newDisbursementPlan = {
                            id: _.uniqueId('disburPlan_'),
                            disbursementAmount: parseFloat(disbursementAmountNum),
                            estimatedDisburDate: estimatedDisburDate.value
                        };
                        listDisbursementPlans.push(newDisbursementPlan);
                        disbursementAmountItem = _.subtract(pendingDisbursementAmountNum, newDisbursementPlan.disbursementAmount);
                        handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisbursementAmount, (disbursementAmountItem).toString(), true, 2);
                    } else {
                        const updateValue = {
                            id: this.state.entitySeleted.id,
                            disbursementAmount: disbursementAmountNum,
                            estimatedDisburDate: estimatedDisburDate.value
                        };
                        listDisbursementPlans = _.remove(listDisbursementPlans, (item) => {
                            return !_.isEqual(item.id, this.state.entitySeleted.id);
                        });
                        disbursementAmountItem = _.subtract(pendingDisbursementAmountNum, disbursementAmountNum).toFixed(2);
                        handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisbursementAmount, (disbursementAmountItem).toString(), true, 2);
                        listDisbursementPlans.push(updateValue);
                    }
                    updateDisbursementPlans(listDisbursementPlans, origin);
                    this._clearValues();
                    this.setState({ entitySeleted: null });
                }
            }
        }
    }

    _getNameDisbursementPlansInReducer() {
        const { origin } = this.props;
        if (origin === ORIGIN_PIPELIN_BUSINESS) {
            return "childBusinessDisbursementPlans";
        } else {
            return "disbursementPlans";
        }
    }

    render() {
        const { disbursementAmount, estimatedDisburDate, showFormDisbursementPlan, pendingDisbursementAmount,
            fnShowForm, registrationRequired, pipelineReducer, nominalValue, isEditable, origin } = this.props;
        var listDisbursementPlans = pipelineReducer.get(this._getNameDisbursementPlansInReducer());
        const sizeListDisbursementPlans = _.size(listDisbursementPlans);
        const allowsAddDisbursementPlans = ((pendingDisbursementAmount.value.toString()).replace(/,/g, "") > 0 ? false : true) || showFormDisbursementPlan || _.isNil(pendingDisbursementAmount.value);
        return (
            <div>
                {isEditable &&
                    <Row>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: "-50px", paddingRight: "16px", textAlign: "right" }}>
                            <button className="btn" onClick={() => fnShowForm(true)}
                                disabled={allowsAddDisbursementPlans} type="button"
                                style={allowsAddDisbursementPlans ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                                Agregar plan de desembolso
                        </button>
                        </Col>
                    </Row>
                }
                {showFormDisbursementPlan &&
                    <Row style={{ margin: "15px 10px 0px 20px", padding: '15px', borderRadius: '3px', border: '1px solid #cecece' }}>
                        <Col xs={12} md={4} lg={3}>
                            <div>
                                <dt><span>Valor de desembolso (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <Input
                                    name="disbursementAmount"
                                    type="text"
                                    max="15"
                                    {...disbursementAmount}
                                    onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, disbursementAmount, val, true, 2)}
                                    onFocus={val => handleFocusValueNumber(disbursementAmount, disbursementAmount.value)}
                                    error={_.isEmpty(disbursementAmount.value) ? VALUE_REQUIERED : null}
                                    touched={this.state.errorForm || registrationRequired}
                                />
                            </div>
                        </Col>
                        <Col xs={12} md={5} lg={4}>
                            <div>
                                <dt><span>Fecha estimada de desembolso (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <DateTimePickerUi
                                    {...estimatedDisburDate}
                                    culture='es'
                                    time={false}
                                    format={'MM/YYYY'}
                                    initialView='year'
                                    error={_.isEmpty(estimatedDisburDate.value) ? VALUE_REQUIERED : null}
                                    touched={this.state.errorForm || registrationRequired}
                                />
                            </div>
                        </Col>
                        <Col xs={6} md={4} lg={4}>
                            <button className="btn btn-secondary" type="button" onClick={this._validateInfo} title="Agregar"
                                style={origin === ORIGIN_PIPELIN_BUSINESS ?
                                    { cursor: 'pointer', marginTop: '37px', marginRight: '15px', marginLeft: '15px' }
                                    :
                                    { cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }
                                }>
                                Agregar
                                </button>
                            <button className="btn btn-primary" type="button" title="Cancelar" onClick={this._clearValues}
                                style={origin === ORIGIN_PIPELIN_BUSINESS ?
                                    { cursor: 'pointer', marginTop: '37px', backgroundColor: "#C1C1C1" }
                                    :
                                    { cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }
                                }>
                                Cancelar
                                </button>
                        </Col>
                    </Row>
                }
                {_.size(listDisbursementPlans) > 0 ?
                    <Row style={{
                        backgroundColor: 'white', margin: "10 10 0 10", padding: "16px"
                    }}>
                        <Col xs={12} md={12} lg={12}>
                            <table className="ui striped table">
                                <thead>
                                    <tr>
                                        {isEditable && <th></th>}
                                        <th>Valor de desembolso</th>
                                        <th>Fecha estimada de desembolso</th>
                                        {isEditable && <th></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listDisbursementPlans.map((item, idx) => this._mapValuesDisbursementPlans(item, isEditable, idx))}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    :
                    <Row center="xs" style={{ padding: "16px", margin: "10px 0 10px 0" }}>
                        <Col xs={12} sm={8} md={12} lg={12}>
                            <span style={{ color: '#4C5360' }}>Aún no se han adicionado planes de desembolso</span>
                        </Col>
                    </Row>
                }
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDelete}
                    title="Confirmar eliminación"
                    text="Señor usuario, ¿está seguro que desea eliminar el plan de desembolso?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDelete: false })}
                    onConfirm={this._deleteDisbursementPlan} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        swtShowMessage,
        updateDisbursementPlans
    }, dispatch);
}

function mapStateToProps({ pipelineReducer }, ownerProps) {
    return {
        pipelineReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDisbursementPlans);
