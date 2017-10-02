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
import SweetAlert from 'sweetalert-react';

class ListDisbursementPlans extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            errorForm: false,
            entityDelete: null,
            entitySeleted: null,
        }
        this._clearValues = this._clearValues.bind(this);
        this._validateInfo = this._validateInfo.bind(this);
        this._mapValuesDisbursementPlans = this._mapValuesDisbursementPlans.bind(this);
        this._viewInformationDisbursementPlan = this._viewInformationDisbursementPlan.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteDisbursementPlan = this._deleteDisbursementPlan.bind(this);
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
            <td>{entity.disbursementAmount}</td>
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
            nominalValue } = this.props;
        const listDisbursementPlans = pipelineReducer.get('disbursementPlans');
        var disbursementAmountItem = 0;
        const newListPart = _.remove(listDisbursementPlans, (item) => {
            if (_.isEqual(item.id, this.state.entityDelete.id)) {
                disbursementAmountItem = item.disbursementAmount;
                return false;
            } else {
                return true;
            }
        });
        nominalValue.onChange(_.sum([parseFloat(nominalValue.value), parseFloat(disbursementAmountItem)]));
        updateDisbursementPlans(newListPart);
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
        const { disbursementAmount, estimatedDisburDate, swtShowMessage, nominalValue,
            updateDisbursementPlans, pipelineReducer } = this.props;
        if (!stringValidate(disbursementAmount.value) || !stringValidate(estimatedDisburDate.value)) {
            this.setState({ errorForm: true });
            swtShowMessage(MESSAGE_ERROR, 'Plan de desembolso', 'Señor usuario, debe ingresar todos los campos.');
        } else {
            var listDisbursementPlans = pipelineReducer.get('disbursementPlans');
            var totalDisbursementAmount = _.sumBy(listDisbursementPlans, 'disbursementAmount');
            totalDisbursementAmount = _.sum([totalDisbursementAmount, parseFloat(nominalValue.value)]);
            if ((disbursementAmount.value > nominalValue.value && this.state.entitySeleted == null) ||
                (this.state.entitySeleted != null && disbursementAmount.value > totalDisbursementAmount)) {
                swtShowMessage(MESSAGE_ERROR, 'Plan de desembolso', 'Señor usuario, el valor de desembolso no puede superar el valor nominal.');
            } else {
                var disbursementAmountItem;
                if (_.isNull(this.state.entitySeleted)) {
                    const newDisbursementPlan = {
                        id: _.uniqueId('disburPlan_'),
                        disbursementAmount: parseFloat(disbursementAmount.value),
                        estimatedDisburDate: estimatedDisburDate.value
                    };
                    listDisbursementPlans.push(newDisbursementPlan);
                    disbursementAmountItem = _.subtract(nominalValue.value, newDisbursementPlan.disbursementAmount);
                    nominalValue.onChange((disbursementAmountItem).toString());
                } else {
                    const updateValue = {
                        id: this.state.entitySeleted.id,
                        disbursementAmount: disbursementAmount.value,
                        estimatedDisburDate: estimatedDisburDate.value
                    };
                    disbursementAmountItem = 0;
                    listDisbursementPlans = _.remove(listDisbursementPlans, (item) => {
                        if (_.isEqual(item.id, this.state.entitySeleted.id)) {
                            disbursementAmountItem = item.disbursementAmount;
                            return false;
                        } else {
                            return true;
                        }
                    });
                    disbursementAmountItem = _.sum([nominalValue.value, disbursementAmountItem]);
                    disbursementAmountItem = _.subtract(disbursementAmountItem, updateValue.disbursementAmount);
                    nominalValue.onChange((disbursementAmountItem).toString());
                    listDisbursementPlans.push(updateValue);
                }
                updateDisbursementPlans(listDisbursementPlans);
                this._clearValues();
                this.setState({ entitySeleted: null });
            }
        }
    }

    render() {
        const { disbursementAmount, estimatedDisburDate, showFormDisbursementPlan,
            fnShowForm, registrationRequired, pipelineReducer, nominalValue, isEditable } = this.props;
        var listDisbursementPlans = pipelineReducer.get('disbursementPlans');
        const sizeListDisbursementPlans = _.size(listDisbursementPlans);
        const allowsAddDisbursementPlans = (nominalValue.value > 0 ? false : true) || showFormDisbursementPlan || _.isNil(nominalValue.value);
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
                                    max="28"
                                    {...disbursementAmount}
                                    onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, disbursementAmount, disbursementAmount.value, true, 2)}
                                    onFocus={val => handleFocusValueNumber(disbursementAmount, disbursementAmount.value)}
                                    error={_.isEmpty(disbursementAmount.value) ? VALUE_REQUIERED : null}
                                    touched={this.state.errorForm || registrationRequired}
                                />
                            </div>
                        </Col>
                        <Col xs={12} md={4} lg={3}>
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
                        <Col xs={6} md={5} lg={5}>
                            <button className="btn btn-secondary" type="button" onClick={this._validateInfo} title="Agregar"
                                style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                Agregar
                                </button>
                            <button className="btn btn-primary" type="button" title="Cancelar" onClick={this._clearValues}
                                style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
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
