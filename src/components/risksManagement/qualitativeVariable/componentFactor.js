import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import ComponentVariable from './componentVariable';
import { validateValueExist } from '../../../actionsGlobal';
import { connect } from 'react-redux';
import { size } from 'lodash';

class ComponentFactor extends Component {
    constructor(props) {
        super(props);
        this._mapVariables = this._mapVariables.bind(this);
    }

    _mapVariables(variable, idx) {
        const {analyst} = this.props;
        return <ComponentVariable variable={variable} analyst={analyst} key={idx} />;
    }

    render() {
        const { factor } = this.props;
        const listVariables = !validateValueExist(factor) || !validateValueExist(factor.listVariables) ? [] : _.get(factor, 'listVariables');
        return (
            <Row style={{marginLeft: '5px'}}>
                <Col xs={12} md={12} lg={12}>
                    <div style={{ fontSize: "15pt"}}>
                        <div className="tab-content-row" style={{ width: "99%", marginBottom: "10px" }} />
                        <span className="title-middle"> {factor.name}</span>
                    </div>
                </Col>
                {size(listVariables) > 0 ?
                    <Col xs={12} md={12} lg={12} style={{paddingRight: '40px'}}>
                        {listVariables.map(this._mapVariables)}
                    </Col>
                    :
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                            <span className="form-item">El factor no tiene variables asociadas.</span>
                        </div>
                    </Col>
                }
            </Row>
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