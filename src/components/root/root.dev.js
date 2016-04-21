import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import DevTools from '../../components/devTools/component';

class RootComponent extends Component {
    render() {
        const {store, routes, browserHistory} = this.props;
        return (
            <Provider store={store}>
                <div>
                    <Router history={browserHistory} routes={routes}/>
                    <DevTools />
                </div>
            </Provider>
        );
    }
}

export default RootComponent;
