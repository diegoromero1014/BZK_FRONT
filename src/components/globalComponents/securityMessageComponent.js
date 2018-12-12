import React, { Component } from 'react';
import { connect } from 'react-redux';
import { consultParameterServer, setSecurityMessage } from '../../actionsGlobal';
import { MESSAGE_SECURITY_FORM } from '../../constantsGlobal';
import { bindActionCreators } from "redux";

import _ from 'lodash';

export class SecurityMessageComponent extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { consultParameterServer, setSecurityMessage, securityMessage } = this.props;
        if (_.isEmpty(securityMessage)) {
            consultParameterServer(MESSAGE_SECURITY_FORM).then((data) => {
                if (_.isObject(data.payload) && !_.isUndefined(data.payload.data)) {
                    const response = JSON.parse(data.payload.data.parameter);
                    const message = !_.isUndefined(response.value) ? response.value : '';
                    setSecurityMessage(message);
                }
            });
        }
    }

    render() {
        return (
            <div style={{ textAlign: "center", padding: "1.2em 2em 0 2em", color: "#7f7f7f" }}>
                <span style={{ fontStyle: "italic" }}>{this.props.securityMessage}</span>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultParameterServer,
        setSecurityMessage
    }, dispatch)
}

function mapStateToProps({ reducerGlobal }, ownerProps) {
    const securityMessage = reducerGlobal.get('securityMessage');
    return {
        securityMessage
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityMessageComponent);