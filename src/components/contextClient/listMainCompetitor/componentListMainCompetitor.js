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
import { MAIN_COMPETITOR } from '../constants';
import _ from 'lodash';

class ComponentListMainCompetitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            entityDelete: null,
            entitySeleted: null
        }
        this.validateInfo = this.validateInfo.bind(this);
        this.clearValues = this.clearValues.bind(this);
        this._mapValuesMainCompetitor = this._mapValuesMainCompetitor.bind(this);
        this._viewInformationCompetitor = this._viewInformationCompetitor.bind(this);
        this._openConfirmDelete = this._openConfirmDelete.bind(this);
        this._deleteMainCompetitor = this._deleteMainCompetitor.bind(this);
    }

    validateInfo(e) {
        e.preventDefault();
        const { nameCompetitor, participation, term, observations, fnShowForm, changeValueListClient,
            clientInformacion, swtShowMessage } = this.props;
        var countErrors = 0;
        if (_.isUndefined(nameCompetitor.value) || _.isNull(nameCompetitor.value) || _.isEmpty(nameCompetitor.value)) {
            countErrors++;
        }
        if (_.isUndefined(participation.value) || _.isNull(participation.value) || _.isEmpty(participation.value)) {
            countErrors++;
        }
        if (_.isUndefined(observations.value) || _.isNull(observations.value) || _.isEmpty(observations.value)) {
            countErrors++;
        }

        if (_.isEqual(countErrors, 0)) {
            var listMainCompetitor = clientInformacion.get('listMainCompetitor');
            if (_.isNull(this.state.entitySeleted)) {
                const newValue = {
                    "id": _.uniqueId('mainCom_'),
                    "nameCompetitor": nameCompetitor.value,
                    "participation": participation.value,
                    "observations": observations.value
                };
                listMainCompetitor.push(newValue);
            } else {
                const updateValue = {
                    "id": this.state.entitySeleted.id,
                    "nameCompetitor": nameCompetitor.value,
                    "idCreatedUser": this.state.entitySeleted.idCreatedUser,
                    "dateCreate": this.state.entitySeleted.dateCreate,
                    "participation": participation.value,
                    "observations": observations.value
                };
                listMainCompetitor = _.remove(listMainCompetitor, (item) => !_.isEqual(item.id, this.state.entitySeleted.id));
                listMainCompetitor.push(updateValue);
            }
            changeValueListClient('listMainCompetitor', listMainCompetitor);
            this.clearValues();
            this.setState({ entitySeleted: null });
        } else {
            swtShowMessage('error', 'Principales competidores', 'Señor usuario, para agregar un competidor principal debe de ingresar todos los valores.');
        }
    }

    clearValues() {
        const { nameCompetitor, participation, observations, fnShowForm } = this.props;
        nameCompetitor.onChange('');
        participation.onChange('');
        observations.onChange('');
        fnShowForm(MAIN_COMPETITOR, false);
        this.setState({ entitySeleted: null });
    }

    _viewInformationCompetitor(entity) {
        const { nameCompetitor, participation, observations, fnShowForm, changeValueListClient, clientInformacion } = this.props;
        fnShowForm(MAIN_COMPETITOR, true);
        nameCompetitor.onChange(entity.nameCompetitor);
        participation.onChange(entity.participation.toString());
        observations.onChange(entity.observations.toString());
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
        return <tr key={idx}>
            <td className="collapsing">
                <i className="zoom icon" title="Editar competidor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._viewInformationCompetitor(entity)} />
            </td>
            <td>{entity.nameCompetitor}</td>
            <td style={{ textAlign: 'center' }}>{entity.participation} %</td>
            <td style={{ textAlign: 'center' }}>{shorterStringValue(entity.observations, 100)}</td>
            <td className="collapsing">
                <i className="trash icon" title="Eliminar competidor principal" style={{ cursor: "pointer" }}
                    onClick={() => this._openConfirmDelete(entity)} />
            </td>
        </tr>
    }

    render() {
        const { nameCompetitor, participation, observations, showFormMainCompetitor, fnShowForm, clientInformacion } = this.props;
        const listMainCompetitor = clientInformacion.get('listMainCompetitor');
        return (
            <div>
                <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="factory icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Principales competidores</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ marginTop: "-46px", paddingRight: "35px", textAlign: "right" }}>
                        <button className="btn" disabled={showFormMainCompetitor} type="button" title="Agregar competidor principal"
                            onClick={() => fnShowForm(MAIN_COMPETITOR, true)} style={showFormMainCompetitor ? { marginLeft: '10px', cursor: 'not-allowed' } : { marginLeft: '10px' }}>
                            <i className="plus white icon"></i>
                        </button>
                    </Col>
                    {showFormMainCompetitor &&
                        <Col xs={12} md={4} lg={3}>
                            <div>
                                <dt><span>Nombre del competidor (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <Input
                                    name="nameCompetitor"
                                    type="text"
                                    max="100"
                                    placeholder="Nombre del competidor"
                                    {...nameCompetitor}
                                    error={_.isEmpty(nameCompetitor.value) ? VALUE_REQUIERED : null}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    }
                    {showFormMainCompetitor &&
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
                    {showFormMainCompetitor &&
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
                    {showFormMainCompetitor &&
                        <Col xs={12} md={12} lg={12} style={{ marginTop: '15px', paddingRight: '35px' }}>
                            <div>
                                <dt><span>Observaciones (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <Textarea
                                    name="observations"
                                    validateEnter={true}
                                    type="text"
                                    style={{ width: '100%' }}
                                    max="1300"
                                    rows={3}
                                    placeholder="Observaciones"
                                    {...observations}
                                    error={_.isEmpty(observations.value) ? VALUE_REQUIERED : null}
                                    touched={true}
                                />
                            </div>
                        </Col>
                    }
                    {
                        _.size(listMainCompetitor) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '34px', marginTop: '15px' }}>
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
                                    <span className="form-item">No se han adicionado principales proveedores</span>
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
                        onConfirm={this._deleteMainClients} />
                </Row >
            </div>
        );
    }
}

ComponentListMainCompetitor.PropTypes = {
    nameCompetitor: PropTypes.object.isRequired,
    participation: PropTypes.object.isRequired,
    observations: PropTypes.object.isRequired,
    fnShowForm: PropTypes.func.isRequired,
    showFormMainCompetitor: PropTypes.bool.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentListMainCompetitor);