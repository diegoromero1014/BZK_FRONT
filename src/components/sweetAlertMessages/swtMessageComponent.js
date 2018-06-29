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
        this._onCancel = this._onCancel.bind(this);
    }

    _closeMessage() {
        const {customProps} = this.props;
        this.props.swtCloseMessage();

        if (typeof customProps !== 'undefined') {
            if (typeof customProps.onConfirmCallback === "function") {
                customProps.onConfirmCallback();
            }
        }

    }

    _onCancel() {
        const {customProps} = this.props;
        this.props.swtCloseMessage();

        if (typeof customProps !== 'undefined') {
            if (typeof customProps.onCancelCallback === "function") {
                customProps.onCancelCallback();
            }
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        let isShow = this.props.isShow;

        let button;

        if (isShow) {
            button = document.getElementsByClassName('confirm');

            if (button.length > 0) {
                
                setTimeout(function(){ button[0].focus(); }, 1);
                button[0].focus();
            }
        }

    }

    render() {
        const {
            isShow,
            typeMessage,
            title,
            message,
            onConfirmCallback,
            customProps,
            options
        } = this.props;

        return (
            <SweetAlert
                type={typeMessage}
                show={isShow}
                title={title}
                text={message}
                {...options}
                showCancelButton={typeof customProps !== 'undefined' && typeof customProps.onCancelCallback === "function"}
                onConfirm={() => {this._closeMessage()}}
                onCancel={() => {this._onCancel()}}
                
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
        options: swtMessage.get('props'),
        customProps: swtMessage.get('customProps')
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SwtMessage);