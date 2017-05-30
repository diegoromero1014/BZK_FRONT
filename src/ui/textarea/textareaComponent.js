import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {nonValidateEnter} from '../../actionsGlobal';
import $ from 'jquery';
import _ from 'lodash';

class TextareaComponent extends Component {
  constructor(props) {
      super(props);
      this._onEnter = this._onEnter.bind(this);
      this._onBlur = this._onBlur.bind(this);
      this.state = {
          value: ''
      };
  }

  _onEnter(e){
    const {nonValidateEnter, validateEnter} = this.props;
    //Solo se envia esta propiedad si qse quiere que el campo de texto no reciba enter
    var tecla = e.keyCode ? e.keyCode : e.which;
    if( validateEnter ){
      nonValidateEnter(true);
    } else {
      nonValidateEnter(false);
    }
    if(tecla === 13 && validateEnter){
        e.preventDefault();
    }
  }

  _onBlur(){
    const {nonValidateEnter} = this.props;
    nonValidateEnter(true);
  }

  render() {
      const {nameInput,value, style,type, placeholder, max, touched, error, name, onChange,
        min, defaultValue, rows,onKey, disabled} = this.props;
      return (
          <div className={disabled}>
              <div className={`styleWidthComponents ui input ${name} ${disabled}` }>
                <textarea
                  name={nameInput}
                  onChange={onChange}
                  onKeyPress={this._onEnter}
                  onBlur={this._onBlur}
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
    style: PropTypes.object,
    error: PropTypes.string
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    nonValidateEnter
  }, dispatch);
}

function mapStateToProps({reducerGlobal}, ownerProps){
    return {
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TextareaComponent);
