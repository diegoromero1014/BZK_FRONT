import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultList } from '../actions';
import { Combobox } from 'react-widgets';
import { CIIU } from '../constants';

class SelectCIIU extends Component{
  componentWillMount(){
    const {consultList} = this.props;
    consultList(CIIU);
  }

  render(){
    const {selectsReducer, onChange, store, styles, defaultValue} = this.props;
    const dataCIIU = selectsReducer.get('dataCIIU');
    return(
      <div>
        <Combobox
          value={store}
          onChange={onChange}
          valueField='id'
          textField='ciiu'
          data={dataCIIU} minLength={3} filter='contains'
          style={styles}
          defaultValue={defaultValue}/>
      </div>
    );
  }

}

SelectCIIU.PropTypes = {
    onChange: PropTypes.func,
    store: PropTypes.object,
    styles: PropTypes.object,
    defaultValue: PropTypes.string
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultList
  }, dispatch);
}

function mapStateToProps({selectsReducer}, ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCIIU);
