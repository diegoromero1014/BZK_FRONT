import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';

class InventoryPolicy extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { infoClient } = this.props;
        const { contextClient } = infoClient;
        return (
            <div>
                <Row>
                    <Col xs={12} md={12} lg={12} style={{ textAlign: 'justify' }}>
                        {_.isNull(contextClient) || _.isUndefined(contextClient) ? "" : contextClient.inventoryPolicy}
                    </Col>
                </Row>
            </div>
        );
    }
}

InventoryPolicy.PropTypes = {
    infoClient: PropTypes.object.isRequired
}

export default InventoryPolicy;