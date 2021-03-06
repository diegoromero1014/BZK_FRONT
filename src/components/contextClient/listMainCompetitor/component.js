import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber, shorterStringValue, validateValueExist, checkRules } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import {
    ONLY_POSITIVE_INTEGER
} from '../../../constantsGlobal';
import Textarea from '../../../ui/textarea/textareaComponent';
import SweetAlert from '../../sweetalertFocus';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { MAIN_COMPETITOR, MESSAGE_MAIN_COMPETITOR } from '../constants';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';
import {
    checkRequired, checkClientDescription,
    checkNumberInRange, checkMaxLength, checkFirstCharacter
} from '../../../validationsFields/rulesField';

export class ComponentListMainCompetitor extends Component {
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
        this._mapValuesMainCompetitor = this._mapValuesMainCompetitor.bind(this);
        this._viewInformationCompetitor = this._viewInformationCompetitor.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteMainCompetitor = this._deleteMainCompetitor.bind(this);
        this.hasErrors = this.hasErrors.bind(this);

        this.rulesMainCompetitor = [checkRequired, checkClientDescription, checkMaxLength(50), checkFirstCharacter];
        this.rulesParticipation = [checkRequired, checkNumberInRange(0, 100)];
        this.rulesObservation = [checkClientDescription, checkFirstCharacter];

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
        const { nameCompetitor, participation, observations, changeValueListClient,
            clientInformacion } = this.props;

        let validFields = this.hasErrors([
            nameCompetitor.error, participation.error,
            observations.error
        ])

        if (!validFields) {
            var listMainCompetitor = clientInformacion.get('listMainCompetitor');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('mainCom_'),
                    "nameCompetitor": nameCompetitor.value,
                    "participation": participation.value.replace(/,/g, ""),
                    "observations": observations.value
                };
                listMainCompetitor.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "nameCompetitor": nameCompetitor.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value.replace(/,/g, ""),
                    "observations": observations.value
                };
                listMainCompetitor = _.remove(listMainCompetitor, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listMainCompetitor.push(updateValue);
            }
            changeValueListClient('listMainCompetitor', listMainCompetitor);
            this.clearValues();
            this.setState({ entitySeleted: null });
        }
    }

    clearValues() {
        const { nameCompetitor, participation, observations, fnShowForm } = this.props;
        nameCompetitor.onChange('');
        participation.onChange('');
        observations.onChange('');
        fnShowForm(MAIN_COMPETITOR, false);
        this.setState({ entitySeleted: null, errorForm: false });
    }

    _viewInformationCompetitor(entity) {
        const { nameCompetitor, participation, observations, fnShowForm } = this.props;
        fnShowForm(MAIN_COMPETITOR, true);
        nameCompetitor.onChange(entity.nameCompetitor);
        participation.onChange(entity.participation.toString());
        observations.onChange(validateValueExist(entity.observations) ? entity.observations.toString() : "");
        this.setState({ entitySeleted: entity });
    }

    _openConfirmDelete(entity) {
        this.setState({
            entityDelete: entity,
            showConfirmDelete: true
        });
    }

    _deleteMainCompetitor() {
        const { changeValueListClient, clientInformacion } = this.props;
        const listMainCompetitor = clientInformacion.get('listMainCompetitor');
        const newListPart = _.remove(listMainCompetitor, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient('listMainCompetitor', newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _mapValuesMainCompetitor(entity, idx) {

        const errorNameCompetitor = checkRules(this.rulesMainCompetitor, entity.nameCompetitor);
        const errorParticipation = checkRules(this.rulesParticipation, entity.participation);
        const errorObservation = checkRules(this.rulesObservation, entity.observations);

        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar competidor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationCompetitor(entity)} />
            </td>
            <td>{entity.nameCompetitor}
            {
                errorNameCompetitor &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorNameCompetitor}
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
            }
            </td>
            <td>{shorterStringValue(entity.observations, 100)}
            {
                errorObservation &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorObservation}
                    </div>
                </div>
            }
            </td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar competidor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { nameCompetitor, participation, observations, showFormMainCompetitor, fnShowForm,
            clientInformacion, changeValueListClient, valueCheckSectionMainCompetitor, showCheckValidateSection,
            functionChangeMainCompetitor, registrationRequired, origin, className } = this.props;
        const listMainCompetitor = clientInformacion.get('listMainCompetitor');
        return (
            <div onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="factory icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Principales competidores </span>
                            {origin === ORIGIN_CREDIT_STUDY &&
                                <div style={{ display: "inline" }}>
                                    (<span style={{ color: "red" }}>*</span>)
                            </div>
                            }
                            <ToolTipComponent text={MESSAGE_MAIN_COMPETITOR}>
                                <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                    className="help circle icon blue" />
                            </ToolTipComponent>
                            <input type="checkbox" title="No aplica" style={{ cursor: "pointer", marginLeft: '15px' }}
                                onClick={() => {
                                    changeValueListClient('noAppliedMainCompetitors', !clientInformacion.get('noAppliedMainCompetitors'))
                                    this.clearValues();
                                }}
                                checked={clientInformacion.get('noAppliedMainCompetitors')} /> <span style={{ fontSize: '11pt', color: 'black' }}>No aplica</span>
                        </div>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        {showCheckValidateSection &&
                            <div>
                                <input type="checkbox" id="checkSectionMainCompetitor"
                                    checked={valueCheckSectionMainCompetitor} onClick={functionChangeMainCompetitor} />
                                <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                            </div>
                        }
                    </Col>
                </Row>
                {!clientInformacion.get('noAppliedMainCompetitors') &&
                    <Row style={{ position:"relative", border: "1px solid #ECECEC", borderRadius: "5px", margin: '10px 24px 0px 20px', padding: '15px 0 10px 7px' }}>
                        <div style={{ position:"absolute", right:0, marginTop: "-70px", paddingRight: "16px", textAlign: "right" }}>
                            <button className="btn" name={className} disabled={showFormMainCompetitor} type="button"
                                onClick={() => fnShowForm(MAIN_COMPETITOR, true)} style={showFormMainCompetitor ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                                <ToolTipComponent text="Agregar competidor principal">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </div> {showFormMainCompetitor &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Nombre del competidor (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        max="100"
                                        placeholder="Nombre del competidor"
                                        {...nameCompetitor}
                                        name="nameMainCompetitor"
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainCompetitor &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Participación"
                                        {...participation}
                                        name="participationMComp"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 7)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainCompetitor &&
                            <Col xs={4} md={3} lg={3}>
                                <button className="btn btn-secondary" type="button" onClick={this.validateInfo}
                                    style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                    Agregar
                                </button>
                                <button className="btn btn-primary" type="button" onClick={this.clearValues}
                                    style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
                                    Cancelar
                                </button>
                            </Col>
                        }
                        {showFormMainCompetitor &&
                            <Col xs={12} md={12} lg={12} style={{ marginTop: '15px', paddingRight: '15px' }}>
                                <div>
                                    <dt><span>Observaciones</span></dt>
                                    <Textarea
                                        validateEnter={true}
                                        type="text"
                                        style={{ width: '100%' }}
                                        max="1300"
                                        rows={3}
                                        placeholder="Observaciones"
                                        {...observations}
                                        name="observationsCompetitor"
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {_.size(listMainCompetitor) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '15px', marginTop: '15px' }}>
                                <table className="ui striped table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre del competidor</th>
                                            <th>Participación</th>
                                            <th>Observaciones</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listMainCompetitor.map(this._mapValuesMainCompetitor)}
                                    </tbody>
                                </table>
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">No se han adicionado principales competidores</span>
                                </div>
                            </Col>
                        }
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmDelete}
                            title="Confirmar eliminación"
                            text="Señor usuario, ¿Está seguro que desea eliminar el competidor principal?"
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({ showConfirmDelete: false })}
                            onConfirm={this._deleteMainCompetitor} />
                    </Row >
                }
            </div>
        );
    }
}

ComponentListMainCompetitor.PropTypes = {
    nameCompetitor: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    observations: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormMainCompetitor: PropTypes.bool.isRequired,
    valueCheckSectionMainCompetitor: PropTypes.bool.isRequired,
    showCheckValidateSection: PropTypes.string.isRequired,
    functionChangeMainCompetitor: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListMainCompetitor);