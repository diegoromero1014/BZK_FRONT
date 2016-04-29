import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';
import NumberInput from 'react-number-input';

class numberInputComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          value: ''
      };
  }

  render() {
      const {nameInput, format, placeholder, touched, error, onChange, min, value} = this.props;
      return (
        <div >
          <div className={`styleWidthComponents ui input`}>
            <NumberInput
              name={nameInput}
              format={format}
              min={min}
              onChange={onChange}
              placeholder={placeholder}
              value={value}
              style={{width: "100%", textAlign:"right"}}
            />
          </div>
          {!value && error &&
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

numberInputComponent.PropTypes = {
    name: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
};

export default numberInputComponent;
