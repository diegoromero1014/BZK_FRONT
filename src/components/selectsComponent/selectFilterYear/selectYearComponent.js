import React, { Component, PropTypes } from 'react';
import { Combobox } from 'react-widgets';
import { TYPE_YEAR } from '../constants';
import moment from 'moment';

class SelectYearComponent extends Component{

  constructor(props){
      super(props);
  }

  render(){
      const {
          selectsReducer,
          idTypeFilter,
          defaultValue,
          onChange,
          config,
          disabled
      } = this.props;
      var data = [];
      if (idTypeFilter === TYPE_YEAR) {
        var i;
          for(i = moment('01-01-2015').year();i <= moment().year(); i++){
            var year = {};
            year.id = i + "";
            year.value = i + "";
            data.push(year);
          }
      }
      return(
          <Combobox
              style = {{height: '30px',float: 'left',margin: '12px 0px', width: '100%'}}
              id="year"
              valueField='id'
              textField='value'
              data={data}
              defaultValue={moment().year() + ""}
              minLength={3}
              placeholder='Año'
              filter='contains'
              onChange={onChange}
              disabled={disabled}
              {...config}
          />
      );
  }

}

SelectYearComponent.PropTypes = {
    idTypeFilter:PropTypes.string,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func
};




export default SelectYearComponent;
