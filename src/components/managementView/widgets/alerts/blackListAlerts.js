import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { blackListAlerts } from '../../../alertBlackList/actions';

class BlackListAlerts extends Component {

    render() {
        return (
            <div>
                HOLA
            </div>
        );
    }
}

const mapStateToProps = ({ }) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchBlackListAlerts: blackListAlerts
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BlackListAlerts);