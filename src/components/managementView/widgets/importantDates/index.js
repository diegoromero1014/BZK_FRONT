import React, { Component } from 'react';
import { TITLE_IMPORTANT_DATES, TITLE_TAB_DATES, STYLE_CONTAINER_TABS } from './constants';
import TabComponent from "../../../../ui/Tab";


const tabs = [
    {
        name: TITLE_TAB_DATES,
        content: <div>Desarrollo de la HU 1338631 </div>,
        disable: false,
        number: 0,
        callback: () => {}

    },
]

class SectionImportantDates extends Component {

    render() {
        return (
            <div style={{ width: "45%", height: '100%', }}>
                <h3>{TITLE_IMPORTANT_DATES}</h3>
                <div style={STYLE_CONTAINER_TABS}>
                    <TabComponent tabs={tabs} />
                </div>
            </div >
        )
    }
}

export default SectionImportantDates;