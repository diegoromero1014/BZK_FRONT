import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import { connect } from 'react-redux';
import { saveAnswerQuestion } from './actions';
import { find, remove, uniqueId, isEqual } from 'lodash';
import { validateValueExist } from '../../../actionsGlobal';

class ComponentQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueAnswer: null,
            scoreAnswer: null
        };
        this._onChangeAnswer = this._onChangeAnswer.bind(this);
    }

    componentWillMount() {
        const { question } = this.props;
        if ( validateValueExist(question.idAnswer) ){
            this.setState({ valueAnswer: question.idAnswer });
        }
    }

    _onChangeAnswer(idAnswer) {
        const { question, qualitativeVariableReducer, saveAnswerQuestion } = this.props;
        let nameList = null;
        if( question.analyst ){
            nameList = "listQuestionsAnalyst";
        } else {
            nameList = "listQuestionsCommercial";
        }
        const questionResponse = find(qualitativeVariableReducer.get(nameList), ['id', parseInt(question.id)]);
        questionResponse.idAnswer = parseInt(idAnswer);

        const listQuestions = remove(qualitativeVariableReducer.get(nameList), (item) => !isEqual(item.id, parseInt(question.id)));
        listQuestions.push(questionResponse);
        const answer = find(question.listAnswerOption, ['id', parseInt(idAnswer)]);

        setTimeout(() => {
            this.setState({ valueAnswer: idAnswer, scoreAnswer: answer.score });
            saveAnswerQuestion(listQuestions, nameList);
        }, 300);
    }

    render() {
        const { question, qualitativeVariableReducer } = this.props;
        return (
            <Row style={{ paddingTop: "10px", paddingLeft: '10px' }}>
                <Col xs={6} md={8} lg={8}>
                    <span style={{ textAlign: "justify", wordWrap: 'break-word' }}>{question.question}</span>
                </Col>
                <Col xs={5} md={4} lg={4}>
                    <ComboBox
                        name={uniqueId('question_')}
                        labelInput="Seleccione una respuesta"
                        disabled={qualitativeVariableReducer.get('fieldsEditable') ? '' : 'disabled'}
                        defaultValue={this.state.valueAnswer}
                        value={this.state.valueAnswer}
                        onBlur={() => console.log()}
                        valueProp={'id'}
                        textProp={'answerOption'}
                        onChange={(id) => this._onChangeAnswer(id)}
                        data={question.listAnswerOption}
                    />
                </Col>
            </Row>
        );
    }
}

ComponentQuestion.PropTypes = {
    question: PropTypes.object.isRequired
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        saveAnswerQuestion
    }, dispatch);
}

function mapStateToProps({ clientInformacion, qualitativeVariableReducer }, ownerProps) {
    return {
        clientInformacion,
        qualitativeVariableReducer
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentQuestion);
