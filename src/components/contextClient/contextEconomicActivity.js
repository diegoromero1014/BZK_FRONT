import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';

class ContextEconomicActivity extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { contextClientField, data } = this.props;
        return (
            <Col xs={12} md={12} lg={12}>
                <div style={{ marginTop: "15px", marginLeft: '20px', marginRight: '20px' }}>
                    <dt><span>Contexto</span></dt>
                    <Textarea
                        name="contextClientField"
                        validateEnter={true}
                        type="text"
                        style={{ width: '100%' }}
                        max="5000"
                        rows={7}
                        placeholder="Ingrese el contexto de cliente"
                        {...contextClientField}
                        touched={true}
                    />
                </div>
            </Col>
        );
    }
}

ContextEconomicActivity.PropTypes = {
    contextClientField: PropTypes.object.isRequired
}


export default ContextEconomicActivity;