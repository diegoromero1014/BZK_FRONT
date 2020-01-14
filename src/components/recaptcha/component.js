import React, { Component } from 'react';
import { GRECAPTCHA_PUBLIC_KEY } from '../../constantsGlobal';
import ReCAPTCHA from 'react-google-recaptcha';


export default class ReCaptcha extends Component {

    constructor(props){
        super(props);
        this.handleCaptchaResponseChange = this.handleCaptchaResponseChange.bind(this);
    }

    handleCaptchaResponseChange(response) {
        this.props._getValueRecaptcha(response);
    }

    render() {
        return (
            <ReCAPTCHA
                sitekey={GRECAPTCHA_PUBLIC_KEY}
                onChange={this.handleCaptchaResponseChange}
                grecaptcha={window.grecaptcha}
            />
        )
    }
}
