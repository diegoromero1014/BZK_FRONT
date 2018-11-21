import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber, shorterStringValue, xssValidation } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import {
    ONLY_POSITIVE_INTEGER, VALUE_REQUIERED, VALUE_XSS_INVALID,
} from '../../../constantsGlobal';

import Textarea from '../../../ui/textarea/textareaComponent';
import SweetAlert from '../../sweetalertFocus';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { INT_OPERATIONS, MESSAGE_INT_OPERATIONS } from '../constants';
import { FILTER_COUNTRY } from '../../selectsComponent/constants';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { IMPORT } from '../../clientDetailsInfo/constants';
import _ from 'lodash';
import { ORIGIN_CREDIT_STUDY } from '../../clients/creditStudy/constants';

export const TYPE_OPERATION = [
    { 'id': 0, 'value': "Importación" },
    { 'id': 1, 'value': "Exportación" }
];

export const STYLE_FORM_COUNTRYS = {
    width: "100%",
    marginLeft: "8px",
    marginTop: "10px",
    marginBottom: "15px",
    border: "1px solid #ECECEC",
    marginRight: "15px",
    borderRadius: "5px",
    padding: "10px",
}

export class ComponentListIntOperations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null,
            listCountrys: [],
            updateView: false,
            errorForm: false,
            errorCountryForm: false,
            shouldUpdate: false
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesIntOperations = this._mapValuesIntOperations.bind(this);
        this._viewInformationIntOperations = this._viewInformationIntOperations.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteIntOperations = this._deleteIntOperations.bind(this);
        this.handleChangeCheck = this.handleChangeCheck.bind(this);
        this._addConstryParticipation = this._addConstryParticipation.bind(this);
        this._mapContrys = this._mapContrys.bind(this);
        this._deleteCountry = this._deleteCountry.bind(this);
        this._getTitleSection = this._getTitleSection.bind(this);
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
        const { typeOperation, participation, customerCoverage, descriptionCoverage,
            changeValueListClient, clientInformacion, swtShowMessage } = this.props;
        
        let validFields = this.hasErrors([
            typeOperation.error, participation.error,
            descriptionCoverage.error
        ])

        if (!validFields) {
            if (_.size(this.state.listCountrys) > 0) {
                var listOperations = clientInformacion.get('listOperations');
                if (_.isNull(this.state.entitySeleted)) {
                    const newValue = {
                        "id": _.uniqueId('mainIntO_'),
                        "typeOperation": typeOperation.value,
                        "participation": participation.value.replace(/,/g, ""),
                        "customerCoverage": customerCoverage.value,
                        "descriptionCoverage": descriptionCoverage.value,
                        "listCountryOperations": this.state.listCountrys
                    };
                    listOperations.push(newValue);
                } else {
                    const updateValue = {
                        "id": this.state.entitySeleted.id,
                        "typeOperation": typeOperation.value,
                        "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                        "dateCreate": this.state.entitySeleted.dateCreate,
                        "participation": participation.value.replace(/,/g, ""),
                        "customerCoverage": customerCoverage.value,
                        "descriptionCoverage": descriptionCoverage.value,
                        "listCountryOperations": this.state.listCountrys
                    };
                    listOperations = _.remove(listOperations, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                    listOperations.push(updateValue);
                }
                changeValueListClient('listOperations', listOperations);
                this.clearValues();
                this.setState({ entitySeleted: null });
            } else {
                swtShowMessage('error', 'Operaciones internacionales', 'Señor usuario, para agregar una operación internacional debe agregar por lo menos un país.');
            }
        }
        
    }

    _addConstryParticipation(e) {
        e.preventDefault();
        const { idCountry, participationCountry, selectsReducer, swtShowMessage } = this.props;
        
        let validFields = this.hasErrors([
            idCountry.error,
            participationCountry.error
        ])

        if (!validFields) {
            if (_.size(_.filter(this.state.listCountrys, ["idCountry", idCountry.value.toString()])) === 0) {
                const newCountry = {
                    "id": _.uniqueId('mainIntO_'),
                    "idCountry": idCountry.value,
                    "participation": participationCountry.value.replace(/,/g, ""),
                    "nameCountry": _.find(selectsReducer.get(FILTER_COUNTRY), ['id', parseInt(idCountry.value)]).value,
                };
                const listCountrys = this.state.listCountrys;
                listCountrys.push(newCountry);
                this.setState({ listCountrys });
                idCountry.onChange('');
                participationCountry.onChange('');
                this.setState({ errorCountryForm: false });
            } else {
                swtShowMessage('error', 'Error agregando país', 'Señor usuario, el país que quiere agregar ya se encuentra en la lista de países.');
            }
        } else {
            this.setState({errorCountryForm: true});
        }
        
    }

    clearValues() {
        const { typeOperation, participation, idCountry, customerCoverage, descriptionCoverage, fnShowForm } = this.props;
        typeOperation.onChange('');
        participation.onChange('');
        idCountry.onChange('');
        customerCoverage.onChange('');
        descriptionCoverage.onChange('');
        fnShowForm(INT_OPERATIONS, false);
        this.setState({ entitySeleted: null, listCountrys: [], errorForm: false, errorCountryForm: false });
    }

    _viewInformationIntOperations(entity) {
        const { typeOperation, participation, idCountry, customerCoverage, descriptionCoverage,
            fnShowForm, changeValueListClient, clientInformacion } = this.props;
        fnShowForm(INT_OPERATIONS, true);
        participation.onChange(entity.participation.toString());
        idCountry.onChange(entity.idCountry);
        customerCoverage.onChange(entity.customerCoverage);
        descriptionCoverage.onChange(_.isNil(entity.descriptionCoverage) ? null : entity.descriptionCoverage.toString());
        const listCountrys = entity.listCountryOperations;
        this.setState({ entitySeleted: entity, listCountrys });
        setTimeout(() => {
            //Convertir a string en caso de que se envie la opcion 0
            typeOperation.onChange(entity.typeOperation+'');
        }, 100);
    }

    _openConfirmDelete(entity) {
        this.setState({
            entityDelete: entity,
            showConfirmDelete: true
        });
    }

    _deleteIntOperations() {
        const { changeValueListClient, clientInformacion } = this.props;
        const listOperations = clientInformacion.get('listOperations');
        const newListPart = _.remove(listOperations, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient('listOperations', newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _deleteCountry(country) {
        const listCountrys = _.remove(this.state.listCountrys, (item) => !_.isEqual(item.id, country.id));
        this.setState({ listCountrys });
    }

    _mapValuesIntOperations(entity, idx) {
        const countrysValues = _.join(_.map(entity.listCountryOperations, (item) => {
            return item.nameCountry + " (" + item.participation + "%)";
        }), ' - ');
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar operación internacional" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationIntOperations(entity)} />
            </td>
            <td>{_.isEqual(parseInt(entity.typeOperation), IMPORT) ? "Importación" : "Exportación"}</td>
            <td>{entity.participation} %</td>
            <td>{countrysValues}</td>
            <td>{entity.customerCoverage ? "Si" : "No"}</td>
            <td>{shorterStringValue(entity.descriptionCoverage, 80)}</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar operación internacional" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    _mapContrys(country, idx) {
        return <tr key={idx}>
            <td>{country.nameCountry}</td>
            <td>{country.participation} %</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar país" style={{ cursor: "pointer" }}
                    onClick={() => this._deleteCountry(country)} />
            </td>
        </tr>
    }

    handleChangeCheck() {
        const { customerCoverage } = this.props;
        customerCoverage.onChange(_.isNull(customerCoverage.value) ? true : !customerCoverage.value);
    }

    _getTitleSection() {
        const { origin } = this.props;
        //Valida si el componente padre es estudio de crédito para retornar el título como una sección,
        //de lo contrario lo retorna como una subsección
        if (origin === ORIGIN_CREDIT_STUDY) {
            return <div style={{ display: "inline" }}>
                <div className="tab-content-row"
                    style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                <i className="world icon" style={{ fontSize: "25px", color: "#CEA70B" }} />
                <span className="title-middle" style={{ color: "#CEA70B" }}> Operaciones internacionales </span>
                <span style={{ color: "#CEA70B" }}>(</span>
                <span style={{ color: "red" }}>*</span>
                <span style={{ color: "#CEA70B" }}>)</span>
            </div>;
        } else {
            return <span className="section-title">Operaciones internacionales</span>;
        }
    }

    render() {
        const { typeOperation, participation, idCountry, participationCountry, customerCoverage, descriptionCoverage,
            showFormIntOperations, fnShowForm, clientInformacion, selectsReducer, changeValueListClient, origin, valueCheckSectionIntOperations,
            showCheckValidateSection, functionChangeIntOperations, registrationRequired } = this.props;
        const listOperations = clientInformacion.get('listOperations');
        return (
            <div style={!_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { border: "1px solid #ECECEC", borderRadius: "5px", margin: '0 24px 0 20px', padding: '0px 0 0 15px' } : {}}
                onBlur={() => this.setState({ shouldUpdate: !this.state.shouldUpdate })}>
                <Row style={{ padding: "10px 10px 10px 0px" }}>
                    <Col xs={12} md={12} lg={12} style={_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { padding: "20px 10px 10px 20px" } : {}}>
                        <dl style={{ fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px" }}>
                            <div style={{ fontSize: "25px", marginTop: "5px", marginBottom: "5px" }}>
                                {this._getTitleSection()}
                                <ToolTipComponent text={MESSAGE_INT_OPERATIONS}>
                                    <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                        className="help circle icon blue" />
                                </ToolTipComponent>
                                <input type="checkbox" title="No aplica" style={{ cursor: "pointer", marginLeft: '15px' }}
                                    onClick={() => {
                                        changeValueListClient('noAppliedIntOperations', !clientInformacion.get('noAppliedIntOperations'));
                                        this.clearValues();
                                    }}
                                    checked={clientInformacion.get('noAppliedIntOperations')} /> <span style={{ fontSize: '11pt', color: 'black' }}>No aplica</span>
                            </div>
                        </dl>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        {showCheckValidateSection &&
                            <div style={{ marginLeft: '20px' }}>
                                <input type="checkbox" id="checkSectionIntOperations"
                                    checked={valueCheckSectionIntOperations}
                                    onClick={functionChangeIntOperations} />
                                <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                            </div>
                        }
                    </Col>
                </Row>
                {!clientInformacion.get('noAppliedIntOperations') &&
                    <Row style={_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { border: "1px solid #ECECEC", borderRadius: "5px", margin: '0 20px 0 24px', padding: '15px 0 0 7px' } : {}}>
                        <Col xs={12} md={12} lg={12} style={_.isEqual(origin, ORIGIN_CREDIT_STUDY) ? { marginTop: "-70px", paddingRight: "16px", textAlign: "right" } : { marginTop: "-45px", paddingRight: "25px", textAlign: "right" }}>
                            <button className="btn" disabled={showFormIntOperations} type="button"
                                onClick={() => fnShowForm(INT_OPERATIONS, true)} style={showFormIntOperations ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                                <ToolTipComponent text="Agregar operación internacional">
                                    <i className="plus white icon" style={{ padding: "3px 0 0 5px" }}></i>
                                </ToolTipComponent>
                            </button>
                        </Col>
                        {showFormIntOperations &&
                            <Row style={{ width: '100%', marginLeft: '0px' }}>
                                <Col xs={12} md={3} lg={3}>
                                    <div>
                                        <dt><span>Tipo de operación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                        <ComboBox
                                            name="typeOperation"
                                            labelInput="Tipo de operación"
                                            {...typeOperation}
                                            valueProp={'id'}
                                            value={typeOperation.value}
                                            textProp={'value'}
                                            data={TYPE_OPERATION}
                                            touched={this.state.errorForm || registrationRequired}
                                        />
                                    </div>
                                </Col>
                                <Col xs={12} md={3} lg={2}>
                                    <div>
                                        <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                        <Input
                                            name="participation"
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
                                <Col xs={12} md={6} lg={3}>
                                    <div style={{ marginBottom: "10px", marginTop: '26px' }}>
                                        <label style={{ fontWeight: "bold" }}>
                                            <input type="checkbox"
                                                checked={_.isNull(customerCoverage.value) ? false : customerCoverage.value}
                                                onClick={this.handleChangeCheck} />
                                            &nbsp;&nbsp;¿El cliente tiene coberturas?
                                </label>
                                    </div>
                                </Col>
                                <Col xs={5} md={5} lg={4}>
                                    <button className="btn btn-secondary" type="button" onClick={this.validateInfo}
                                        style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                        Agregar
                                    </button>
                                    <button className="btn btn-primary" type="button" onClick={this.validateInfo} onClick={this.clearValues}
                                        style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
                                        Cancelar
                                    </button>
                                </Col>
                                <Col xs={12} md={12} lg={12} style={{ marginTop: '15px', paddingRight: '15px' }}>
                                    <div>
                                        <dt><span>Descripción de la cobertura</span></dt>
                                        <Textarea
                                            name="descriptionCoverage"
                                            validateEnter={true}
                                            type="text"
                                            style={{ width: '100%' }}
                                            max="1300"
                                            rows={3}
                                            placeholder="Descripción de la cobertura"
                                            {...descriptionCoverage}
                                            touched={this.state.errorForm || registrationRequired}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        }

                        {showFormIntOperations &&
                            <Row style={STYLE_FORM_COUNTRYS}>
                                <Col xs={12} md={3} lg={3}>
                                    <div>
                                        <dt><span>País (<span style={{ color: "red" }}>*</span>)</span></dt>
                                        <ComboBox
                                            name="idCountry"
                                            labelInput="País"
                                            {...idCountry}
                                            value={idCountry.value}
                                            onBlur={idCountry.onBlur}
                                            valueProp={'id'}
                                            textProp={'value'}
                                            data={selectsReducer.get(FILTER_COUNTRY) || []}
                                            touched={this.state.errorCountryForm}
                                        />
                                    </div>
                                </Col>
                                <Col xs={12} md={5} lg={2}>
                                    <div>
                                        <dt><span>% Participación (<span style={{ color: "red" }}>*</span>)</span></dt>
                                        <Input
                                            name="participationCountry"
                                            type="text"
                                            min={0}
                                            max="11"
                                            placeholder="Participación del país"
                                            {...participationCountry}
                                            onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, participationCountry, val, true, 7)}
                                            touched={this.state.errorCountryForm}
                                        />
                                    </div>
                                </Col>
                                <Col xs={4} md={3} lg={2}>
                                    <button className="btn btn-secondary" type="button" onClick={this._addConstryParticipation}
                                        style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                        Agregar país
                                    </button>
                                </Col>
                                {_.size(this.state.listCountrys) > 0 ?
                                    <Col xs={12} md={5} lg={5} style={{ marginTop: '5px' }}>
                                        <table className="ui striped table" style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th>País</th>
                                                    <th>Participación</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listCountrys.map(this._mapContrys)}
                                            </tbody>
                                        </table>
                                    </Col>
                                    :
                                    <Col xs={12} md={6} lg={5}>
                                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                            <span className="form-item">No se han adicionado países</span>
                                        </div>
                                    </Col>
                                }
                            </Row>
                        }

                        {
                            _.size(listOperations) > 0 ?
                                <Col xs={12} md={12} lg={12} style={{ paddingRight: '15px', marginTop: '15px', marginBottom: '15px' }}>
                                    <table className="ui striped table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Tipo de operación</th>
                                                <th>Participación</th>
                                                <th>País(es)</th>
                                                <th>¿El cliente tiene coberturas?</th>
                                                <th>Descripción de la cobertura</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listOperations.map(this._mapValuesIntOperations)}
                                        </tbody>
                                    </table>
                                </Col>
                                :
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                        <span className="form-item">No se han adicionado operaciones internacionales</span>
                                    </div>
                                </Col>
                        }
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmDelete}
                            title="Confirmar eliminación"
                            text="Señor usuario, ¿Está seguro que desea eliminar la operación?"
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({ showConfirmDelete: false })}
                            onConfirm={this._deleteIntOperations} />
                    </Row >
                }
            </div>
        );
    }
}

ComponentListIntOperations.PropTypes = {
    typeOperation: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    idCountry: PropTypes.object.isRequired,
    participationCountry: PropTypes.object.isRequired,
    customerCoverage: PropTypes.object.isRequired,
    descriptionCoverage: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormIntOperations: PropTypes.bool.isRequired,
    origin: PropTypes.string,
    valueCheckSectionIntOperations: PropTypes.bool.isRequired,
    showCheckValidateSection: PropTypes.string.isRequired,
    functionChangeIntOperations: PropTypes.func
}



export function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueListClient,
        swtShowMessage
    }, dispatch);
}

export function mapStateToProps({ clientInformacion, selectsReducer }, ownerProps) {
    return {
        clientInformacion,
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListIntOperations);