import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import _ from "lodash";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";

class ListDisbursementPlans extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { estimatedDisburDate, listDisbursementPlans } = this.props;
        const sizeListDisbursementPlans = _.size(listDisbursementPlans);
        return (
            <div style={{ border: '1px solid #cecece', margin: "0px 10px 0px 20px", borderRadius: '3px' }}>
                <Row>
                    <Col>
                        <DateTimePickerUi
                            {...estimatedDisburDate}
                            culture='es'
                            time={false}
                            format={'MM/YYYY'}
                            initialView='year'
                        />
                    </Col>
                </Row>
                {_.size(listDisbursementPlans) > 0 ?
                    <Row style={{
                        backgroundColor: 'white', marginLeft: '10px',
                        marginRight: '10px', padding: "16px"
                    }}>
                        <Col>
                            Lista de planes
                    </Col>
                    </Row>
                    :
                    <Row center="xs" style={{ padding: "16px" }}>
                        <Col xs={12} sm={8} md={12} lg={12}>
                            <span style={{ color: '#4C5360' }}>No se han adicionado planes de desembolso</span>
                        </Col>
                    </Row>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ListDisbursementPlans);
