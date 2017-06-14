import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import ToolTipComponent from '../../toolTip/toolTipComponent';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ComponentQuestion from './componentQuestion';
import { validateValueExist } from '../../../actionsGlobal';
import { size } from 'lodash';

class ComponentVariable extends Component {
    constructor(props) {
        super(props);
        this._mapQuestion = this._mapQuestion.bind(this);
    }

    _mapQuestion(question, idx) {
        const { analyst } = this.props;
        if ((analyst && question.analyst) || (!analyst && !question.analyst)) {
            return <ComponentQuestion question={question} key={idx} />
        }
        return null;
    }

    render() {
        const { variable } = this.props;
        const listQuestions = !validateValueExist(variable) || !validateValueExist(variable.listQuestion) ? [] : variable.listQuestion;
        return (
            <Row style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: '20px' }}>
                <Col xs={12} md={12} lg={12} style={{ borderBottom: "1px solid #505050" }}>
                    <span className="section-title" style={{ fontSize: "13pt", color: "#505050", marginTop: "5px", marginBottom: "5px" }}>
                        {variable.name}
                    </span>
                    <ToolTipComponent text={variable.description}
                        children={
                            <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                className="help circle icon blue" />
                        }
                    />
                </Col>
                {size(listQuestions) > 0 ?
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: '23px' }}>
                        {listQuestions.map(this._mapQuestion)}
                    </Col>
                    :
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                            <span className="form-item">La variable no tiene preguntas asociadas.</span>
                        </div>
                    </Col>
                }
            </Row>
        );
    }
}

ComponentVariable.PropTypes = {
    variable: PropTypes.object.isRequired
}

function mapStateToProps({ clientInformacion, qualitativeVariableReducer }, ownerProps) {
    return {
        clientInformacion,
        qualitativeVariableReducer
    }
}

export default connect(mapStateToProps)(ComponentVariable);