import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';
import ToolTipComponent from '../toolTip/toolTipComponent';
import { MESSAGE_INVENTORY_POLICE } from './constants';
import {
    VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../constantsGlobal';
import { stringValidate } from '../../actionsGlobal';

class InventorPolicy extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { inventoryPolicy, data, valueCheckSectionInventoryPolicy, clientInformacion,
            showCheckValidateSection, functionChangeInventoryPolicy } = this.props;
        return (
            <Row style={{ padding: "20px 10px 10px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                    <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                        <div className="tab-content-row"
                            style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                        <i className="cubes icon" style={{ fontSize: "25px" }} />
                        <span className="title-middle"> Política de Inventarios</span>
                        <ToolTipComponent text={MESSAGE_INVENTORY_POLICE}>
                            <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                className="help circle icon blue" />
                        </ToolTipComponent>
                    </div>
                </Col>
                <Col xs={12} md={12} lg={12}>
                    {showCheckValidateSection &&
                        <div>
                            <input type="checkbox" id="checkSectionInventoryPolicy"
                                checked={valueCheckSectionInventoryPolicy} onClick={functionChangeInventoryPolicy} />
                            <span >Aprueba que la información en esta sección se encuentra actualizada</span>
                        </div>
                    }
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
    showCheckValidateSection: PropTypes.string.isRequired,
    functionChangeInventoryPolicy: PropTypes.func
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InventorPolicy);