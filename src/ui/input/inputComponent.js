import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT } from '../../constantsGlobal';

class inputComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            focus: false
        };

        this._onChange = this._onChange.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onKey = this._onKey.bind(this);
        this._onFocus = this._onFocus.bind(this);
    }

    _onChange(e, event) {
        const { onChange, error, touched } = this.props;

        this.setState({
            value: e.target.value
        });

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.value != this.state.value) {
            this.setState({ value: nextProps.value });
        }

    }

    _onBlur(e, event) {

        const { onChange, onBlur } = this.props;

        let trimmed = this.state.value.trim();

        this.setState({
            focus: false
        })

        onChange(trimmed);
        onBlur(trimmed);
    }

    _onFocus(e) {
        const { onFocus } = this.props;

        this.setState({
            focus: true
        })

        if (onFocus) {
            onFocus(e);
        }
    }



    _onKey(e) {

        const { onChange, onBlur, onKey } = this.props;

        if ((e.keyCode === 13 || e.which === 13)) {
            let trimmed = this.state.value.trim();
            onChange(trimmed);
            onBlur(trimmed);
        }

        if (onKey) {
            onKey(e);
        }

    }



    componentWillMount() {
        const { value } = this.props;

        this.setState({ value: value });
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.value != this.state.value && ! this.state.focus) {
            this.setState({value: nextProps.value});
        }

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
                        onKeyPress={this._onKey}
                        onFocus={this._onFocus}
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
