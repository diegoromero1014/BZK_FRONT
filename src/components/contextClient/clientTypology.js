import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import _ from 'lodash';

class ClientTypology extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { customerTypology, data } = this.props;
        return (
            <Col xs={12} md={4} lg={4}>
                <div style={{ marginTop: "10px" }}>
                    <dt><span>Tipología del cliente</span></dt>
                    <ComboBox
                        name="customerTypology"
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'value'}
                        data={data}
                        {...customerTypology}
                        touched={true}
                    />
                </div>
            </Col>
        );
    }
}

ClientTypology.PropTypes = {
    customerTypology: PropTypes.object.isRequired
}


export default ClientTypology;