import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

class inputComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          value: ''
      };
  }

  render() {
      const {nameInput, type, placeholder, touched, error, name, onChange} = this.props;
      return (
          <div >
              <div className={`styleWidthCompoentns ui input ${name}`}>
                  <input type={type} name={nameInput} onChange={onChange} placeholder={placeholder} />
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
    type: PropTypes.string.isRequired
};

export default inputComponent;
