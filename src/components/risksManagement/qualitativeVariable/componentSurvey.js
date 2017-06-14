import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ComponentFactor from './componentFactor';
import _ from 'lodash';
import { getSurveyQualitativeVarible, changeFieldsEditables, clearSurvey, saveResponseQualitativeSurvey } from './actions';
import { validatePermissionsByModule, validateValueExist, validateResponse } from '../../../actionsGlobal';
import { STYLE_BUTTON_BOTTOM, MODULE_QUALITATIVE_VARIABLES, ANALYST, EDITAR } from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { size, filter, get, indexOf, concat, isEqual } from 'lodash';
import ComponentAccordion from '../../accordion/componentAccordion';
import { OPEN_TAB, CLOSE_TAB } from '../../clientDetailsInfo/constants';
import { COMMERCIAL_SECTION, ANALYST_SECTION } from './constants';

class ComponentSurvey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openCommercial: OPEN_TAB,
            openAnalyst: OPEN_TAB
        }
        this._mapFactors = this._mapFactors.bind(this);
        this._clickSaveSurvey = this._clickSaveSurvey.bind(this);
        this._changeOpenSection = this._changeOpenSection.bind(this);
        this._clickSimulateSurvey = this._clickSimulateSurvey.bind(this);
        this._clickChangeEditableFields = this._clickChangeEditableFields.bind(this);
    }

    _changeOpenSection(type) {
        if (isEqual(type, ANALYST_SECTION)) {
            this.setState({ openCommercial: isEqual(this.state.openCommercial, CLOSE_TAB) ? OPEN_TAB : CLOSE_TAB });
        } else {
            this.setState({ openAnalyst: isEqual(this.state.openAnalyst, CLOSE_TAB) ? OPEN_TAB : CLOSE_TAB });
        }
    }

    componentWillMount() {
        const { clearSurvey, validatePermissionsByModule, getSurveyQualitativeVarible, swtShowMessage } = this.props;
        clearSurvey(false);
        validatePermissionsByModule(MODULE_QUALITATIVE_VARIABLES).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', 'Error consultando permisos', 'Señor usuario, Ocurrió un error tratando de consultar los permisos de la encuesta');
            }
        });
        getSurveyQualitativeVarible().then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', 'Error consultando encuesta', 'Señor usuario, Ocurrió un error tratando de consultar la encuesta de variables cualitativas');
            }
        });
    }

    _clickChangeEditableFields() {
        const { qualitativeVariableReducer, changeFieldsEditables } = this.props;
        changeFieldsEditables(!qualitativeVariableReducer.get('fieldsEditable'));
    }

    _mapFactors(factor, analyst, idx) {
        return <ComponentFactor key={idx} analyst={analyst} factor={factor} />
    }

    _clickSaveSurvey() {
        const { reducerGlobal, qualitativeVariableReducer, saveResponseQualitativeSurvey, swtShowMessage } = this.props;
        let filters = null;
        const analyst = get(reducerGlobal.get('permissionsQualitativeV'), indexOf(reducerGlobal.get('permissionsQualitativeV'), ANALYST), false);
        console.log('analyst', analyst);
        if (isEqual(analyst, ANALYST)) {
            filters = { 'idAnswer': null };
        } else {
            filters = { 'idAnswer': null, 'analyst': false };
        }
        const listquestions = concat(qualitativeVariableReducer.get('listQuestionsCommercial'), qualitativeVariableReducer.get('listQuestionsAnalyst'));
        const listQuestionsWithoutAnswer = filter(listquestions, filters);
        if (size(listQuestionsWithoutAnswer) > 0) {
            swtShowMessage('error', 'Error guardando encuesta', 'Señor usuario, para guardar la encuesta debe diligenciar por completo las preguntas que pertenezcan a su rol.');
        } else {
            const filterQuestions = analyst ? listquestions : filter(listquestions, ['analyst', false]);
            const jsonSave = {
                "idSurvey": get(qualitativeVariableReducer.get('survey'), 'id', null),
                "idClient": window.localStorage.getItem('idClientSelected'),
                "analyst": isEqual(analyst, ANALYST) ? true : false,
                "listQuestions": filterQuestions
            };
            saveResponseQualitativeSurvey(jsonSave).then((data) => {
                if (!validateResponse(data)) {
                    swtShowMessage('error', 'Error guardando encuesta', 'Señor usuario, Ocurrió un error tratando de guardar la encuesta');
                } else {
                    swtShowMessage('success', 'Guardar encuesta', 'Señor usuario, la encuesta de variables cualitativas se guardó exitosamente');
                }
            });
        }
    }

    _clickSimulateSurvey() {
        const { qualitativeVariableReducer, swtShowMessage } = this.props;
        const listQuestionsWithoutAnswer = filter(qualitativeVariableReducer.get('listQuestions'), ['idAnswer', null]);
        if (size(listQuestionsWithoutAnswer) > 0) {
            swtShowMessage('error', 'Error simulando encuesta', 'Señor usuario, para simular el resultado de la encuesta debe contestar todas las preguntas.');
        } else {
            swtShowMessage('warning', 'Simular encuesta', 'Señor usuario, aún no se ha desarrollado la funcionalidad de simular encuesta, ofrecemos disculpas por las molestias ocasionadas.');
            console.log('Debo simular');
        }
    }

    render() {
        const { reducerGlobal, qualitativeVariableReducer } = this.props;
        const surveyCommercial = qualitativeVariableReducer.get('surveyCommercial');
        const surveyAnalyst = qualitativeVariableReducer.get('surveyAnalyst');
        const listFactorCommercial = !validateValueExist(surveyCommercial) || !validateValueExist(surveyCommercial.listFactor) ? [] : _.get(surveyCommercial, 'listFactor');
        const listFactorAnalyst = !validateValueExist(surveyAnalyst) || !validateValueExist(surveyAnalyst.listFactor) ? [] : _.get(surveyAnalyst, 'listFactor');
        return (
            <Row>
                {size(listFactorCommercial) > 0 || size(listFactorAnalyst) > 0 ?
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ textAlign: "right", marginRight: '10px' }}>
                            <span style={{ color: "#818282", paddingRight: '10px', fontSize: '12pt' }}>{surveyCommercial.name}</span>
                            {get(reducerGlobal.get('permissionsQualitativeV'), indexOf(reducerGlobal.get('permissionsQualitativeV'), EDITAR), false) &&
                                <button type="button" onClick={this._clickChangeEditableFields} className='btn btn-sm btn-primary'>
                                    Editar <i className={'icon edit'}></i>
                                </button>
                            }
                        </div>

                        <ComponentAccordion functionChange={() => this._changeOpenSection(COMMERCIAL_SECTION)}
                            codSection={this.state.openCommercial} title="Comercial" componentView={listFactorCommercial.map((item) => this._mapFactors(item, false))} />

                        <ComponentAccordion functionChange={() => this._changeOpenSection(ANALYST_SECTION)}
                            codSection={this.state.openAnalyst} title="Analista" componentView={listFactorAnalyst.map((item) => this._mapFactors(item, true))} />


                        <div style={STYLE_BUTTON_BOTTOM}>
                            <div style={{ width: '580px', height: '100%', position: 'fixed', right: '0px' }}>
                                <button className="btn" type="buttom" onClick={this._clickSimulateSurvey}
                                    style={{ float: 'right', margin: '8px 0px 0px 330px', position: 'fixed', backgroundColor: "#00B5AD" }}>
                                    <span style={{ color: '#FFFFFF', padding: '10px' }}>Calificar</span>
                                </button>
                                <button className="btn" type="buttom" onClick={this._clickSaveSurvey}
                                    style={{ float: 'right', margin: '8px 0px 0px 450px', position: 'fixed' }}>
                                    <span style={{ color: '#FFFFFF', padding: '10px' }}>Guardar</span>
                                </button>
                            </div>
                        </div>
                    </Col>
                    :
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                            <span className="form-item">La encuesta de variables cualitativas no se encuentra configurada.</span>
                        </div>
                    </Col>
                }
            </Row>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSurveyQualitativeVarible,
        swtShowMessage,
        validatePermissionsByModule,
        clearSurvey,
        saveResponseQualitativeSurvey,
        changeFieldsEditables
    }, dispatch);
}

function mapStateToProps({ reducerGlobal, clientInformacion, qualitativeVariableReducer }, ownerProps) {
    return {
        reducerGlobal,
        clientInformacion,
        qualitativeVariableReducer
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentSurvey);