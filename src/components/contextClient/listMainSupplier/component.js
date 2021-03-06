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
import { MAIN_SUPPLIER, MESSAGE_MAIN_SUPPLIER, MESSAGE_RELEVANT_MAIN_SUPPLIERS } from '../constants';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';
import {
    checkRequired, checkNumberLength, checkClientDescription,
    checkNumberInRange, checkMaxLength, checkFirstCharacter
} from '../../../validationsFields/rulesField';

export class ComponentListMainSupplier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null,
            errorForm: false,
            fieldReducerList: 'listMainSupplier',
            fieldReducerNoApplied: 'noAppliedMainSuppliers',
            shouldUpdate: false
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesMainSupplier = this._mapValuesMainSupplier.bind(this);
        this._viewInformationSupplier = this._viewInformationSupplier.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteMainSupplier = this._deleteMainSupplier.bind(this);
        this.hasErrors = this.hasErrors.bind(this);

        this.rulesNameSupplier = [checkRequired, checkClientDescription, checkMaxLength(50), checkFirstCharacter];
        this.rulesParticipation = [checkRequired, checkNumberInRange(0, 100)];
        this.rulesTerm = [checkRequired, checkNumberInRange(0, 9999), checkNumberLength(4)];
        this.relevantInformation = [checkClientDescription, checkFirstCharacter];

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
        const { nameSupplier, participation, term, relevantInformation, changeValueListClient,
            clientInformacion } = this.props;
        
        let validFields = this.hasErrors([
            nameSupplier.error, participation.error,
            term.error, relevantInformation.error
        ])

        if (!validFields) {
            var listMainSupplier = clientInformacion.get(this.state.fieldReducerList);
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('mainS_'),
                    "nameSupplier": nameSupplier.value,
                    "participation": participation.value.replace(/,/g, ""),
                    "term": term.value,
                    "relevantInformation": relevantInformation.value
                };
                listMainSupplier.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "nameSupplier": nameSupplier.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value.replace(/,/g, ""),
                    "term": term.value,
                    "relevantInformation": relevantInformation.value
                };
                listMainSupplier = _.remove(listMainSupplier, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listMainSupplier.push(updateValue);
            }
            changeValueListClient(this.state.fieldReducerList, listMainSupplier);
            this.clearValues();
            this.setState({ entitySeleted: null });
        } 
    }

    clearValues() {
        const { nameSupplier, participation, term, relevantInformation, fnShowForm } = this.props;
        nameSupplier.onChange('');
        participation.onChange('');
        term.onChange('');
        relevantInformation.onChange('');
        fnShowForm(MAIN_SUPPLIER, false);
        this.setState({ entitySeleted: null, errorForm: false });
    }

    _viewInformationSupplier(entity) {
        const { nameSupplier, participation, term, relevantInformation, fnShowForm } = this.props;
        fnShowForm(MAIN_SUPPLIER, true);
        nameSupplier.onChange(entity.nameSupplier);
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

    _deleteMainSupplier() {
        const { changeValueListClient, clientInformacion } = this.props;
        const listMainSupplier = clientInformacion.get(this.state.fieldReducerList);
        const newListPart = _.remove(listMainSupplier, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient(this.state.fieldReducerList, newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _mapValuesMainSupplier(entity, idx) {

        const errorNameSupplier = checkRules(this.rulesNameSupplier, entity.nameSupplier);
        const errorTerm = checkRules(this.rulesTerm, entity.term);
        const errorParticipation = checkRules(this.rulesParticipation, entity.participation);

        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar proveedor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationSupplier(entity)} />
            </td>
            <td>{entity.nameSupplier}
            {
                errorNameSupplier &&
                <div>
                    <div className="ui pointing red basic label">
                        {errorNameSupplier}
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
            <td>{shorterStringValue(entity.relevantInformation, 80)}</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar proveedor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { nameSupplier, participation, term, relevantInformation, showFormMainSupplier, fnShowForm,
            clientInformacion, changeValueListClient, valueCheckSectionMainSupplier, showCheckValidateSection,
            functionChangeMainSupplier, registrationRequired, origin, className } = this.props;
        const listMainSupplier = clientInformacion.get(this.state.fieldReducerList);
        return (
            <div onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="shipping icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Principales proveedores </span>
                            {origin === ORIGIN_CREDIT_STUDY &&
                                <div style={{ display: "inline" }}>
                                    (<span style={{ color: "red" }}>*</span>)
                            </div>
                            }
                            <ToolTipComponent text={MESSAGE_MAIN_SUPPLIER}>
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
                                <input type="checkbox" id="checkSectionMainSupplier"
                                    checked={valueCheckSectionMainSupplier} onClick={functionChangeMainSupplier} />
                                <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                            </div>
                        }
                    </Col>
                </Row>
                {!clientInformacion.get(this.state.fieldReducerNoApplied) &&
                    <Row style={{ position:"relative", border: "1px solid #ECECEC", borderRadius: "5px", margin: '10px 24px 0px 20px', padding: '15px 0 10px 7px' }}>
                        <div style={{ position:"absolute", right:0, marginTop: "-70px", paddingRight: "16px", textAlign: "right" }}>
                            <button className="btn" name={className} disabled={showFormMainSupplier} type="button"
                                onClick={() => fnShowForm(MAIN_SUPPLIER, true)} style={showFormMainSupplier ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                                <ToolTipComponent text="Agregar proveedor principal">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </div>
                        {showFormMainSupplier &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Nombre del proveedor (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        max="100"
                                        placeholder="Nombre del proveedor"
                                        {...nameSupplier}                                        
                                        name="nameMainSupplier"
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainSupplier &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>Plazo (días) (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        min={0}
                                        max="4"
                                        placeholder="Plazo"
                                        {...term}
                                        name="termMainSupplier"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, term, val)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainSupplier &&
                            <Col xs={12} md={4} lg={3}>
                                <div>
                                    <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                    <Input
                                        type="text"
                                        min={0}
                                        max="11"
                                        placeholder="Participación"
                                        {...participation}
                                        name="participationMS"
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 7)}
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {showFormMainSupplier &&
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
                        {showFormMainSupplier &&
                            <Col xs={12} md={12} lg={12} style={{ marginTop: '15px', paddingRight: '15px' }}>
                                <div>
                                    <dt><span>Información relevante de los principales proveedores</span>
                                        <ToolTipComponent text={MESSAGE_RELEVANT_MAIN_SUPPLIERS}>
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
                                        name="relevantInformationMainSupplier"
                                        touched={this.state.errorForm || registrationRequired}
                                    />
                                </div>
                            </Col>
                        }
                        {_.size(listMainSupplier) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '15px', marginTop: '15px' }}>
                                <table className="ui striped table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Nombre del proveedor</th>
                                            <th>Plazo (días)</th>
                                            <th>Participación</th>
                                            <th>Información relevante</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listMainSupplier.map(this._mapValuesMainSupplier)}
                                    </tbody>
                                </table>
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">No se han adicionado principales proveedores</span>
                                </div>
                            </Col>
                        }
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmDelete}
                            title="Confirmar eliminación"
                            text="Señor usuario, ¿Está seguro que desea eliminar el proveedor principal?"
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({ showConfirmDelete: false })}
                            onConfirm={this._deleteMainSupplier} />
                    </Row >
                }
            </div>
        );
    }
}

ComponentListMainSupplier.PropTypes = {
    nameSupplier: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    term: PropTypes.object.isRequired,
    relevantInformation: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormMainSupplier: PropTypes.bool.isRequired,
    valueCheckSectionMainSupplier: PropTypes.bool.isRequired,
    showCheckValidateSection: PropTypes.string.isRequired,
    functionChangeMainSupplier: PropTypes.func,
    nameList: PropTypes.string,
    nameNoApplied: PropTypes.string
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListMainSupplier);