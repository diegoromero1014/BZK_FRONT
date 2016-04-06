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
            <div style={{width: "100%", height: "100%", position: "absolute"}}>
                <div style={{float: "left", width: "15%", height: "100%"}} >
                    <MenuComponent />
                </div>
                <div className="header" style={{paddingLeft: "15%", height: "100%", float: "left", width: "85% !important"}}>
                    <NavBarComponent />
                    <div style={{backgroundColor: "gray", height: "100%", width: "100% !important", float: "left", top: "60px"}}>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;