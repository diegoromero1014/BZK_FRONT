import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultDataSelect} from '../actions';
import {Combobox} from 'react-widgets';
import {CLIENT_ID_TYPE} from '../constants';

class ComponentTypeDocument extends Component{
  constructor( props ) {
    super(props);
  }

  componentWillMount(){
    const {consultDataSelect} = this.props;
    consultDataSelect(CLIENT_ID_TYPE);
  }

  render(){
    const {selectsReducer} = this.props;
    console.log("sltTypeDocument", selectsReducer);
    const {dataTypeDocument} = selectsReducer;
    console.log("dataTypeDocument", dataTypeDocument);
    return(
      <div>
        <Combobox valueField='id' textField='name' data={dataTypeDocument} />
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultDataSelect
  }, dispatch);
}

function mapStateToProps({selectsReducer},ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentTypeDocument);
