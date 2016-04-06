import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import {Grid} from 'react-flexbox-grid';
import MainMenuComponent from './components/menu/component';
import LoginComponent from './components/login/Component';
import DashboardComponent from './components/Dashboard/dashboardComponent';
import SearchBar from './components/clients/SearchBar';

class App extends Component {
    render() {
        return (
            <Grid id="app" className="full-height">
                {this.props.children}
            </Grid>
        );
    }
}


export default (
    <div className="full-height">
        <Route path="/" component={App}>
            <Route path="login" component={LoginComponent}></Route>
            <Route path="dashboard" component={DashboardComponent}></Route>
            <Route path="dashboard/clients" component={SearchBar}></Route>
        </Route>
    </div>
);
