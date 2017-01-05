import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

class inputComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          value: ''
      };
      this._onChange = this._onChange.bind(this);
  }

  _onChange(e, event){
    const {onChange} = this.props;
    this.setState({
      value: e.target.value
    });
    onChange(e.target.value, e);
  }

  render() {
      const {nameInput, type, style, placeholder, disabled, onKey, touched, error, name, onBlur, onChange, min, max, defaultValue, value, onFocus, shouldHandleUpdate} = this.props;
      if( touched && error  && shouldHandleUpdate){
        $(`.ui.input.${name} [type=text]`).focus();
      }
      return (
          <div>
              <div className={`styleWidthComponents ui input ${disabled} ${name}`}>
                  <input type={type}
                    name={nameInput}
                    min={min}
                    maxLength={max}
                    style={style}
                    onChange={this._onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    onBlur={onBlur}
                    onKeyPress={onKey}
                    onFocus={onFocus}
                    value={value || ''} />
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
