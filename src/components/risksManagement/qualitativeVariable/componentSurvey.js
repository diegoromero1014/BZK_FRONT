import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ComponentFactor from './componentFactor';
import _ from 'lodash';
import { getSurveyQualitativeVarible } from './actions';
import { validateValueExist, validateResponse } from '../../../actionsGlobal';
import { STYLE_BUTTON_BOTTOM } from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { size, filter } from 'lodash';

class ComponentSurvey extends Component {
    constructor(props) {
        super(props);
        this._mapFactors = this._mapFactors.bind(this);
        this._clickSaveSurvey = this._clickSaveSurvey.bind(this);
    }

    componentWillMount() {
        const { getSurveyQualitativeVarible, swtShowMessage } = this.props;
        getSurveyQualitativeVarible().then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', 'Error consultando encuesta', 'Señor usuario, Ocurrió un error tratando de consultar la encuesta de variables cualitativas');
            }
        });
    }

    _mapFactors(factor, idx) {
        return <ComponentFactor key={idx} factor={factor} />
    }

    _clickSaveSurvey() {
        const { qualitativeVariableReducer, swtShowMessage } = this.props;
        let filters = null;
        if( filters !== null ){
            filters = {'idAnswer': null};
        } else {
            filters = {'idAnswer': null, 'analyst': false};
        }
        const listQuestionsWithoutAnswer = filter(qualitativeVariableReducer.get('listQuestions'), filters);
        if( size(listQuestionsWithoutAnswer) > 0 ){
            swtShowMessage('error', 'Error guardando encuesta', 'Señor usuario, para guardar la encuesta debe diligenciar por completo las preguntas que pertenezcan a su rol.');
        } else {
            console.log('Tegno que guardar');
        }

    }

    render() {
        const { qualitativeVariableReducer } = this.props;
        const survey = qualitativeVariableReducer.get('survey');
        const listFactor = !validateValueExist(survey) || !validateValueExist(survey.listFactor) ? [] : _.get(survey, 'listFactor');
        return (
            <Row>
                {size(listFactor) > 0 ?
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ textAlign: "right", marginRight: '10px' }}>
                            <span style={{ color: "#818282" }}>{survey.name}</span>
                        </div>
                        {listFactor.map(this._mapFactors)}
                        <div style={STYLE_BUTTON_BOTTOM}>
                            <div style={{ width: '580px', height: '100%', position: 'fixed', right: '0px' }}>
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
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ clientInformacion, qualitativeVariableReducer }, ownerProps) {
    return {
        clientInformacion,
        qualitativeVariableReducer
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentSurvey);