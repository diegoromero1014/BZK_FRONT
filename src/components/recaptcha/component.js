import React, { Component } from 'react';
import { GRECAPTCHA_PUBLIC_KEY } from '../../constantsGlobal';

export default class ReCaptcha extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <div className="g-recaptcha recaptcha" data-sitekey={GRECAPTCHA_PUBLIC_KEY}></div>
            </div>
        )
    }
}
