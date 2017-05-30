import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleBlurValueNumber, shorterStringValue } from '../../../actionsGlobal';
import { changeValueListClient } from '../../clientInformation/actions';
import { ONLY_POSITIVE_INTEGER, VALUE_REQUIERED } from '../../../constantsGlobal';
import Textarea from '../../../ui/textarea/textareaComponent';
import SweetAlert from 'sweetalert-react';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { MAIN_SUPPLIER } from '../constants';
import _ from 'lodash';

class ComponentListMainSupplier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesMainSupplier = this._mapValuesMainSupplier.bind(this);
        this._viewInformationSupplier = this._viewInformationSupplier.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteMainSupplier = this._deleteMainSupplier.bind(this);
    }

    validateInfo(e) {
        e.preventDefault();
        const { nameSupplier, participation, term, relevantInformation, fnShowForm, changeValueListClient,
            clientInformacion, swtShowMessage } = this.props;
        var countErrors = 0;
        if (_.isUndefined(nameSupplier.value) || _.isNull(nameSupplier.value) || _.isEmpty(nameSupplier.value)) {
            countErrors++;
        }
        if (_.isUndefined(participation.value) || _.isNull(participation.value) || _.isEmpty(participation.value)) {
            countErrors++;
        }
        if (_.isUndefined(term.value) || _.isNull(term.value) || _.isEmpty(term.value)) {
            countErrors++;
        }
        if (_.isUndefined(relevantInformation.value) || _.isNull(relevantInformation.value) || _.isEmpty(relevantInformation.value)) {
            countErrors++;
        }

        if (_.isEqual(countErrors, 0)) {
            var listMainSupplier = clientInformacion.get('listMainSupplier');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('mainS_'),
                    "nameSupplier": nameSupplier.value,
                    "participation": participation.value,
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
                    "participation": participation.value,
                    "term": term.value,
                    "relevantInformation": relevantInformation.value
                };
                listMainSupplier = _.remove(listMainSupplier, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listMainSupplier.push(updateValue);
            }
            changeValueListClient('listMainSupplier', listMainSupplier);
            this.clearValues();
            this.setState({ entitySeleted: null });
        } else {
            swtShowMessage('error', 'Principales proveedores', 'Señor usuario, para agregar un proveedor principal debe ingresar todos los valores.');
        }
    }

    clearValues() {
        const { nameSupplier, participation, term, relevantInformation, fnShowForm } = this.props;
        nameSupplier.onChange('');
        participation.onChange('');
        term.onChange('');
        relevantInformation.onChange('');
        fnShowForm(MAIN_SUPPLIER, false);
        this.setState({ entitySeleted: null });
    }

    _viewInformationSupplier(entity) {
        const { nameSupplier, participation, term, relevantInformation, fnShowForm, changeValueListClient, clientInformacion } = this.props;
        fnShowForm(MAIN_SUPPLIER, true);
        nameSupplier.onChange(entity.nameSupplier);
        participation.onChange(entity.participation.toString());
        term.onChange(entity.term.toString());
        relevantInformation.onChange(entity.relevantInformation.toString());
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
        const listMainSupplier = clientInformacion.get('listMainSupplier');
        const newListPart = _.remove(listMainSupplier, (item) => !_.isEqual(item.id, this.state.entityDelete.id));
        changeValueListClient('listMainSupplier', newListPart);
        this.setState({
            entityDelete: null,
            showConfirmDelete: false
        });
    }

    _mapValuesMainSupplier(entity, idx) {
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar proveedor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationSupplier(entity)} />
            </td>
            <td>{entity.nameSupplier}</td>
            <td>{entity.term}</td>
            <td>{entity.participation} %</td>
            <td>{shorterStringValue(entity.relevantInformation, 80)}</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar proveedor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { nameSupplier, participation, term, relevantInformation, showFormMainSupplier, fnShowForm, clientInformacion } = this.props;
        const listMainSupplier = clientInformacion.get('listMainSupplier');
        return (
            <div>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="shipping icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Principales proveedores</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ marginTop: "-46px", paddingRight: "35px", textAlign: "right" }}>
                        <button className="btn" disabled={showFormMainSupplier} type="button" title="Agregar proveedor principal"
                            onClick={() => fnShowForm(MAIN_SUPPLIER, true)} style={showFormMainSupplier ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                            <i className="plus white icon" style={{padding: "3px 0 0 5px"}}></i>
                        </button>
                    </Col>
                    {showFormMainSupplier &&
                        <Col xs={12} md={4} lg={3}>
                            <div>
                                <dt><span>Nombre del proveedor (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <Input
                                    name="nameSupplier"
                                    type="text"
                                    max="100"
                                    placeholder="Nombre del proveedor"
                                    {...nameSupplier}
                                    error={_.isEmpty(nameSupplier.value) ? VALUE_REQUIERED : null}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    }
                    {showFormMainSupplier &&
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
                                    value={term.value}
                                    onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, term, term.value)}
                                    error={_.isEmpty(term.value) ? VALUE_REQUIERED : null}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    }
                    {showFormMainSupplier &&
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
                    {showFormMainSupplier &&
                        <Col xs={4} md={3} lg={3}>
                            <button className="btn btn-secondary" type="button" onClick={this.validateInfo} title="Guardar"
                                style={{ cursor: 'pointer', marginTop: '20px', marginRight: '15px', marginLeft: '15px' }}>
                                <i className="plus white icon" style={{padding: "3px 0 0 5px"}}></i>
                            </button>
                            <button className="btn btn-primary" type="button" onClick={this.validateInfo} title="Cancelar" onClick={this.clearValues}
                                style={{ cursor: 'pointer', marginTop: '20px', backgroundColor: "#C1C1C1" }}>
                                <i className="remove white icon" style={{padding: "3px 0 0 5px"}}></i>
                            </button>
                        </Col>
                    }
                    {showFormMainSupplier &&
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '15px', paddingRight: '35px' }}>
                            <div>
                                <dt><span>Información relevante de los principales clientes (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <Textarea
                                    name="relevantInformation"
                                    validateEnter={true}
                                    type="text"
                                    style={{ width: '100%' }}
                                    max="1300"
                                    rows={3}
                                    placeholder="Información relevante"
                                    {...relevantInformation}
                                    error={_.isEmpty(relevantInformation.value) ? VALUE_REQUIERED : null}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    }
                    {
                        _.size(listMainSupplier) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '34px', marginTop: '15px' }}>
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
    showFormMainSupplier: PropTypes.bool.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListMainSupplier);