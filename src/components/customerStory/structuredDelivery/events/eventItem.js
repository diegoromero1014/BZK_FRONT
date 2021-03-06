import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import DateTimePickerUi from '../../../../ui/dateTimePicker/dateTimePickerComponent';
import Input from '../../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { deleteEvent, updateEvent } from './actions';
import { updateEventErrors } from '../actions';
import SweetAlert from '../../../sweetalertFocus';
import { connect } from 'react-redux';
import _ from 'lodash';

class EventItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            date: '',
            typeMessage: 'warning',
            showConfirm: false,
            titleMessage: 'Confirmar eliminación',
            message: 'Señor usuario, ¿esta seguro de eliminar el evento o fecha importante?'
        };
        this._deleteEvent = this._deleteEvent.bind(this);
    }

    _updateValue(prop, value) {
        const { updateEvent, index, structuredDeliveryEvents, updateEventErrors } = this.props;
        this.setState(_.set({}, prop, value));
        updateEvent(index, prop, value);
        // updateEventErrors(false);
        // structuredDeliveryEvents.map(map => {
        //     if (_.isEqual(map.name, "") || _.isEqual(map.date, "")) {
        //         updateEventErrors(true);
        //     }
        // });
    }

    _deleteEvent() {
        const { index, deleteEvent } = this.props;
        this.setState({
            showConfirm: false
        });
        deleteEvent(index);
        const { structuredDeliveryEvents, updateEventErrors } = this.props;
        const arrayValues = _.remove(structuredDeliveryEvents.toArray(), (event) => event.uid !== index);
        const errosName = _.filter(arrayValues, { "name": "" });
        const errosDate = _.filter(arrayValues, { "date": "" });
        
        if (_.size(errosName) > 0 || _.size(errosDate) > 0) {
            updateEventErrors(true, errosName[0] ? errosName[0] : errosDate[0]);
        } else {
            updateEventErrors(false);
        }
    }

    componentWillMount() {
        const { name, date } = this.props;
        this.setState({
            name: name,
            date: date
        });
    }

    render() {
        const { index, callFromDeliveryClient } = this.props;
        return (
            <Row key={index}>
                <Col xs={10} md={8} lg={8} style={{ marginTop: "15px" }}>
                    <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                        <dt><span>Nombre (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <Input
                            type="text"
                            style={{ height: "22px !important", minHeight: "26px !important", width: "100%" }}
                            value={this.state.name}
                            max={50}
                            onChange={this._updateValue.bind(this, 'name')}
                        />
                    </div>
                </Col>
                <Col xs={12} md={3} lg={3} style={{ marginTop: "15px" }}>
                    <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                        <dt><span>Fecha - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)</dt>
                        <DateTimePickerUi
                            culture='es'
                            format={"DD/MM/YYYY"}
                            time={false}
                            value={this.state.date}
                            onChange={this._updateValue.bind(this, 'date')}
                        />
                    </div>
                </Col>
                <Col xs={1} md={1} lg={1} style={callFromDeliveryClient ? { marginTop: "54px" } : { marginTop: "37px" }}>
                    <button onClick={() => this.setState({ showConfirm: true })}
                        className="btn btn-sm  btn-danger"
                        type="button">
                        <i style={{ margin: '0em', fontSize: '1.2em' }} className="trash icon"></i>
                    </button>
                </Col>
                <SweetAlert
                    type={this.state.typeMessage}
                    show={this.state.showConfirm}
                    title={this.state.titleMessage}
                    text={this.state.message}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onConfirm={this._deleteEvent}
                    onCancel={() => this.setState({ showConfirm: false })}
                />
            </Row>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteEvent,
        updateEvent,
        updateEventErrors
    }, dispatch);
}


function mapStateToProps({ structuredDeliveryEvents }) {
    return { structuredDeliveryEvents };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventItem);
