import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultListWithParameter } from '../actions';
import {Combobox} from 'react-widgets';
import {SUB_CIIU} from '../constants';

class SelectSubCIIU extends Component{
  componentWillMount(){
    const {consultListWithParameter, parentId} = this.props;
    consultListWithParameter(SUB_CIIU, parentId);
  }

  render(){
    const {selectsReducer, onChange, store, styles, defaultValue} = this.props;
    const dataSubCIIU = selectsReducer.get('dataSubCIIU');
    return(
      <div>
        <Combobox
          value={store}
          onChange={onChange}
          valueField='id'
          textField='subCiiu'
          data={dataSubCIIU} minLength={3} filter='contains'
          style={styles}
          defaultValue={defaultValue}/>
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
