import React, { Component } from 'react';
import _ from 'lodash';
import { formatLongDateToDateWithNameMonthAndHour } from '../../../../actionsGlobal';

class ItemObservation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { idx, item } = this.props;
        const userName = localStorage.getItem('userNameFront').toLowerCase();
        let color = "#EFEFEF";
        let activeUser = false;
        if (item.userNameCreate.toLowerCase() == userName) {
            color = "#D7EDF4";
            activeUser = true;
        }
        return (
            <div style={{ background: color, margin: "15px", padding: "15px", borderRadius: '6px' , wordWrap: 'break-word'}}>
                <p>{item.observation}</p>
                <div style={activeUser ? { textAlign: 'right' } : {}}>
                    <span style={{ color: '#989EA0', fontStyle: 'italic', fontSize: '13px' }}>
                        {item.nameUserCreate} - {formatLongDateToDateWithNameMonthAndHour(item.createdTimestamp)}
                    </span>
                </div>
            </div >
        );
    }
}

export default ItemObservation;