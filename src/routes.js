import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';

import MainMenuComponent from './components/menu/component';
import LoginComponent from './components/login/Component';

class App extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}


export default (
    <div>
        <Route path="/" component={App}>
            <Route path="login" component={LoginComponent}></Route>
            <Route path="dashboard" component={MainMenuComponent}></Route>
        </Route>
    </div>
);
