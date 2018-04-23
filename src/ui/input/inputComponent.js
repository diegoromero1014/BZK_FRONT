import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import SweetAlert from "sweetalert-react";
import { REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT } from '../../constantsGlobal';

class inputComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };

        this._onChange = this._onChange.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }

    _onChange(e, event) {
        const { onChange, error, touched } = this.props;
        console.log("changin",e.target.value);
        this.setState({
            value: e.target.value
        });

    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.value != this.state.value) {
            this.setState({value: nextProps.value});
        }

    }

    _onBlur(e, event) {

        const { onChange, onBlur } = this.props;

        onChange(this.state.value);
        onBlur(this.state.value);
    }

    // _onBlur(e, event) {
    //     const { onBlur } = this.props;
    //     this.setState({
    //         xssNotification: REGEX_SIMPLE_XSS.test(e.target.value),
    //         value: e.target.value
    //     });

    //     onBlur(e, event);
    // }

    // _onInvalid(e, event) {
    //     event.preventDefault();
    //     e.target.setCustomValidity(REGEX_SIMPLE_XSS_MESAGE_SHORT);
    // }

    componentWillMount() {
        const {value} = this.props;

        this.setState({value: value});
    }

    render() {
        const { nameInput, type, style, placeholder, disabled, onKey, touched, error, name, onBlur, onChange, min, max, defaultValue, value, onFocus, shouldHandleUpdate } = this.props;

        if (touched && error && shouldHandleUpdate) {
            $(`.ui.input.${name} [type=text]`).focus();
        }
        return (
            <div className={disabled}>
                <div className={`styleWidthComponents ui input ${name}`}>
                    <input type={type}
                        name={nameInput}
                        min={min}
                        maxLength={max}
                        style={style}
                        onChange={this._onChange}
                        placeholder={placeholder}
                        onBlur={this._onBlur}
                        disabled={disabled}
                        className={disabled}
                        onKeyPress={onKey}
                        onFocus={onFocus}
                        value={this.state.value || ''}
                    />
                </div>
                {
                    touched && error &&
                    <div>
                        <div className="ui pointing red basic label">
                            {error}
                        </div>
                    </div>
                }

            </div>
        );
    }
}

inputComponent.PropTypes = {
    nameInput: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    min: PropTypes.string
};

export default inputComponent;
