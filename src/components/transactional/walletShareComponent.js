import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MODULE_WALLET_SHARE_TITLE,PARAMETER_WALLET_SHARE_URL } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import { setUrlParameter } from './actions';
import {consultParameterServer} from '../../actionsGlobal';

class WalletShare extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "" || window.localStorage.getItem('sessionTokenFront') === undefined) {
            redirectUrl("/login");
        } else {
            const { consultParameterServer, updateTitleNavBar,setUrlParameter } = this.props;
            consultParameterServer(PARAMETER_WALLET_SHARE_URL).then((data) => {
                if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                    data.payload.data.parameter !== undefined) {
                    setUrlParameter(PARAMETER_WALLET_SHARE_URL,JSON.parse(data.payload.data.parameter).value);
                }
            });
            updateTitleNavBar(MODULE_WALLET_SHARE_TITLE);
        }
    }

    render() {
        const { transactional } = this.props;
        return (<iframe style={{ "width": "100%", "height": "100%", "overflow": "scroll" }} src={transactional.get(PARAMETER_WALLET_SHARE_URL)}></iframe>)
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

export default connect(mapStateToProps, mapDispatchToProps)(WalletShare);
