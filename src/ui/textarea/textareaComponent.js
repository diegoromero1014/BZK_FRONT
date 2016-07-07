import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import _ from 'lodash';

class TextareaComponent extends Component {
  constructor(props) {
      super(props);
      this._onEnter = this._onEnter.bind();
      this.state = {
          value: ''
      };
  }

  _onEnter(e){
  var tecla = e.keyCode ? e.keyCode : e.which;
//  var patron = /[A-Za-zñÑ0-9'"!?¡¿()#%$áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛÑñäëïöüÄËÏÖÜ\s\t]/; // 4
  var te = String.fromCharCode(tecla);
//!patron.test(te)
  if(tecla == 13){
      e.preventDefault();
    }
  }

  render() {
      const {nameInput,value, style,type, placeholder, max, touched, error, name, onChange, min, defaultValue, rows,onKey} = this.props;
      return (
          <div >
              <div className={`styleWidthComponents ui input ${name}`}>
                <textarea
                  name={nameInput}
                  onChange={onChange}
                  onKeyPress={this._onEnter}
                  placeholder={placeholder}
                  maxLength={max}
                  rows={rows}
                  value={value || ''}
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
