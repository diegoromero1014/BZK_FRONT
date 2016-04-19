import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultDataSelect} from '../actions';
import {Combobox} from 'react-widgets';
import {CLIENT_ID_TYPE} from '../constants';

var typeDocument = [
  { id: 0, name: 'TI', value: "sadsad"},
  { id: 1, name: 'CC', value: "sadsad"},
  { id: 2, name: 'NIT', value: "sadsad"}
];

class ComponentTypeDocument extends Component{
  componentWillMount(){
    const {consultDataSelect} = this.props;
    consultDataSelect(CLIENT_ID_TYPE);
  }

  render(){
    const {selectsReducer, onChange, store} = this.props;
    console.log("selectsReducer", selectsReducer);
    const dataTypeDocument = selectsReducer.get('dataTypeDocument');
    console.log("dataTypeDocument",dataTypeDocument);
    return(
      <div>
        <Combobox
          value={store}
          onChange={onChange}
          valueField='id'
          textField='value'
          data={dataTypeDocument} minLength={3} filter='contains' />
      </div>
    );
  }

}

ComponentTypeDocument.PropTypes = {
    onChange: PropTypes.func,
    store: PropTypes.object
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
