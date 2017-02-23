import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { formatDateFromDDMMYYY } from '../../../../actionsGlobal';

class InfoLastTracking extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {covenant} = this.props;
        const listTracking = covenant.get('trackingCovenant');
        const lastTracking = listTracking.length === 0 ? null : listTracking[0];
        const dateLasttracking = lastTracking === null ? "" : formatDateFromDDMMYYY(lastTracking.trackinTimestamp);
        const dateFianncialState = lastTracking === null || lastTracking.financialStateTimestamp === null? "" : formatDateFromDDMMYYY(lastTracking.financialStateTimestamp);
        return (
            <div style={{marginLeft: '7px'}}>
                <h4 style={{borderBottom: "solid 1px", marginTop: "10px"}}>Último seguimiento</h4>
                {lastTracking !== null &&
                    <Row>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Fecha de seguimiento</dt>
                            <dd style={{ minHeight: '26px' }}>{dateLasttracking}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Covenant vigente</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(lastTracking.validCovenant) ? "" : lastTracking.validCovenant}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Cumplimineto del covenant</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(lastTracking.fullfillmentCovenant) ? "" : lastTracking.fullfillmentCovenant}</dd>
                        </Col>
                        <Col xs={12} md={6} lg={4} >
                            <dt style={{ paddingTop: '5px' }}>Fecha de estados financieros</dt>
                            <dd style={{ minHeight: '26px' }}>{dateFianncialState}</dd>
                        </Col>
                        <Col xs={12} md={12} lg={8} >
                            <dt style={{ paddingTop: '5px' }}>Valor observado</dt>
                            <dd style={{ minHeight: '26px' }}>{_.isUndefined(lastTracking.observedValue) ? "" : lastTracking.observedValue}</dd>
                        </Col>
                        <Col xs={12} md={12} lg={12} >
                            <dt style={{ paddingTop: '5px' }}>Observaciones</dt>
                            <dd style={{ textAlign: 'justify' }}>{_.isUndefined(lastTracking.observations) ? "" : lastTracking.observations}</dd>
                        </Col>
                    </Row>
                }
            </div>
        );
    };
}

function mapStateToProps({covenant}) {
    return {
        covenant
    };
}

export default connect(mapStateToProps, null)(InfoLastTracking);