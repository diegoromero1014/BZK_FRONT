import React, { Component } from 'react';
import { TITLE_IMPORTANT_DATES,
     TITLE_TAB_DATES, 
     STYLE_CONTAINER_TABS,
     TITLE_STRATEGIC_CONTACTS,
     TITLE_TACTIC_CONTACTS,
     TITLE_OPERATIVE_CONTACTS } from './constants';
import TabComponent from "../../../../ui/Tab";
import '../../../../../styles/importantDates/main.scss';


const tabs = [
    {
        name: TITLE_TAB_DATES,
        className: 'mainImportantDates'

    },
]

const subTabs = [
    {
        name: TITLE_STRATEGIC_CONTACTS,
        className: 'importantDatesStyle',
        content: <div>Contáctos estratégicos</div>,
        disable: false,
        number: 0,
        callback: () => {}

    },
    {
        name: TITLE_TACTIC_CONTACTS,
        className: 'importantDatesStyle',
        content: <div>Contáctos tácticos</div>,
        disable: false,
        number: 0,
        callback: () => {}

    },
    {
        name: TITLE_OPERATIVE_CONTACTS,
        className: 'importantDatesStyle',
        content: <div>Contáctos operativos</div>,
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
                        <TabComponent tabs={subTabs} />
                </div>
            </div >
        )
    }
}

export default SectionImportantDates;