import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';

import ListDisbursementPlans from './listDisbursementPlans';

class ComponentDisbursementPlan extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { disbursementAmount, estimatedDisburDate, fnShowForm, showFormDisbursementPlan,
            registrationRequired, nominalValue, pendingDisbursementAmount, isEditable,
            origin } = this.props;

        return (
            <div>
                <Row style={{ padding: "10px 10px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{
                            fontSize: "25px",
                            color: "#CEA70B",
                            marginTop: "5px",
                            marginBottom: "5px"
                        }}>
                            <div className="tab-content-row" style={{
                                borderTop: "1px dotted #cea70b",
                                width: "99%",
                                marginBottom: "10px"
                            }} />
                            <i className="browser icon" style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "20px" }}> Plan de desembolsos</span>
                        </div>
                    </Col>
                </Row>
                <ListDisbursementPlans disbursementAmount={disbursementAmount}
                    showFormDisbursementPlan={showFormDisbursementPlan} isEditable={isEditable}
                    estimatedDisburDate={estimatedDisburDate} fnShowForm={fnShowForm}
                    registrationRequired={registrationRequired} nominalValue={nominalValue}
                    pendingDisbursementAmount={pendingDisbursementAmount} origin={origin}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({ }, ownerProps) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentDisbursementPlan);