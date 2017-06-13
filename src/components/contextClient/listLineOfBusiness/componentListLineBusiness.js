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
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { LINE_OF_BUSINESS, MESSAGE_LINE_OF_BUSINESS } from '../constants';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';

class ComponentListLineBusiness extends Component {
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
        this._mapValuesParitipation = this._mapValuesParitipation.bind(this);
        this._viewInformationLineBusiness = this._viewInformationLineBusiness.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteLineOfBusiness = this._deleteLineOfBusiness.bind(this);
    }

    validateInfo(e) {
        e.preventDefault();
        const { contextLineBusiness, participation, experience, fnShowForm, changeValueListClient,
            clientInformacion, swtShowMessage } = this.props;
        var countErrors = 0;
        if (_.isUndefined(contextLineBusiness.value) || _.isNull(contextLineBusiness.value) || _.isEmpty(contextLineBusiness.value)) {
            countErrors++;
        }
        if (_.isUndefined(participation.value) || _.isNull(participation.value) || _.isEmpty(participation.value)) {
            countErrors++;
        }

        if (_.isEqual(countErrors, 0)) {
            var listParticipation = clientInformacion.get('listParticipation');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('line_'),
                    "lineOfBusiness": contextLineBusiness.value,
                    "participation": participation.value,
                    "experience": experience.value
                };
                listParticipation.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "lineOfBusiness": contextLineBusiness.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value,
                    "experience": experience.value
                };
                listParticipation = _.remove(listParticipation, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listParticipation.push(updateValue);
            }
            changeValueListClient('listParticipation', listParticipation);
            this.clearValues();
            this.setState({ entitySeleted: null });
        } else {
            this.setState({ errorForm: true });
            swtShowMessage('error', 'Líneas de negocios', 'Señor usuario, para agregar una línea de negocio debe ingresar todos los valores.');
        }
    }

    clearValues() {
        const { contextLineBusiness, participation, experience, fnShowForm } = this.props;
        contextLineBusiness.onChange('');
        participation.onChange('');
        experience.onChange('');
        fnShowForm(LINE_OF_BUSINESS, false);
        this.setState({ entitySeleted: null, errorForm: false });
    }

    _viewInformationLineBusiness(entity) {
        const { contextLineBusiness, participation, experience, fnShowForm, changeValueListClient, clientInformacion } = this.props;
        fnShowForm(LINE_OF_BUSINESS, true);
        contextLineBusiness.onChange(entity.lineOfBusiness);
        participation.onChange(entity.participation.toString());
        experience.onChange(entity.experience.toString());
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
            <td className="collapsing">
                <i className="trash icon" title="Eliminar línea de negocio" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { contextLineBusiness, participation, experience, showFormLinebusiness, fnShowForm,
            clientInformacion, changeValueListClient, registrationRequired, origin } = this.props;
        const listParticipation = clientInformacion.get('listParticipation');
        return (
            <div style={{ width: '100%' }}>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <dl style={{ fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px" }}>
                            <span className="section-title">Líneas de negocio y participación en ventas </span>
                            {origin === ORIGIN_CREDIT_STUDY &&
                                <div style={{ display: "inline" }}>
                                    (<span style={{ color: "red" }}>*</span>)
                            </div>
                            }
                            <ToolTipComponent text={MESSAGE_LINE_OF_BUSINESS}
                                children={
                                    <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                        className="help circle icon blue" />
                                }
                            />
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
                        <Col xs={12} md={12} lg={12} style={{ marginTop: "-42px", paddingRight: "35px", textAlign: "right" }}>
                            <button className="btn btn-secondary" disabled={showFormLinebusiness} type="button" title="Agregar línea de negocio"
                                onClick={() => fnShowForm(LINE_OF_BUSINESS, true)} style={showFormLinebusiness ? { marginLeft: '5px', cursor: 'not-allowed' } : { marginLeft: '5px' }}>
                                <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                            </button>
                        </Col>
                        {showFormLinebusiness &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Línea de negocio (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        name="contextLineBusiness"
                                        type="text"
                                        max="100"
                                        placeholder="Línea de neogcio"
                                        {...contextLineBusiness}
                                        error={_.isEmpty(contextLineBusiness.value) ? VALUE_REQUIERED : null}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
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
                                        value={participation.value}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, participation.value, true, 2)}
                                        error={_.isEmpty(participation.value) ? VALUE_REQUIERED : null}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Experiencia (años)</span></dt>
                                    <Input
                                        name="experience"
                                        type="text"
                                        min={0}
                                        max="3"
                                        placeholder="Experiencia"
                                        {...experience}
                                        value={experience.value}
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, experience, experience.value)}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormLinebusiness &&
                            <Col xs={4} md={3} lg={3}>
                                <button className="btn btn-secondary" type="button" onClick={this.validateInfo} title="Guardar"
                                    style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </button>
                                <button className="btn btn-primary" type="button" onClick={this.validateInfo} title="Cancelar" onClick={this.clearValues}
                                    style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
                                    <i className="remove white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </button>
                            </Col>
                        }
                        {
                            _.size(listParticipation) > 0 ?
                                <Col xs={12} md={12} lg={12} style={{ paddingRight: '34px', marginTop: '15px' }}>
                                    <table className="ui striped table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Línea de negocio</th>
                                                <th>Participación</th>
                                                <th>Experiencia (años)</th>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListLineBusiness);