import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultDataSelect} from '../actions';
import {Combobox} from 'react-widgets';
import {FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID,FILTER_TYPE_LBO_ID} from '../constants';


class SelectFilterComponent extends Component{
  componentWillMount(){
    const {consultDataSelect,idTypeFilter} = this.props;
    consultDataSelect(idTypeFilter);
  }

  render(){
    const {selectsReducer, idTypeFilter} = this.props;
    var data =[];
    if(idTypeFilter == FILTER_FUNCTION_ID){
      data = selectsReducer.get('dataTypeFunction');
    }else if(idTypeFilter == FILTER_TYPE_CONTACT_ID) {
      data = selectsReducer.get('dataTypeContact');
    }else if(idTypeFilter == FILTER_TYPE_LBO_ID) {
      data = selectsReducer.get('dataTypeLBO');
    }
    return(
        <Combobox
          valueField='id'
          textField='value'
          data={data} minLength={3} filter='contains' />
    );
  }

}

SelectFilterComponent.PropTypes = {
    idTypeFilter:PropTypes.string
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectFilterComponent);
