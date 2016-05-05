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

  _onChange(e){
    const {onChange} = this.props;
    this.setState({
      value: e.target.value
    });
    onChange(e.target.value);
  }

  render() {
      const {nameInput, type, placeholder, disabled, touched, error, name, onChange, min, max, defaultValue, value} = this.props;
      if( touched && error ){
        $(`.ui.input.${name} [type=text]`).focus();
      }
      return (
          <div>
              <div className={`styleWidthComponents ui input ${disabled} ${name}`}>
                  <input type={type}
                    name={nameInput}
                    min={min}
                    max={max}
                    onChange={this._onChange}
                    placeholder={placeholder}
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
