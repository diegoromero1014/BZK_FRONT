import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import ListDisbursementPlans from './listDisbursementPlans';

class ComponentDisbursementPlan extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ marginBottom: "30px" }}>
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
                <ListDisbursementPlans />
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
