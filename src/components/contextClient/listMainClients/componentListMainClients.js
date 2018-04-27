import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber, shorterStringValue, validateValueExist, xssValidation } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import {
    ONLY_POSITIVE_INTEGER, VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../../constantsGlobal';
import Textarea from '../../../ui/textarea/textareaComponent';
import SweetAlert from '../../sweetalertFocus';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { MAIN_CLIENTS, MESSAGE_MAIN_CLIENTS, MESSAGE_RELEVANT_MAIN_CLIENTS } from '../constants';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';

class ComponentListMainClients extends Component {
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
        this.fieldValidation = this.fieldValidation.bind(this);
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


    fieldValidation(fields) {
        const { swtShowMessage } = this.props;

        let message_error = "";
        for (var _field_i in fields) {
            var _field = fields[_field_i];

            if (_field.required && (_.isUndefined(_field.value) || _.isNull(_field.value) || _.isEmpty(_field.value))) {
                message_error = 'Señor usuario, para agregar un cliente principal debe ingresar todos los valores.';
                break;
            } if (_field.xss && xssValidation(_field.value)) {
                message_error = REGEX_SIMPLE_XSS_MESAGE;
                break;
            }
        }

        if (message_error) {
            this.setState({ errorForm: true });
            swtShowMessage('error', 'Principales clientes', message_error);
        }
        return _.isEmpty(message_error);
    }

    validateInfo(e) {
        e.preventDefault();
        const { nameClient, participation, term, relevantInformation, fnShowForm, changeValueListClient,
            clientInformacion, swtShowMessage } = this.props;
        var countErrors = 0;


        // if (_.isEqual(countErrors, 0)) {
        let validFields = this.fieldValidation([
            { required: true, value: nameClient.value, xss: true },
            { required: true, value: participation.value, xss: true },
            { required: true, value: term.value, xss: true },
            { required: false, value: relevantInformation.value, xss: true }
        ])

        if (validFields) {
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
        // else {
        //     this.setState({ errorForm: true });
        //     swtShowMessage('error', 'Principales clientes', 'Señor usuario, para agregar un cliente principal debe ingresar todos los valores.');
        // }
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
        const { nameClient, participation, term, relevantInformation, fnShowForm, changeValueListClient, clientInformacion } = this.props;
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
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar cliente principal" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationClient(entity)} />
            </td>
            <td>{entity.nameClient}</td>
            <td>{entity.term}</td>
            <td>{entity.participation} %</td>
            <td>{shorterStringValue(entity.relevantInformation, 80)}</td>
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
            origin } = this.props;
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
                            <button className="btn" disabled={showFormMainClients} type="button"
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
                                        name="nameClient"
                                        type="text"
                                        max="100"
                                        placeholder="Nombre del cliente"
                                        {...nameClient}                                        
                                        error={_.isEmpty(nameClient.value) ? VALUE_REQUIERED : (xssValidation(nameClient.value) ? VALUE_XSS_INVALID : null)}
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
                                        name="term"
                                        type="text"
                                        min={0}
                                        max="3"
                                        placeholder="Plazo"
                                        {...term}                                        
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, term, val)}
                                        error={_.isEmpty(term.value) ? VALUE_REQUIERED : (xssValidation(term.value) ? VALUE_XSS_INVALID : null)}
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
                                        name="participation"
                                        type="text"
                                        min={0}
                                        max="5"
                                        placeholder="Participación"
                                        {...participation}                                        
                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participation, val, true, 2)}
                                        error={_.isEmpty(participation.value) ? VALUE_REQUIERED : (xssValidation(participation.value) ? VALUE_XSS_INVALID : null)}
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
                                        name="relevantInformation"
                                        validateEnter={true}
                                        type="text"
                                        style={{ width: '100%' }}
                                        max="1300"
                                        rows={3}
                                        placeholder="Información relevante"
                                        {...relevantInformation}                                        
                                        error={xssValidation(relevantInformation.value) ? VALUE_XSS_INVALID : null}
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueListClient,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ clientInformacion, form }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListMainClients);
