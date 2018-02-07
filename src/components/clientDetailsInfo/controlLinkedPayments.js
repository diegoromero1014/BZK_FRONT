import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';

class ControlLinkedPayments extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { infoClient } = this.props;
        const { contextClient } = infoClient;
        var controlLinkedPayments = "";
        if (!_.isNull(contextClient) && !_.isUndefined(contextClient)) {
            if (contextClient.noAppliedControlLinkedPayments) {
                controlLinkedPayments = "No aplica";
            } else {
                controlLinkedPayments = contextClient.controlLinkedPayments;
            }
        }
        return (
            <div>
                <Row style={{ marginBottom: '20px' }}>
                    <Col xs={12} md={12} lg={12} style={{ textAlign: 'justify' }}>
                        <span style={{ verticalAlign: "initial" }}>{controlLinkedPayments}</span>
                    </Col>
                </Row>
            </div>
        );
    }
}

ControlLinkedPayments.PropTypes = {
    infoClient: PropTypes.object.isRequired
}

export default ControlLinkedPayments;
