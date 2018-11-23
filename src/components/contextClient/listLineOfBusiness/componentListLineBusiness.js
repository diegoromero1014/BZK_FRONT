import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber, validateValueExist, stringValidate, xssValidation } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import {
    ONLY_POSITIVE_INTEGER, VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../../constantsGlobal';

import SweetAlert from '../../sweetalertFocus';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { LINE_OF_BUSINESS, MESSAGE_LINE_OF_BUSINESS } from '../constants';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';


export class ComponentListLineBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null,
            errorForm: true,
            shouldUpdate: false
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesParitipation = this._mapValuesParitipation.bind(this);
        this._viewInformationLineBusiness = this._viewInformationLineBusiness.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteLineOfBusiness = this._deleteLineOfBusiness.bind(this);
        this.hasErrors = this.hasErrors.bind(this);
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
            this.setState({'errorForm': true});
        }
        return hasError;
    }

    validateInfo(e) {
        e.preventDefault();
        const { contextLineBusiness, participation, experience, changeValueListClient,
            clientInformacion, contribution } = this.props;
      
        let validFields = this.hasErrors([
            contextLineBusiness.error, participation.error,
            experience.error, contribution.error
        ]);

        if (!validFields) {
            var listParticipation = clientInformacion.get('listParticipation');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('line_'),
                    "lineOfBusiness": contextLineBusiness.value,
                    "participation": participation.value.replace(/,/g, ""),
                    "experience": experience.value,
                    "contribution": contribution.value
                };
                listParticipation.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "lineOfBusiness": contextLineBusiness.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value.replace(/,/g, ""),
                    "experience": experience.value,
                    "contribution": contribution.value
                };
                listParticipation = _.remove(listParticipation, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listParticipation.push(updateValue);
            }
            changeValueListClient('listParticipation', listParticipation);
            this.clearValues();
            this.setState({ entitySeleted: null });
        }

    }

    clearValues() {
        const { contextLineBusiness, participation, experience, contribution, fnShowForm } = this.props;
        contextLineBusiness.onChange('');
        participation.onChange('');
        experience.onChange('');
        contribution.onChange('');
        fnShowForm(LINE_OF_BUSINESS, false);
        this.setState({ entitySeleted: null, errorForm: false });
    }

    _viewInformationLineBusiness(entity) {
        const { contextLineBusiness, participation, experience, fnShowForm, changeValueListClient,
            clientInformacion, contribution } = this.props;
        fnShowForm(LINE_OF_BUSINESS, true);
        contextLineBusiness.onChange(entity.lineOfBusiness);
        participation.onChange(entity.participation.toString());
        experience.onChange(_.isNil(entity.experience) ? "" : entity.experience.toString());
        contribution.onChange(entity.contribution);
        this.setState({ entitySeleted: entity });
    }

    _openConfirmDelete(entity) {
        this.setState({
            entityDelete: entity,
            showConfirmDelete: true
        });
    }

    _deleteLineOfBusiness() {
        const { changeValueListClient, clientInformacion } = this.props;
        const listParticipation = clientInformacion.get('listParticipation');
        const newListPart = _.remove(listParticipation, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient('listParticipation', newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _mapValuesParitipation(entity, idx) {
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar línea de negocio" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationLineBusiness(entity)} />
            </td>
            <td>{entity.lineOfBusiness}</td>
            <td>{entity.participation} %</td>
            <td>{entity.experience}</td>
            <td>{stringValidate(entity.contribution) ? entity.contribution + "%" : entity.contribution}</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar línea de negocio" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { contextLineBusiness, participation, experience, showFormLinebusiness,
            fnShowForm, contribution, clientInformacion, changeValueListClient,
            registrationRequired, origin } = this.props;
        const listParticipation = clientInformacion.get('listParticipation');
        return (
            <div style={_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { border: "1px solid #ECECEC", borderRadius: "5px", margin: '15px 29px 0 25px' } : { width: '100%', border: "1px solid #ECECEC", borderRadius: "5px", margin: '15px 25px 0 29px' }}
                onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <dl style={{ fontSize: "20px", color: "#505050", marginBottom: "5px" }}>
                            <span className="section-title">Líneas de negocio y participación en ventas </span>
                            {origin === ORIGIN_CREDIT_STUDY &&
                                <div style={{ display: "inline" }}>
                                    (<span style={{ color: "red" }}>*</span>)
                            </div>
                            }
                            <ToolTipComponent text={MESSAGE_LINE_OF_BUSINESS}>
                                <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                    className="help circle icon blue" />
                            </ToolTipComponent>
                            <input type="checkbox" title="No aplica" style={{ cursor: "pointer", marginLeft: '15px' }}
                                onClick={() => {
                                    changeValueListClient('noAppliedLineOfBusiness', !clientInformacion.get('noAppliedLineOfBusiness'))
                                    this.clearValues();
                                }}
                                checked={clientInformacion.get('noAppliedLineOfBusiness')} /> <span style={{ fontSize: '11pt', color: 'black' }}>No aplica</span>
                        </dl>
                    </Col>
                </Row>
                {!clientInformacion.get('noAppliedLineOfBusiness') &&
                    <Row style={{ padding: "0px 10px 10px 20px" }}>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: "-42px", paddingRight: "15px", textAlign: "right" }}>
                            <button className="btn btn-secondary" disabled={showFormLinebusiness} type="button"
                                onClick={() => fnShowForm(LINE_OF_BUSINESS, true)} style={showFormLinebusiness ? { marginLeft: '5px', cursor: 'not-allowed' } : { marginLeft: '5px' }}>
                                <ToolTipComponent text="Agregar línea de negocio">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </Col>
                        {showFormLinebusiness &&
                            <Col xs={12} md={2} lg={2}>
                                <div>
                                    <dt><span>Línea de negocio (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        name="contextLineBusiness"
                                        type="text"
                                        max="50"
                                        placeholder="Línea de neogcio"
                                        {...contextLineBusiness}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
                            <Col xs={12} md={2} lg={2}>
                                <div>
                                    <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        name="participationLB"
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Participación"
                                        {...participation}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 7)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
                            <Col xs={12} md={2} lg={2}>
                                <div>
                                    <dt><span>Experiencia (años)</span></dt>
                                    <Input
                                        name="experience"
                                        type="text"
                                        min={0}
                                        max="4"
                                        placeholder="Experiencia"
                                        {...experience}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, experience, val)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
                            <Col xs={12} md={2} lg={2}>
                                <div>
                                    <dt><span>% Contribución </span></dt>
                                    <Input
                                        name="contributionLB"
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Contribución"
                                        {...contribution}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, contribution, val, false, 7)}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
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
                        {_.size(listParticipation) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '15px', marginTop: '15px' }}>
                                <table className="ui striped table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Línea de negocio</th>
                                            <th>Participación</th>
                                            <th>Experiencia (años)</th>
                                            <th>Contribución</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listParticipation.map(this._mapValuesParitipation)}
                                    </tbody>
                                </table>
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">No se han adicionado líneas de negocio</span>
                                </div>
                            </Col>
                        }
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmDelete}
                            title="Confirmar eliminación"
                            text="Señor usuario, ¿Está seguro que desea eliminar la línea de negocio?"
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({ showConfirmDelete: false })}
                            onConfirm={this._deleteLineOfBusiness} />
                    </Row >
                }
            </div>
        );
    }
}

ComponentListLineBusiness.PropTypes = {
    contextLineBusiness: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    experience: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormLinebusiness: PropTypes.bool.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListLineBusiness);