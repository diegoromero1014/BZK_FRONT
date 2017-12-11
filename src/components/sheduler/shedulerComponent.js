import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './events';
import Modal from 'react-modal';
import { goBack, redirectUrl } from "../globalComponents/actions";



BigCalendar.momentLocalizer(moment);


class Sheduler extends Component {
    constructor(props) {
        super(props)
        this.state={
            modalIsOpen: false
        }
        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }


    _onExit() {
        redirectUrl("/dashboard/clients");
    }

    eventStyleGetter() {
        const { events, start, end, isSelected } = this.props;
        console.log(events);
        var backgroundColor = '#' + '000000';
        var color = '#' + 'fff'
        var style = {
            backgroundColor: backgroundColor,
            opacity: 0.8,
            color: color,
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {

        return (
            <div>
                <div style={{ padding: '10px', background: 'white' }}>
                    <BigCalendar
                        {...this.props}
                        selectable
                        events={events}
                        defaultView='week'
                        culture={'es'}
                        messages={{
                            next: "Siguiente", previous: "Atrás",
                            today: "Hoy", week: "Semana",
                            month: "Mes", day: "Día",
                            agenda: "Agenda",
                            allDay: "Todo el día"

                        }}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date(2017, 11, 4)}
                        onSelectEvent={this.openModal}
                        eventPropGetter={events => ({className: events.isGrant? 'cls-blue': 'cls-red' })}
                    />
                </div>
                <Modal isOpen={this.state.modalIsOpen} contentLabel="Previsitas" onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Célula</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
/**
 * lugar donde va el cuepo del modal
 */


                        </div>
                    </div>
                </Modal>
            </div>
        )

    }
}

export default Sheduler