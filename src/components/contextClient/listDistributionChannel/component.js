import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber, checkRules, stringValidate } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import {
    ONLY_POSITIVE_INTEGER
} from '../../../constantsGlobal';
import SweetAlert from '../../sweetalertFocus';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { DISTRIBUTION_CHANNEL, MESSAGE_DISTRIBUTION_CHANNEL } from '../constants';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';
import {
    checkRequired, checkClientDescription,
    checkNumberInRange, checkMaxLength, checkFirstCharacter
} from '../../../validationsFields/rulesField';

export class ComponentListDistributionChannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null,
            errorForm: false,
            shouldUpdate: false
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesDistribution = this._mapValuesDistribution.bind(this);
        this._viewInformationDistribution = this._viewInformationDistribution.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteDistribution = this._deleteDistribution.bind(this);
        this.hasErrors = this.hasErrors.bind(this);

        this.rulesDistributionChannel = [checkRequired, checkClientDescription, checkMaxLength(50), checkFirstCharacter];
        this.rulesParticipation = [checkRequired, checkNumberInRange(0, 100)];
        this.rulesContribution = [checkNumberInRange(0, 100)];

    }

    hasErrors(fields) {
        let hasError = false;
        for (let error of fields) {
            if (!_.isNil(error)) {
                hasError = true;
                break;
            }
        }
        if (hasError) {
            this.setState({ 'errorForm': true });
        }
        return hasError;
    }

    validateInfo(e) {
        e.preventDefault();
        const { distributionChannel, participation, changeValueListClient,
            clientInformacion, contribution } = this.props;

        let validFields = this.hasErrors([
            distributionChannel.error, participation.error,
            contribution.error
        ])

        if (!validFields) {
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
        const { distributionChannel, participation, fnShowForm,
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

        const errorDistributionChannel = checkRules(this.rulesDistributionChannel, entity.distributionChannel);
        const errorParticipation = checkRules(this.rulesParticipation, entity.participation);
        const errorContribution = checkRules(this.rulesContribution, entity.contribution);
 
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar canal de distribución" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationDistribution(entity)} />
            </td>
            <td>{entity.distributionChannel}
            {
                errorDistributionChannel &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorDistributionChannel}
                    </div>
                </div>
            }
            </td>
            
            <td>{entity.participation} %
            {
                errorParticipation && 
                <div>
                    <div className="ui pointing red basic label">
                        {errorParticipation}
                    </div>
                </div>
            }</td>
            <td>{stringValidate(entity.contribution) ? entity.contribution + "%" : entity.contribution}
            {
                errorContribution &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorContribution}
                    </div>
                </div>
            }
            </td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar canal de distribución" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { distributionChannel, participation, showFormDistribution, fnShowForm,
            contribution, clientInformacion, changeValueListClient,
            registrationRequired, origin, className } = this.props;
        const listDistribution = clientInformacion.get('listDistribution');
        return (
            <div style={_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { border: "1px solid #ECECEC", borderRadius: "5px", margin: '15px 29px 0 25px' } : { width: '100%', border: "1px solid #ECECEC", borderRadius: "5px", margin: '15px 25px 0 29px' }}
                onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
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
                    <Row style={{ position:"relative", padding: "0px 10px 10px 20px" }}>
                        <div style={{ position:"absolute", right:0, marginTop: "-42px", paddingRight: "15px", textAlign: "right" }}>
                            <button className="btn btn-secondary" name={className} disabled={showFormDistribution} type="button"
                                onClick={() => fnShowForm(DISTRIBUTION_CHANNEL, true)} style={showFormDistribution ? { marginLeft: '5px', cursor: 'not-allowed' } : { marginLeft: '5px' }}>
                                <ToolTipComponent text="Agregar canal de distribución">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </div>
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
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Participación"
                                        {...participation}
                                        name="participationDC"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 7)}
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
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Contribución"
                                        {...contribution}
                                        name="contributionDC"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, contribution, val, false, 7)}
                                        touched={this.state.errorForm || registrationRequired}
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



export function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueListClient,
        swtShowMessage
    }, dispatch);
}

export function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListDistributionChannel);