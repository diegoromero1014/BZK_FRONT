import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { nonValidateEnter } from '../../actionsGlobal';
import SweetAlert from "sweetalert-react";
import { REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT } from '../../constantsGlobal';
import $ from 'jquery';
import _ from 'lodash';

class TextareaComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: ''
        };

        this._onEnter = this._onEnter.bind(this);
        this._onBlur = this._onBlur.bind(this);
        // this._onInvalid = this._onInvalid.bind(this);


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
        const { nonValidateEnter } = this.props;
        // console.log("REGEX_SIMPLE_XSS", REGEX_SIMPLE_XSS.test(e.target.value))
        //  this.setState({
        //     xssNotification: REGEX_SIMPLE_XSS.test(e.target.value)
        // });
        nonValidateEnter(true);
    }

    // _onInvalid(e, event) {
    //     event.preventDefault();
    //     e.target.setCustomValidity(REGEX_SIMPLE_XSS_MESAGE_SHORT);
    // }


    render() {
        const { nameInput, value, style, type, placeholder, max, touched, error, name, onChange,
            min, defaultValue, rows, onKey, disabled } = this.props;

        return (
            <div className={disabled}>
                <div className={`styleWidthComponents ui input ${name} ${disabled}`}>
                    <textarea
                        name={nameInput}
                        placeholder={placeholder}
                        maxLength={max}
                        rows={rows}
                        value={value || ''}
                        {...this.props}
                        style={style}
                        onChange={onChange}
                        onKeyPress={this._onEnter}
                        onBlur={this._onBlur}
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
