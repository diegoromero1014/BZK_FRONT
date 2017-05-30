import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import { ONLY_POSITIVE_INTEGER, VALUE_REQUIERED } from '../../../constantsGlobal';
import SweetAlert from 'sweetalert-react';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import {DISTRIBUTION_CHANNEL} from '../constants';
import _ from 'lodash';

class ComponentListDistributionChannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesDistribution = this._mapValuesDistribution.bind(this);
        this._viewInformationDistribution = this._viewInformationDistribution.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteDistribution = this._deleteDistribution.bind(this);
    }

    validateInfo(e) {
        e.preventDefault();
        const { distributionChannel, participation, fnShowForm, changeValueListClient, clientInformacion, swtShowMessage } = this.props;
        var countErrors = 0;
        if (_.isUndefined(distributionChannel.value) || _.isNull(distributionChannel.value) || _.isEmpty(distributionChannel.value)) {
            countErrors++;
        }
        if (_.isUndefined(participation.value) || _.isNull(participation.value) || _.isEmpty(participation.value)) {
            countErrors++;
        }

        if (_.isEqual(countErrors, 0)) {
            var listDistribution = clientInformacion.get('listDistribution');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('dist_'),
                    "distributionChannel": distributionChannel.value,
                    "participation": participation.value,
                };
                listDistribution.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "distributionChannel": distributionChannel.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value
                };
                listDistribution = _.remove(listDistribution, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listDistribution.push(updateValue);
            }
            changeValueListClient('listDistribution', listDistribution);
            this.clearValues();
            this.setState({ entitySeleted: null });
        } else {
            swtShowMessage('error', 'Canales de distrbución', 'Señor usuario, para agregar un canal de distrbución debe de ingresar todos los valores.');
        }
    }

    clearValues() {
        const { distributionChannel, participation, fnShowForm } = this.props;
        distributionChannel.onChange('');
        participation.onChange('');
        fnShowForm(DISTRIBUTION_CHANNEL, false);
        this.setState({ entitySeleted: null });
    }

    _viewInformationDistribution(entity) {
        const { distributionChannel, participation, fnShowForm, changeValueListClient, clientInformacion } = this.props;
        fnShowForm(DISTRIBUTION_CHANNEL, true);
        distributionChannel.onChange(entity.distributionChannel);
        participation.onChange(entity.participation.toString());
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
            <td style={{ textAlign: 'center' }}>{entity.participation} %</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar canal de distrbución" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { distributionChannel, participation, showFormDistribution, fnShowForm, clientInformacion } = this.props;
        const listDistribution = clientInformacion.get('listDistribution');
        return (
            <Row style={{ marginLeft: '20px', marginTop: '40px', width: '100%' }}>
                <Col xs={12} md={10} lg={11}>
                    <dl style={{ fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px" }}>
                        <span className="section-title">Canales de distribución y participación en ventas</span>
                    </dl>
                </Col>
                <Col xs={6} md={2} lg={1}>
                    <button className="btn btn-secondary" disabled={showFormDistribution} type="button" title="Agregar canal de distribución"
                        onClick={() => fnShowForm(DISTRIBUTION_CHANNEL, true)} style={showFormDistribution ? { marginLeft: '5px', cursor: 'not-allowed' } : { marginLeft: '5px' }}>
                        <i className="plus white icon"></i>
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
                                error={_.isEmpty(distributionChannel.value) ? VALUE_REQUIERED : null}
                                touched={true}
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
                                max="2"
                                placeholder="Participación"
                                {...participation}
                                value={participation.value}
                                onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, participation.value)}
                                error={_.isEmpty(participation.value) ? VALUE_REQUIERED : null}
                                touched={true}
                            />
                        </div>
                    </Col>
                }
                {showFormDistribution &&
                    <Col xs={4} md={3} lg={3}>
                        <button className="btn btn-secondary" type="button" onClick={this.validateInfo} title="Guardar"
                            style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                            <i className="plus white icon"></i>
                        </button>
                        <button className="btn btn-primary" type="button" onClick={this.validateInfo} title="Cancelar" onClick={this.clearValues}
                            style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
                            <i className="remove white icon"></i>
                        </button>
                    </Col>
                }
                {
                    _.size(listDistribution) > 0 ?
                        <Col xs={12} md={12} lg={12} style={{ paddingRight: '34px', marginTop: '15px' }}>
                            <table className="ui striped table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Canal de distrbucción</th>
                                        <th>Participación</th>
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
                    text="Señor usuario, ¿Está seguro que desea eliminar el canal de distrbución?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDelete: false })}
                    onConfirm={this._deleteDistribution} />
            </Row >
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

function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListDistributionChannel);