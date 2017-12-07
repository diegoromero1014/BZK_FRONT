import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './events';
import { goBack, redirectUrl } from "../globalComponents/actions";



BigCalendar.momentLocalizer(moment);

class Sheduler extends Component {

    _onExit(){
        redirectUrl("/dashboard/clients");
    }

    render() {
        
        return (
            <div {...this.props} style={{padding: '10px', background: 'white'}}>
                <BigCalendar
                    selectable
                    events={events}
                    defaultView='week'
                    culture={'es'}
                    messages={{
                    next:"Siguiente",previous:"Atrás",
                    today:"Hoy",week:"Semana",
                    month:"Mes",day:"Día",
                    agenda:"Agenda",
                    allDay:"Todo el día"

                    }}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    defaultDate={new Date(2017, 11, 4)}
                    onSelectEvent={this._onExit}
                />
            </div>
        )
    }
}

export default Sheduler