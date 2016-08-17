import React, {Component, PropTypes} from 'react';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import {TYPE_YEAR} from '../constants';
import moment from 'moment';

class SelectYearComponent extends Component{

  constructor(props){
      super(props);
  }

  render(){
      const {selectsReducer, idTypeFilter, defaultValue, onChange, config, disabled, value, styles} = this.props;
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
          <ComboBox
            {...config}
            styles = {styles}
            id="year"
            valueProp={'id'}
            textProp={'value'}
            data={data}
            value={value}
            onBlur={() => ''}
            placeholder='Año'
            onChange={onChange}
            disabled={disabled}
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
