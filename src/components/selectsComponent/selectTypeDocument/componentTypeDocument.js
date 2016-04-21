import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultDataSelect} from '../actions';
import {Combobox} from 'react-widgets';
import {CLIENT_ID_TYPE} from '../constants';

class ComponentTypeDocument extends Component{
  componentWillMount(){
    const {consultDataSelect} = this.props;
    consultDataSelect(CLIENT_ID_TYPE);
  }

  render(){
    const {selectsReducer, onChange, store, styles, defaultValue} = this.props;
    const dataTypeDocument = selectsReducer.get('dataTypeDocument');
    return(
      <div>
        <Combobox
          value={store}
          onChange={onChange}
          valueField='id'
          textField='value'
          data={dataTypeDocument} minLength={3} filter='contains'
          style={styles}
          defaultValue={defaultValue}/>
      </div>
    );
  }

}

ComponentTypeDocument.PropTypes = {
    onChange: PropTypes.func,
    store: PropTypes.object,
    styles: PropTypes.object,
    defaultValue: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultDataSelect
  }, dispatch);
}

function mapStateToProps({selectsReducer}, ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentTypeDocument);
