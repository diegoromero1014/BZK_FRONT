import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid';
//import ComboBox from '../../ui/comboBox/comboBoxComponent';
import ComboBox from '../clientEdit/comboBox/comboBoxComponent';
import _ from 'lodash';
import { stringValidate } from '../../actionsGlobal';
import { VALUE_REQUIERED } from '../../constantsGlobal';
import { ORIGIN_CREDIT_STUDY } from '../clients/creditStudy/constants';

class ClientTypology extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { customerTypology, data, fieldRequiered, origin } = this.props;
        return (
            <Col xs={12} md={4} lg={4}>
                <div style={{ marginTop: "10px" }}>
                    <dt>
                        <span>Tipología del cliente </span>
                        {origin === ORIGIN_CREDIT_STUDY &&
                            <div style={{ display: "inline" }}>
                                (<span style={{ color: "red" }}>*</span>)
                            </div>
                        }
                    </dt>
                    <ComboBox
                        name="customerTypology"
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'value'}
                        data={data}
                        {...customerTypology}
                        error={!stringValidate(customerTypology.value) && fieldRequiered ? VALUE_REQUIERED : ''}
                        touched={true}
                        showEmptyObject={true}
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