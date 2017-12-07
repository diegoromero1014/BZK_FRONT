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
        this.eventStyleGetter = this.eventStyleGetter.bind(this);
        this.state = {
            event: this.props.events
        }
    }


    _onExit() {
        redirectUrl("/dashboard/clients");
    }

    eventStyleGetter() {
        const { events, start, end, isSelected } = this.props;
        console.log(events);
        var backgroundColor = '#' + '00448C';
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
                        onSelectEvent={this._onExit}
                        eventPropGetter={(this.eventStyleGetter)}
                    />
                </div>
                <Modal />
            </div>
        )

    }
}

export default Sheduler