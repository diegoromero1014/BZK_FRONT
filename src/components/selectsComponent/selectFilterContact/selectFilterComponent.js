import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultDataSelect} from '../actions';
import {Combobox} from 'react-widgets';
import {FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID,FILTER_TYPE_LBO_ID, FILTER_GENDER, FILTER_TITLE, FILTER_DEPENDENCY, FILTER_SOCIAL_STYLE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY} from '../constants';


class SelectFilterComponent extends Component{

  constructor(props){
      super(props);
  }

  componentWillMount(){
    const {consultDataSelect,idTypeFilter} = this.props;
    consultDataSelect(idTypeFilter);
  }

  render(){
      const {
          selectsReducer,
          idTypeFilter,
          config
      } = this.props;
      var data =[];
      if(idTypeFilter === FILTER_FUNCTION_ID){
          data = selectsReducer.get('dataTypeFunction');
      }else if(idTypeFilter === FILTER_TYPE_CONTACT_ID) {
          data = selectsReducer.get('dataTypeContact');
      }else if(idTypeFilter === FILTER_TYPE_LBO_ID) {
          data = selectsReducer.get('dataTypeLBO');
      } else if (idTypeFilter == FILTER_GENDER) {
        data = selectsReducer.get('dataTypeGender');
      } else if (idTypeFilter == FILTER_TITLE) {
        data = selectsReducer.get('dataTypeTitle');
      } else if (idTypeFilter == FILTER_DEPENDENCY) {
        data = selectsReducer.get('dataTypeDependency');
      } else if (idTypeFilter == FILTER_SOCIAL_STYLE) {
        data = selectsReducer.get('dataTypeSocialStyle');
      } else if (idTypeFilter == FILTER_COUNTRY) {
        data = selectsReducer.get('dataTypeCountry');
      } else if (idTypeFilter == FILTER_PROVINCE) {
        data = selectsReducer.get('dataTypeProvince');
      } else if (idTypeFilter == FILTER_CITY) {
        data = selectsReducer.get('dataTypeCity');
      }
      return(
          <Combobox
              valueField='id'
              textField='value'
              data={data}
              minLength={3}
              filter='contains'
              {...config}
          />
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
