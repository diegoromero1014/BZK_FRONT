/**
 * Created by Andres Hurtado on 21/03/2017.
 */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { swtCloseMessage } from './actions';
import { connect } from 'react-redux';
import SweetAlert from 'sweetalert-react';

class SwtMessage extends Component {

    constructor(props) {
        super(props);
        this._closeMessage = this._closeMessage.bind(this);
    }

    _closeMessage() {
        this.props.swtCloseMessage();
    }

    render() {
        const {
            isShow,
            typeMessage,
            title,
            message
        } = this.props;
        return (
            <SweetAlert
                type={typeMessage}
                show={isShow}
                title={title}
                text={message}
                onConfirm={() => this._closeMessage()}
            />);
    }

}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ swtCloseMessage }, dispatch);
}

function mapStateToProps({ swtMessage }) {
    return {
        isShow: swtMessage.get('isShow'),
        typeMessage: swtMessage.get('typeMessage'),
        title: swtMessage.get('title'),
        message: swtMessage.get('message'),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SwtMessage);