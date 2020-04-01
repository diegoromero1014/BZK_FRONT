import React, { Component } from 'react';
import {
    ECONOMIC_GROUP,
    PENDING_VIEWS
} from "./constants";

export class VisitComponent extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div class="ui segment alert-content" style={{ padding: '0px !important' }}>
                <h3>VISITAS</h3>
                <div style={{
                    position: 'relative',
                    background: '#FFFFFF',

                    boxShadow: '0px 1px 2px 0 rgba(34, 36, 38, 0.15)',
                    margin: '1rem 0em',
                    padding: '0px !important',
                    borderRadius: '0.28571429rem',
                    border: '1px solid rgba(34, 36, 38, 0.15)'
                }}>
                    <TabComponent tabs={tabs} />
                </div>

            </div >
        );
    }
}

export default connect(VisitComponent);