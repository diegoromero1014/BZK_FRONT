import React, { Component } from 'react';
import { GRECAPTCHA_PUBLIC_KEY } from '../../constantsGlobal';
import Recaptcha from 'react-recaptcha';

export default class ReCaptcha extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <Recaptcha sitekey={GRECAPTCHA_PUBLIC_KEY}/>
            </div>
        )
    }
}
