import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import {
    ONLY_POSITIVE_INTEGER, VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../../constantsGlobal';
import { stringValidate, xssValidation } from '../../../actionsGlobal';
import SweetAlert from 'sweetalert-react';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { DISTRIBUTION_CHANNEL, MESSAGE_DISTRIBUTION_CHANNEL } from '../constants';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';
import { getValues } from "redux-form";


class ComponentListDistributionChannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null,
            errorForm: false
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesDistribution = this._mapValuesDistribution.bind(this);
        this._viewInformationDistribution = this._viewInformationDistribution.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteDistribution = this._deleteDistribution.bind(this);
        this.fieldValidation = this.fieldValidation.bind(this);
    }

    fieldValidation(fields) {
        const { swtShowMessage } = this.props;

        let message_error = "";
        for (var _field_i in fields) {
            var _field = fields[_field_i];

            if (_field.required && (_.isUndefined(_field.value) || _.isNull(_field.value) || _.isEmpty(_field.value))) {
                message_error = 'Señor usuario, para agregar un canal de distribución debe ingresar todos los valores.';
                break;
            } if (_field.xss && xssValidation(_field.value)) {
                message_error = REGEX_SIMPLE_XSS_MESAGE;
                break;
            }
        }

        if (message_error) {
            this.setState({ errorForm: true });
            swtShowMessage('error', 'Canales de distribución', message_error);
        }
        return _.isEmpty(message_error);
    }

    validateInfo(e) {
        e.preventDefault();
        const { distributionChannel, participation, fnShowForm, changeValueListClient,
            clientInformacion, swtShowMessage, contribution } = this.props;
        var countErrors = 0;
        if (_.isUndefined(distributionChannel.value) || _.isNull(distributionChannel.value) || _.isEmpty(distributionChannel.value)) {
            countErrors++;
        }
        if (_.isUndefined(participation.value) || _.isNull(participation.value) || _.isEmpty(participation.value)) {
            countErrors++;
        }

        // if (_.isEqual(countErrors, 0)) { 
        let validFields = this.fieldValidation([
            { required: true, value: distributionChannel.value, xss: true },
            { required: true, value: participation.value, xss: true },
            { required: false, value: contribution.value, xss: true }
        ])

        if (validFields) {
            var listDistribution = clientInformacion.get('listDistribution');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('dist_'),
                    "distributionChannel": distributionChannel.value,
                    "participation": participation.value.replace(/,/g, ""),
                    "contribution": contribution.value
                };
                listDistribution.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "distributionChannel": distributionChannel.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value.replace(/,/g, ""),
                    "contribution": contribution.value
                };
                listDistribution = _.remove(listDistribution, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listDistribution.push(updateValue);
            }
            changeValueListClient('listDistribution', listDistribution);
            this.clearValues();
            this.setState({ entitySeleted: null });
        }
        //  else {
        //     this.setState({ errorForm: true });
        //     swtShowMessage('error', 'Canales de distribución', 'Señor usuario, para agregar un canal de distribución debe ingresar todos los valores.');
        // }
    }

    clearValues() {
        const { distributionChannel, participation, contribution, fnShowForm } = this.props;
        distributionChannel.onChange('');
        participation.onChange('');
        contribution.onChange('');
        fnShowForm(DISTRIBUTION_CHANNEL, false);
        this.setState({ entitySeleted: null, errorForm: false });
    }

    _viewInformationDistribution(entity) {
        const { distributionChannel, participation, fnShowForm, changeValueListClient, clientInformacion,
            contribution } = this.props;
        fnShowForm(DISTRIBUTION_CHANNEL, true);
        distributionChannel.onChange(entity.distributionChannel);
        participation.onChange(entity.participation.toString());
        contribution.onChange(entity.contribution);
        this.setState({ entitySeleted: entity });
    }

    _openConfirmDelete(entity) {
        this.setState({
            entityDelete: entity,
            showConfirmDelete: true
        });
    }

    _deleteDistribution() {
        const { changeValueListClient, clientInformacion } = this.props;
        const listDistribution = clientInformacion.get('listDistribution');
        const newListPart = _.remove(listDistribution, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient('listDistribution', newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _mapValuesDistribution(entity, idx) {
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar canal de distribución" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationDistribution(entity)} />
            </td>
            <td>{entity.distributionChannel}</td>
            <td>{entity.participation} %</td>
            <td>{stringValidate(entity.contribution) ? entity.contribution + "%" : entity.contribution}</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar canal de distribución" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { distributionChannel, participation, showFormDistribution, fnShowForm,
            contribution, clientInformacion, changeValueListClient,
            registrationRequired, origin, parentForm } = this.props;
        const listDistribution = clientInformacion.get('listDistribution');
        return (
            <div style={_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { border: "1px solid #ECECEC", borderRadius: "5px", margin: '15px 29px 0 25px' } : { width: '100%', border: "1px solid #ECECEC", borderRadius: "5px", margin: '15px 25px 0 29px' }}>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <dl style={{ fontSize: "20px", color: "#505050", marginBottom: "5px", width: '100%' }}>
                            <span className="section-title">Canales de distribución y participación en ventas </span>
                            {origin === ORIGIN_CREDIT_STUDY &&
                                <div style={{ display: "inline" }}>
                                    (<span style={{ color: "red" }}>*</span>)
                            </div>
                            }
                            <ToolTipComponent text={MESSAGE_DISTRIBUTION_CHANNEL}>
                                <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                    className="help circle icon blue" />
                            </ToolTipComponent>
                            <input type="checkbox" title="No aplica" style={{ cursor: "pointer", marginLeft: '15px' }}
                                onClick={() => {
                                    changeValueListClient('noAppliedDistributionChannel', !clientInformacion.get('noAppliedDistributionChannel'))
                                    this.clearValues();
                                }}
                                checked={clientInformacion.get('noAppliedDistributionChannel')} /> <span style={{ fontSize: '11pt', color: 'black' }}>No aplica</span>
                        </dl>
                    </Col>
                </Row>
                {!clientInformacion.get('noAppliedDistributionChannel') &&
                    <Row style={{ padding: "0px 10px 10px 20px" }}>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: "-42px", paddingRight: "15px", textAlign: "right" }}>
                            <button className="btn btn-secondary" disabled={showFormDistribution} type="button"
                                onClick={() => fnShowForm(DISTRIBUTION_CHANNEL, true)} style={showFormDistribution ? { marginLeft: '5px', cursor: 'not-allowed' } : { marginLeft: '5px' }}>
                                <ToolTipComponent text="Agregar canal de distribución">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </Col>
                        {showFormDistribution &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Canal de distribución (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        name="distributionChannel"
                                        type="text"
                                        max="100"
                                        placeholder="Canal de distribución"
                                        {...distributionChannel}
                                        value={parentForm[distributionChannel.name]}
                                        error={_.isEmpty(parentForm[distributionChannel.name]) ? VALUE_REQUIERED : (xssValidation(parentForm[distributionChannel.name]) ? VALUE_XSS_INVALID : null)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormDistribution &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        name="participation"
                                        type="text"
                                        min={0}
                                        max="5"
                                        placeholder="Participación"
                                        {...participation}
                                        value={parentForm[participation.name]}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 2)}
                                        error={_.isEmpty(parentForm[participation.name]) ? VALUE_REQUIERED : (xssValidation(parentForm[participation.name]) ? VALUE_XSS_INVALID : null)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormDistribution &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>% Contribución</span></dt>
                                    <Input
                                        name="contribution"
                                        type="text"
                                        min={0}
                                        max="3"
                                        placeholder="Contribución"
                                        {...contribution}
                                        value={contribution.value}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, contribution, val, false, 0)}
                                        error={xssValidation(parentForm[contribution.name]) ? VALUE_XSS_INVALID : null}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormDistribution &&
                            <Col xs={4} md={3} lg={3}>
                                <button className="btn btn-secondary" type="button" onClick={this.validateInfo}
                                    style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                    Agregar
                                </button>
                                <button className="btn btn-primary" type="button" onClick={this.validateInfo} onClick={this.clearValues}
                                    style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
                                    Cancelar
                                </button>
                            </Col>
                        }
                        {_.size(listDistribution) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '15px', marginTop: '15px' }}>
                                <table className="ui striped table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Canal de distribucción</th>
                                            <th>Participación</th>
                                            <th>Contribución</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listDistribution.map(this._mapValuesDistribution)}
                                    </tbody>
                                </table>
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">No se han adicionado canales de distribución</span>
                                </div>
                            </Col>
                        }
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmDelete}
                            title="Confirmar eliminación"
                            text="Señor usuario, ¿Está seguro que desea eliminar el canal de distribución?"
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({ showConfirmDelete: false })}
                            onConfirm={this._deleteDistribution} />
                    </Row >
                }
            </div>
        );
    }
}

ComponentListDistributionChannel.PropTypes = {
    distributionChannel: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormDistribution: PropTypes.bool.isRequired
}



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueListClient,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ clientInformacion, form }, ownerProps) {
    return {
        clientInformacion,
        parentForm : getValues(form[ownerProps.formName])
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListDistributionChannel);