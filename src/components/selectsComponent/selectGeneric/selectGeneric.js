import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Combobox } from 'react-widgets';

class ComponentTypeDocument extends Component{
  render(){
    const { onChange, store, styles, defaultValue, valueField, textField, data} = this.props;
    return(
      <div>
        <Combobox
          value={store} 
          onChange={onChange}
          style={styles}
          defaultValue={defaultValue}
          valueField={valueField}
          textField={textField}
          data={data}
          minLength={3}
          filter='contains'
          />
      </div>
    );
  }
}

ComponentTypeDocument.PropTypes = {
  onChange: PropTypes.func,
  store: PropTypes.object,
  styles: PropTypes.object,
  defaultValue: PropTypes.string,
  constant: PropTypes.string,
  valueField: PropTypes.string,
  textField: PropTypes.string,
  data: PropTypes.array
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({selectsReducer}, ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentTypeDocument);
