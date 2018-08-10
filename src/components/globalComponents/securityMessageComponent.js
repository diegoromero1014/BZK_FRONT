import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as constants from '../login/constants';
import { consultParameterServer } from '../../actionsGlobal';
import { MESSAGE_SECURITY_FORM } from '../../constantsParameters';
import { basename } from 'path';
import { bindActionCreators } from "redux";

class SecurityMessageComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            messagesecurityform: ""
        };

    }

    componentWillMount() {
        const { consultParameterServer } = this.props;        
        consultParameterServer(MESSAGE_SECURITY_FORM).then((data) => {
            if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
                data.payload.data.parameter !== undefined) {
                this.setState({
                    messagesecurityform : JSON.parse(data.payload.data.parameter).value
                })
            }
        });

    }

    render() {
        return (
            <div style={{textAlign: "center", padding: "1.7em 2em 0 2em", color: "#7f7f7f"}}>
                <span style={{fontStyle: "italic" }}>{this.state.messagesecurityform}</span>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultParameterServer
    }, dispatch)
}

function mapStateToProps(state, ownerProps) {
    return {};
  }



export default connect(mapStateToProps, mapDispatchToProps)(SecurityMessageComponent);