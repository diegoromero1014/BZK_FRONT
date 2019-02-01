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
import { MAIN_CLIENTS, MESSAGE_MAIN_CLIENTS, MESSAGE_RELEVANT_MAIN_CLIENTS } from '../constants';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';
import {
    checkRequired, checkClientDescription,
    checkNumberInRange, checkMaxLength, checkFirstCharacter, checkNumberLength
} from '../../../validationsFields/rulesField';

export class ComponentListMainClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null,
            errorForm: false,
            fieldReducerList: 'listMainCustomer',
            fieldReducerNoApplied: 'noAppliedMainClients',
            shouldUpdate: false
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesMainClients = this._mapValuesMainClients.bind(this);
        this._viewInformationClient = this._viewInformationClient.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteMainClients = this._deleteMainClients.bind(this);
        this.hasErrors = this.hasErrors.bind(this);

        this.rulesNameClient = [checkRequired, checkClientDescription, checkMaxLength(50), checkFirstCharacter];
        this.rulesParticipation = [checkRequired, checkNumberInRange(0, 100)];
        this.rulesTerm = [checkRequired, checkNumberInRange(0, 9999), checkNumberLength(4)];
        this.rulesRelevantInformation = [checkClientDescription, checkFirstCharacter];

    }

    componentWillMount() {
        const { nameList, nameNoApplied } = this.props;
        if (validateValueExist(nameList) && validateValueExist(nameNoApplied)) {
            this.setState({
                fieldReducerList: nameList,
                fieldReducerNoApplied: nameNoApplied
            });
        }
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
        const { nameClient, participation, term, relevantInformation, changeValueListClient,
            clientInformacion } = this.props;
    
        let validFields = this.hasErrors([
            nameClient.error, participation.error, term.error,
            relevantInformation.error
        ]);

        if (!validFields) {
            var listMainCustomer = clientInformacion.get(this.state.fieldReducerList);
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('mainC_'),
                    "nameClient": nameClient.value,
                    "participation": participation.value.replace(/,/g, ""),
                    "term": term.value,
                    "relevantInformation": relevantInformation.value
                };
                listMainCustomer.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "nameClient": nameClient.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value.replace(/,/g, ""),
                    "term": term.value,
                    "relevantInformation": relevantInformation.value
                };
                listMainCustomer = _.remove(listMainCustomer, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listMainCustomer.push(updateValue);
            }
            changeValueListClient(this.state.fieldReducerList, listMainCustomer);
            this.clearValues();
            this.setState({ entitySeleted: null });
        }
    }

    clearValues() {
        const { nameClient, participation, term, relevantInformation, fnShowForm } = this.props;
        nameClient.onChange('');
        participation.onChange('');
        term.onChange('');
        relevantInformation.onChange('');
        fnShowForm(MAIN_CLIENTS, false);
        this.setState({ entitySeleted: null, errorForm: false });
    }

    _viewInformationClient(entity) {
        const { nameClient, participation, term, relevantInformation, fnShowForm } = this.props;
        fnShowForm(MAIN_CLIENTS, true);
        nameClient.onChange(entity.nameClient);
        participation.onChange(entity.participation.toString());
        term.onChange(entity.term.toString());
        relevantInformation.onChange(validateValueExist(entity.relevantInformation) ? entity.relevantInformation.toString() : "");
        this.setState({ entitySeleted: entity });
    }

    _openConfirmDelete(entity) {
        this.setState({
            entityDelete: entity,
            showConfirmDelete: true
        });
    }

    _deleteMainClients() {
        const { changeValueListClient, clientInformacion } = this.props;
        const listMainCustomer = clientInformacion.get(this.state.fieldReducerList);
        const newListPart = _.remove(listMainCustomer, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient(this.state.fieldReducerList, newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _mapValuesMainClients(entity, idx) {

        const errorNameClient = checkRules(this.rulesNameClient, entity.nameClient);
        const errorParticipation = checkRules(this.rulesParticipation, entity.participation);
        const errorTerm = checkRules(this.rulesTerm, entity.term);
        const errorRelevantInformation = checkRules(this.rulesRelevantInformation, entity.relevantInformation);

        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar cliente principal" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationClient(entity)} />
            </td>
            <td>{entity.nameClient}
            {
                errorNameClient &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorNameClient}
                    </div>
                </div>
            }
            </td>
            <td>{entity.term}
            {
                errorTerm &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorTerm}
                    </div>
                </div>
            }</td>
            <td>{entity.participation} %
            {
                errorParticipation &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorParticipation}
                    </div>
                </div>
            }</td>
            <td>{shorterStringValue(entity.relevantInformation, 80)}
            {
                errorRelevantInformation &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorRelevantInformation}
                    </div>
                </div>
            }</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar cliente principal" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { nameClient, participation, term, relevantInformation, showFormMainClients, fnShowForm,
            clientInformacion, showCheckValidateSection, valueCheckSectionMainClients,
            functionChangeCheckSectionMainClients, changeValueListClient, registrationRequired,
            origin, className } = this.props;
        const listMainCustomer = clientInformacion.get(this.state.fieldReducerList);
        return (
            <div onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="users icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Principales clientes </span>
                            {origin === ORIGIN_CREDIT_STUDY &&
                                <div style={{ display: "inline" }}>
                                    (<span style={{ color: "red" }}>*</span>)
                            </div>
                            }
                            <ToolTipComponent text={MESSAGE_MAIN_CLIENTS}>
                                <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                    className="help circle icon blue" />
                            </ToolTipComponent>
                            <input type="checkbox" title="No aplica" style={{ cursor: "pointer", marginLeft: '15px' }}
                                onClick={() => {
                                    changeValueListClient(this.state.fieldReducerNoApplied, !clientInformacion.get(this.state.fieldReducerNoApplied))
                                    this.clearValues();
                                }}
                                checked={clientInformacion.get(this.state.fieldReducerNoApplied)} /> <span style={{ fontSize: '11pt', color: 'black' }}>No aplica</span>
                        </div>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        {showCheckValidateSection &&
                            <div>
                                <input type="checkbox" id="checkSectionMainClients"
                                    checked={valueCheckSectionMainClients}
                                    onClick={functionChangeCheckSectionMainClients} />
                                <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                            </div>
                        }
                    </Col>
                </Row>
                {!clientInformacion.get(this.state.fieldReducerNoApplied) &&
                    <Row style={{ border: "1px solid #ECECEC", borderRadius: "5px", margin: '10px 24px 0px 20px', padding: '15px 0 10px 7px' }}>
                        <Col xs={12} md={12} lg={12} style={{ marginTop: "-70px", paddingRight: "16px", textAlign: "right" }}>
                            <button className="btn" name={className} disabled={showFormMainClients} type="button"
                                onClick={() => fnShowForm(MAIN_CLIENTS, true)} style={showFormMainClients ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                                <ToolTipComponent text="Agregar cliente principal">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </Col>
                        {showFormMainClients &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Nombre del cliente (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        max="100"
                                        placeholder="Nombre del cliente"
                                        {...nameClient}                                        
                                        name="nameMainClient"
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainClients &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Plazo (días) (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        min={0}
                                        max="4"
                                        placeholder="Plazo"
                                        {...term}
                                        name="termMainClient"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, term, val)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainClients &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Participación"
                                        {...participation}
                                        name="participationMC"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 7)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainClients &&
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
                        {showFormMainClients &&
                            <Col xs={12} md={12} lg={12} style={{ marginTop: '15px', paddingRight: '15px' }}>
                                <div>
                                    <dt><span>Información relevante de los principales clientes</span>
                                        <ToolTipComponent text={MESSAGE_RELEVANT_MAIN_CLIENTS}>
                                            <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                                className="help circle icon blue" />
                                        </ToolTipComponent>
                                    </dt>
                                    <Textarea
                                        validateEnter={true}
                                        type="text"
                                        style={{ width: '100%' }}
                                        max="1300"
                                        rows={3}
                                        placeholder="Información relevante"
                                        {...relevantInformation}
                                        name="relevantInformationMainClient"
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {_.size(listMainCustomer) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '15px', marginTop: '15px' }}>
                                <table className="ui striped table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre del cliente</th>
                                            <th>Plazo (días)</th>
                                            <th>Participación</th>
                                            <th>Información relevante</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listMainCustomer.map(this._mapValuesMainClients)}
                                    </tbody>
                                </table>
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">No se han adicionado principales clientes</span>
                                </div>
                            </Col>
                        }
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmDelete}
                            title="Confirmar eliminación"
                            text="Señor usuario, ¿Está seguro que desea eliminar el cliente principal?"
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({ showConfirmDelete: false })}
                            onConfirm={this._deleteMainClients} />
                    </Row >
                }
            </div>
        );
    }
}

ComponentListMainClients.PropTypes = {
    nameClient: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    relevantInformation: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormMainClients: PropTypes.bool.isRequired,
    valueCheckSectionMainClients: PropTypes.bool.isRequired,
    showCheckValidateSection: PropTypes.string.isRequired,
    functionChangeCheckSectionMainClients: PropTypes.func,
    nameList: PropTypes.string,
    nameNoApplied: PropTypes.string
}

export function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueListClient,
        swtShowMessage
    }, dispatch);
}

export function mapStateToProps({ clientInformacion, form }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListMainClients);
