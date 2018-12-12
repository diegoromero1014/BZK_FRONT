import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery';
import _ from 'lodash';

import { nonValidateEnter } from '../../actionsGlobal';

class TextareaComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            touched: false,
            focus: false
        };

        this._onEnter = this._onEnter.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onFocus = this._onFocus.bind(this);
    }

    _onEnter(e) {
        const { nonValidateEnter, validateEnter } = this.props;
        //Solo se envia esta propiedad si qse quiere que el campo de texto no reciba enter
        var tecla = e.keyCode ? e.keyCode : e.which;
        if (validateEnter) {
            nonValidateEnter(true);
        } else {
            nonValidateEnter(false);
        }

        if (tecla === 13 && validateEnter) {
            e.preventDefault();
        }
    }

    _onBlur(e, event) {
        const { nonValidateEnter, onChange } = this.props;

        this.setState({
            touched: true,
            focus: false
        });

        let trimmed = this.state.value ? this.state.value.trim() : '';

        onChange(trimmed);
        nonValidateEnter(true);
    }

    _onFocus(e, event) {
        this.setState({ focus: true })
    }


    _onChange(e, event) {
        const { onChange, error, touched } = this.props;

        this.setState({
            value: e.target.value
        });
    }

    componentWillMount() {
        const { value } = this.props;
        this.setState({ value: value });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value != this.state.value && !this.state.focus) {
            this.setState({ value: nextProps.value });
        }
    }


    render() {
        const { nameInput, value, style, type, placeholder, max, touched, error,
            name, onChange, min, defaultValue, rows, onKey, disabled
        } = this.props;

        return (
            <div className={disabled}>
                <div className={`styleWidthComponents ui input ${name} ${disabled}`}>
                    <textarea
                        name={nameInput}
                        placeholder={placeholder}
                        maxLength={max}
                        rows={rows}
                        value={this.state.value || ''}
                        disabled={disabled}
                        style={style}
                        onChange={this._onChange}
                        onFocus={this._onFocus}
                        onBlur={this._onBlur}
                    />
                </div>
                {
                    (touched || this.state.touched) && error &&
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

TextareaComponent.PropTypes = {
    nameInput: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    min: PropTypes.string,
    defaultValue: PropTypes.string,
    style: PropTypes.object,
    error: PropTypes.string
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        nonValidateEnter
    }, dispatch);
}

function mapStateToProps({ reducerGlobal }, ownerProps) {
    return {
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextareaComponent);