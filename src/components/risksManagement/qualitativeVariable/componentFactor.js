import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import ComponentVariable from './componentVariable';
import { validateValueExist } from '../../../actionsGlobal';
import { connect } from 'react-redux';
import { size, filter, map, concat } from 'lodash';

class ComponentFactor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listVariables: [],
            listQuestions: []
        };
        this._mapVariables = this._mapVariables.bind(this);
    }

    _mapVariables(variable, idx) {
        const { analyst } = this.props;
        return <ComponentVariable variable={variable} analyst={analyst} key={idx} />;
    }

    componentWillMount() {
        const { factor, analyst } = this.props;
        const listVariables = !validateValueExist(factor) || !validateValueExist(factor.listVariables) ? [] : _.get(factor, 'listVariables');
        let listQuestions = [];
        //Valido si el factor tiene preguntas de la sección donde esta, para saber si lo pinto o no
        map(listVariables, (variable) => {
            listQuestions = concat(listQuestions, filter(variable.listQuestion, ['analyst', analyst]));
        });
        this.setState({ listVariables, listQuestions });
    }

    render() {
        const { factor } = this.props;
        return (
            <div>
                {size(this.state.listQuestions) > 0 &&
                    <Row style={{ marginLeft: '5px' }}>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ fontSize: "15pt" }}>
                                <div className="tab-content-row" style={{ width: "99%", marginBottom: "10px" }} />
                                <span className="title-middle"> {factor.name}</span>
                            </div>
                        </Col>
                        {size(this.state.listVariables) > 0 ?
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: '40px' }}>
                                {this.state.listVariables.map(this._mapVariables)}
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">El factor no tiene variables asociadas.</span>
                                </div>
                            </Col>
                        }
                    </Row>
                }
            </div>

        );
    }
}

ComponentFactor.PropTypes = {
    factor: PropTypes.object.isRequired
}

function mapStateToProps({ clientInformacion, qualitativeVariableReducer }, ownerProps) {
    return {
        clientInformacion,
        qualitativeVariableReducer
    }
}

export default connect(mapStateToProps, null)(ComponentFactor);