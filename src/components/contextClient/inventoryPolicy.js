import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';
import { ORIGIN_STUDY_CREDIT } from './constants';

class InventorPolicy extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { inventoryPolicy, data, valueCheckSectionInventoryPolicy, origin, functionChangeInventoryPolicy } = this.props;
        return (
            <Row style={{ padding: "20px 10px 10px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                    <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                        <div className="tab-content-row"
                            style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                        {origin === ORIGIN_STUDY_CREDIT &&
                            <input type="checkbox" id="checkSectionInventoryPolicy" style={{ marginRight: "10px" }}
                                checked={valueCheckSectionInventoryPolicy} onClick={functionChangeInventoryPolicy} />
                        }
                        <i className="cubes icon" style={{ fontSize: "25px" }} />
                        <span className="title-middle"> Política de Inventarios</span>
                    </div>
                </Col>
                <Col xs={12} md={12} lg={12}>
                    <div style={{ marginTop: "15px", marginRight: '20px' }}>
                        <Textarea
                            name="inventoryPolicy"
                            validateEnter={true}
                            type="text"
                            style={{ width: '100%' }}
                            max="1200"
                            rows={7}
                            placeholder="Ingrese las políticas de inventario"
                            {...inventoryPolicy}
                            touched={true}
                        />
                    </div>
                </Col>
            </Row>
        );
    }
}

InventorPolicy.PropTypes = {
    inventoryPolicy: PropTypes.object.isRequired,
    valueCheckSectionInventoryPolicy: PropTypes.bool.isRequired,
    origin: PropTypes.string.isRequired,
    functionChangeInventoryPolicy: PropTypes.func
}


export default InventorPolicy;