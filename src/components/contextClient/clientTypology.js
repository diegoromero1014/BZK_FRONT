import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import _ from 'lodash';
import { stringValidate } from '../../actionsGlobal';
import { VALUE_REQUIERED } from '../../constantsGlobal';

class ClientTypology extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { customerTypology, data, fieldRequiered } = this.props;
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
                        error={!stringValidate(customerTypology.value) && fieldRequiered ? VALUE_REQUIERED : ''}
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