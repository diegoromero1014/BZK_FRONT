import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CONTROL_DASHBOARD_TITLE,CONTROL_DASHBOARD_URL_PARAMETER } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { setUrlParameter } from './actions';
import {consultParameterServer} from '../../actionsGlobal';

class ControlDashboard extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined) {
            redirectUrl("/login");
        } else {
            const { consultParameterServer, updateTitleNavBar,setUrlParameter } = this.props;
            consultParameterServer(CONTROL_DASHBOARD_URL_PARAMETER).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    setUrlParameter(CONTROL_DASHBOARD_URL_PARAMETER,JSON.parse(data.payload.data.parameter).value);
                }
            });
            updateTitleNavBar(CONTROL_DASHBOARD_TITLE);
        }
    }

    render() {
        const { transactional } = this.props;
        return (<iframe style={{ "width": "100%", "height": "100%", "overflow": "scroll" }} src={transactional.get(CONTROL_DASHBOARD_URL_PARAMETER)}></iframe>)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setUrlParameter,
        updateTitleNavBar,
        consultParameterServer
    }, dispatch);
}

function mapStateToProps({ transactional }) {
    return { transactional };
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlDashboard);
