import React, { Component } from 'react';
import {GOOGLE_SITE_KEY} from './constants';

export default class ReCaptcha extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <div className="g-recaptcha recaptcha" data-sitekey={GOOGLE_SITE_KEY}></div>
            </div>
        )
    }
}
