import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

class TextareaComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          value: ''
      };
  }

  render() {
      const {nameInput, style,type, placeholder, max, touched, error, name, onChange, min, defaultValue, rows} = this.props;
      return (
          <div >
              <div className={`styleWidthComponents ui input ${name}`}>
                <textarea
                  name={nameInput}
                  onChange={onChange}
                  placeholder={placeholder}
                  maxLength={max}
                  rows={rows}
                  {...this.props}
                  style={style}/>
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
    style: PropTypes.object
};

export default TextareaComponent;
