import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultDataSelect } from '../actions';
import { Multiselect } from 'react-widgets';
import { FILTER_FUNCTION_ID, FILTER_TYPE_LBO_ID, FILTER_HOBBIES, FILTER_SPORTS } from '../constants';

class MultiSelectComponent extends Component{

  constructor(props){
      super(props);
  }

  componentWillMount(){
    const {consultDataSelect, idTypeFilter} = this.props;
    consultDataSelect(idTypeFilter);
  }

  render(){
      const { selectsReducer, idTypeFilter } = this.props;
      var data =[];
      if(idTypeFilter === FILTER_FUNCTION_ID){
        data = selectsReducer.get('dataTypeFunction');
      } else if(idTypeFilter === FILTER_TYPE_LBO_ID) {
        data = selectsReducer.get('dataTypeLBO'); 
      } else if (idTypeFilter === FILTER_HOBBIES) {
        data = selectsReducer.get('dataTypeHobbies');
      } else if (idTypeFilter === FILTER_SPORTS) {
        data = selectsReducer.get('dataTypeSports');
      }
      return(
          <Multiselect
              onChange = {value => this.setState({value})}
              valueField='id'
              textField='value'
              data={data}
              minLength={3}
              filter='contains'
          />
      );
  }

}

MultiSelectComponent.PropTypes = {
    idTypeFilter: PropTypes.string
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

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelectComponent);
