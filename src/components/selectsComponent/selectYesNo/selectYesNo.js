import React, {Component, PropTypes} from 'react';
import {Combobox} from 'react-widgets';

const valores = [
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
]

class SelectYesNo extends Component{

  render(){
    const {onChange, store} = this.props;
    return(
      <div>
        <Combobox
          value={store}
          onChange={onChange}
          valueField='id'
          textField='value'
          data={valores} minLength={3} filter='contains' />
      </div>
    );
  }

}

SelectYesNo.PropTypes = {
    onChange: PropTypes.func,
    store: PropTypes.object
};

export default SelectYesNo;
