import React, {Component} from 'react';
import MenuComponent from '../menu/component';
import NavBarComponent from '../navBar/navBarComponent';
import moment from 'moment';
import {Row, Grid, Col} from 'react-flexbox-grid';

const dateTimeComp = () => {
    const currentDate = moment().locale('es');
    return (
        <a id="news-menu-item" className="news-menu-item menu-item" href="#dashboard/news" data-ref="news">
            <div className="today">
                <span className="today-month">{currentDate.format("MMM")}</span>
                <span className="today-date">{currentDate.format("DD")}</span>
            </div>
            <span className="today-label">Hoy</span>
        </a>
    );
};

class Dashboard extends Component {
    render() {
        return (
            <div className="main dashboard" style={{width: "100%", height: "100%"}}>
                <div id="header" className="header navbar navbar-inverse mini">
                    <NavBarComponent />
                </div>
                <div className="page-container row-fluid">
                    <MenuComponent />
                </div>
            </div>
        );
    }
}

export default Dashboard;