import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Textarea from '../../ui/textarea/textareaComponent';
import _ from 'lodash';
import ToolTipComponent from '../toolTip/toolTipComponent';
import { MESSAGE_CONTROL_LINKED_PAYMENTS } from './constants';
import { changeValueListClient } from '../clientInformation/actions';
import {
    VALUE_REQUIERED, VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT
} from '../../constantsGlobal';
import { stringValidate, xssValidation } from '../../actionsGlobal';

class ControlLinkedPayments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldReducerNoApplied: 'noAppliedControlLinkedPayments'
        }
        this._onChangeControlLinkedPayments = this._onChangeControlLinkedPayments.bind(this);
    }

    _onChangeControlLinkedPayments() {
        const { changeValueListClient, controlLinkedPayments, clientInformacion } = this.props;
        changeValueListClient(this.state.fieldReducerNoApplied, !clientInformacion.get(this.state.fieldReducerNoApplied));
        controlLinkedPayments.onChange(controlLinkedPayments.value);
    }

    render() {
        const { data, clientInformacion, controlLinkedPayments, controlLinkedPaymentsRequired } = this.props;
        return (
            <Row style={{ padding: "20px 10px 10px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                    <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                        <div className="tab-content-row"
                            style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                        <i className="building icon" style={{ fontSize: "25px" }} />
                        <span className="title-middle"> Control para pagos entre vinculadas y cambios de control</span>
                        {controlLinkedPaymentsRequired && <span> (<span style={{ color: "red" }}>*</span>)</span>}
                        <ToolTipComponent text={MESSAGE_CONTROL_LINKED_PAYMENTS}>
                            <i style={{ marginLeft: "5px", cursor: "pointer", fontSize: "16px" }}
                                className="help circle icon blue" />
                        </ToolTipComponent>
                        <input type="checkbox" title="No aplica" style={{ cursor: "pointer", marginLeft: '15px' }}
                        onClick={this._onChangeControlLinkedPayments}
                        checked={clientInformacion.get(this.state.fieldReducerNoApplied)} />
                    <span style={{ fontSize: '11pt', color: 'black', marginLeft: "5px" }}>No aplica</span>
                    </div>

                    

                    {!clientInformacion.get(this.state.fieldReducerNoApplied) &&
                        <Textarea
                            name="controlLinkedPayments"
                            validateEnter={true}
                            type="text"
                            style={{ width: '100%' }}
                            max="1000"
                            rows={7}
                            placeholder="Ingrese el control de pagos entre vinculadas y cambios de control"
                            {...controlLinkedPayments}
                            error={!stringValidate(controlLinkedPayments.value) && controlLinkedPaymentsRequired ? VALUE_REQUIERED : (xssValidation(controlLinkedPayments.value) ? VALUE_XSS_INVALID : '')}
                            touched={true}
                        />
                    }
                </Col>
            </Row>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeValueListClient
    }, dispatch);
}

function mapStateToProps({ clientInformacion }, ownerProps) {
    return {
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlLinkedPayments);