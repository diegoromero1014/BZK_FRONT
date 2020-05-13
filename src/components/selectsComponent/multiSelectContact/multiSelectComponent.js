import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultDataSelect } from '../actions';
import { Multiselect } from 'react-widgets';
import { FILTER_FUNCTION_ID, FILTER_TYPE_LBO_ID, FILTER_HOBBIES, FILTER_SPORTS } from '../constants';

export class MultiSelectComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { dispatchConsultDataSelect, idTypeFilter } = this.props;
    dispatchConsultDataSelect(idTypeFilter);
  }

  render() {
    const { selectsReducer, idTypeFilter } = this.props;
    var data = [];
    if (idTypeFilter === FILTER_FUNCTION_ID) {
      data = selectsReducer.get('dataTypeFunction');
    } else if (idTypeFilter === FILTER_TYPE_LBO_ID) {
      data = selectsReducer.get('dataTypeLBO');
    } else if (idTypeFilter === FILTER_HOBBIES) {
      data = selectsReducer.get('dataTypeHobbies');
    } else if (idTypeFilter === FILTER_SPORTS) {
      data = selectsReducer.get('dataTypeSports');
    }
    return (
      <Multiselect
        onChange={value => this.setState({ value })}
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


const mapDispatchToProps = dispatch => bindActionCreators({
  dispatchConsultDataSelect: consultDataSelect
}, dispatch);

const mapStateToProps = ({ selectsReducer }) => ({ selectsReducer })

export default connect(mapStateToProps, mapDispatchToProps)(MultiSelectComponent);
