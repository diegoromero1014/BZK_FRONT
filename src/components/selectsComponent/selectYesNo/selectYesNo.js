import React, { Component, PropTypes } from 'react';
import { Combobox } from 'react-widgets';

const valores = [
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
]

class SelectYesNo extends Component{

  render(){
    const {onChange, store, styles} = this.props;
    return(
      <div>
        <Combobox
          value={store}
          onChange={onChange}
          valueField='id'
          textField='value'
          style={styles}
          data={valores} minLength={3} filter='contains' />
      </div>
    );
  }

}

SelectYesNo.PropTypes = {
    onChange: PropTypes.func,
    store: PropTypes.object,
    styles: PropTypes.object,
};

export default SelectYesNo;
