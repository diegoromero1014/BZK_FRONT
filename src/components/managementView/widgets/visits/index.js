import React, { Component } from 'react';
import { connect } from "react-redux";
import TabComponent from "../../../../ui/Tab";
import {
    ECONOMIC_GROUP_TAB,
    PENDING_VIEWS_TAB
} from "./constants";

export class VisitComponent extends Component {

    countVistis = () =>{
        const tabs = [
            {
                name: ECONOMIC_GROUP_TAB,
                content,
                number,
                callback
            },
            {
                name: PENDING_VIEWS_TAB,
                content,
                number,
                callback
            }
        ];
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
    render() {
        return this.countVistis();
    }
}

export default VisitComponent;