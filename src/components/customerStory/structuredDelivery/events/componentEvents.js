import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import _ from 'lodash';
import { addEvent } from './actions';
import {IMPORTANT_DATES_RELATIONSHIP} from '../constants';
import EventItem from './eventItem';
import ToolTip from '../../../toolTip/toolTipComponent';

class ComponentEvents extends Component {
    constructor(props) {
        super(props);
        this._addEvent = this._addEvent.bind(this);
        this._mapEventsItems = this._mapEventsItems.bind(this);
    }

    _addEvent() {
        const { addEvent } = this.props;
        const uuid = _.uniqueId('event_');
        addEvent(uuid);
    }

    _mapEventsItems(event) {
        const {callFromDeliveryClient} = this.props;
        return <EventItem
            index={event.uid}
            key={event.uid}
            name={event.name}
            date={event.date}
            callFromDeliveryClient={callFromDeliveryClient}
        />
    }

    componentWillMount() {
    }

    render() {
        const { structuredDeliveryEvents, structuredDelivery } = this.props;
        return (
            <div>
                <Row style={{ marginBottom: "20px", marginRight: "10px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
                            <i className="book icon" style={{ fontSize: "18px" }} />
                            <span style={{ fontSize: "20px" }}>Eventos o fechas importantes del cliente</span>
                            <ToolTip text={IMPORTANT_DATES_RELATIONSHIP}>
                                <i className="help circle icon blue" style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }}/>
                            </ToolTip>
                        </div>
                    </Col>
                </Row>
                <Row style={{ marginBottom: "20px" }}>
                    {structuredDelivery.get('eventErrors') &&
                        <div style={{marginLeft: '10px'}}>
                            <div className="ui pointing below red basic label">
                                {structuredDelivery.get('eventMessageErrors')} 
                            </div>
                        </div>
                    }
                    <Col xs={12} md={12} lg={12} style={{ marginTop: "-50px", paddingRight: "35px", textAlign: "right" }}>
                        <button className="btn" style={{ margin: "12px 0px 0px 12px", fontSize: '1.5em' }}
                            type="button" onClick={this._addEvent}>
                            <i className="plus icon" style={{ color: "white", padding: "3px 0 0 5px" }}></i>
                        </button>
                    </Col>
                </Row>
                {structuredDeliveryEvents.size > 0 ?
                    <div style={structuredDelivery.get('eventErrors') ? { paddingBottom: "20px", border: "1px solid red", borderRadius: "5px" } : {}}>
                        {structuredDeliveryEvents.map(this._mapEventsItems)}
                    </div>
                    :
                    <Row>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                <span className="form-item">Aún no se han adicionado eventos o fechas importantes</span>
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addEvent
    }, dispatch);
}

function mapStateToProps({ selectsReducer, structuredDeliveryEvents, structuredDelivery }, ownerProps) {
    return {
        selectsReducer,
        structuredDeliveryEvents,
        structuredDelivery
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentEvents);