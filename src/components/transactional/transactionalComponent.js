import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';

import { SESSION_EXPIRED, MODULE_VISOR } from '../../constantsGlobal';
import * as constants from '../selectsComponent/constants';
import { MODULE_VISOR_TITLE } from './constants';

import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { getContentVisorURL } from './actions';

class Visor extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            const { validatePermissionsByModule, getContentVisorURL, updateTitleNavBar } = this.props;

            getContentVisorURL();
            updateTitleNavBar(MODULE_VISOR_TITLE);

            validatePermissionsByModule(MODULE_VISOR).then((data) => {
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                } else {
                    if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                        updateTitleNavBar("");
                        redirectUrl("/dashboard");
                    }
                }
            });

        }
    }

    render() {
        const { visorReducer } = this.props;
        return (<iframe style={{ "width": "100%", "height": "100%", "overflow": "scroll" }} src={visorReducer.get('content_visor_url')}></iframe>)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getContentVisorURL,
        validatePermissionsByModule,
        updateTitleNavBar
    }, dispatch);
}

function mapStateToProps({ visorReducer }) {
    return { visorReducer };
}

export default connect(mapStateToProps, mapDispatchToProps)(Visor);
