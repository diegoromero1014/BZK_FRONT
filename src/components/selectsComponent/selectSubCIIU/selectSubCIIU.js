import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultListWithParameter } from '../actions';
import { DropdownList } from 'react-widgets';
import { SUB_CIIU } from '../constants';

var parentIdOld = null;

class SelectSubCIIU extends Component{
  componentWillMount(){
    const {consultListWithParameter, parentId} = this.props;
    parentIdOld = parentId;
    consultListWithParameter(SUB_CIIU, parentId);
  }

    _mapClientItems(item, idx) {
      return <option value={item.id}>{item.subCiiu}</option>;
    }

  render(){
    const {consultListWithParameter, selectsReducer, onChange, store, styles, defaultValue, parentId} = this.props;
    if(parentId !== parentIdOld){
      parentIdOld = parentId;
      consultListWithParameter(SUB_CIIU, parentId);
    }
    const dataSubCIIU = selectsReducer.get('dataSubCIIU');
    return(
      <div>

      <select>
        <option value='' selected></option>
        {dataSubCIIU.map(this._mapClientItems)}
      </select>
        <DropdownList
          valueField='id'
          textField='subCiiu'
          data={dataSubCIIU}
          defaultValue={defaultValue}
        />
      </div>

    );
  }

}

SelectSubCIIU.PropTypes = {
    onChange: PropTypes.func,
    store: PropTypes.object,
    styles: PropTypes.object,
    defaultValue: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultListWithParameter
  }, dispatch);
}

function mapStateToProps({selectsReducer}, ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSubCIIU);
