import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Combobox } from 'react-widgets';

import { consultDataSelect } from '../actions';

import { FILTER_STATUS_PREVISIT_ID } from '../../previsita/constants';
import { FILTER_STATUS_BUSINESS_PLAN_ID } from '../../businessPlan/constants';
import {
  FILTER_OUTDATE_CONTACT, TASK_STATUS, FILTER_STATUS_VISIT_ID, SHAREHOLDER_TYPE, SHAREHOLDER_KIND, CLIENT_ID_TYPE, FILTER_FUNCTION_ID,
  FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_GENDER, FILTER_TITLE, FILTER_CONTACT_POSITION, FILTER_DEPENDENCY,
  FILTER_SOCIAL_STYLE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, PIPELINE_STATUS, FILTER_STATUS_PIPELINE_ID, CLIENT_TYPE
} from '../constants';

const defaultData = [{ id: '0', value: 'Guardado como borrador' }, { id: '1', value: 'Guardado como definitivo' }];

class SelectFilterComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { consultDataSelect, idTypeFilter } = this.props;
    consultDataSelect(idTypeFilter);
  }

  messages() {
    return {
      open: 'Lista abierta',
      emptyList: 'En está lista no hay valores',
      emptyFilter: 'No hay valores que cumplan con el filtro'
    }
  }

  render() {
    const {
      selectsReducer,
      idTypeFilter,
      defaultValue,
      onChange,
      config,
      disabled,
      dataDefault
    } = this.props;

    var data = [];
    if (idTypeFilter === CLIENT_ID_TYPE) {
      data = selectsReducer.get('dataTypeDocument');
    } else if (idTypeFilter === FILTER_FUNCTION_ID) {
      data = selectsReducer.get('dataTypeFunction');
    } else if (idTypeFilter === PIPELINE_STATUS) {
      data = selectsReducer.get('dataPipelineStatus');
    } else if (idTypeFilter === FILTER_TYPE_CONTACT_ID) {
      data = selectsReducer.get('dataTypeContact');
    } else if (idTypeFilter === FILTER_TYPE_LBO_ID) {
      data = selectsReducer.get('dataTypeLBO');
    } else if (idTypeFilter === FILTER_GENDER) {
      data = selectsReducer.get('dataTypeGender');
    } else if (idTypeFilter === FILTER_TITLE) {
      data = selectsReducer.get('dataTypeTitle');
    } else if (idTypeFilter === FILTER_CONTACT_POSITION) {
      data = selectsReducer.get('dataTypeContactPosition');
    } else if (idTypeFilter === FILTER_DEPENDENCY) {
      data = selectsReducer.get('dataTypeDependency');
    } else if (idTypeFilter === FILTER_SOCIAL_STYLE) {
      data = selectsReducer.get('dataTypeSocialStyle');
    } else if (idTypeFilter === FILTER_COUNTRY) {
      data = selectsReducer.get('dataTypeCountry');
    } else if (idTypeFilter === FILTER_PROVINCE) {
      data = selectsReducer.get('dataTypeProvince');
    } else if (idTypeFilter === FILTER_CITY) {
      data = selectsReducer.get('dataTypeCity');
    } else if (idTypeFilter === SHAREHOLDER_KIND) {
      data = selectsReducer.get('dataTypeShareholdersKind');
    } else if (idTypeFilter === SHAREHOLDER_TYPE) {
      data = selectsReducer.get('dataTypeShareholdersType');
    } else if (idTypeFilter === FILTER_STATUS_VISIT_ID || idTypeFilter === FILTER_STATUS_PREVISIT_ID || idTypeFilter === FILTER_STATUS_PIPELINE_ID || idTypeFilter === FILTER_STATUS_BUSINESS_PLAN_ID) {
      data = defaultData;
    } else if (idTypeFilter === TASK_STATUS) {
      data = selectsReducer.get('dataTypeTaskType');
    } else if (idTypeFilter === CLIENT_TYPE) {
      data = selectsReducer.get('dataTypeClientType');
    } else if (idTypeFilter === FILTER_OUTDATE_CONTACT) {
      data = dataDefault;
    }
    return (
      <Combobox
        valueField='id'
        textField='value'
        data={data}
        minLength={3}
        filter='contains'
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        messages={this.messages()}
        {...config}
      />
    );
  }

}

SelectFilterComponent.PropTypes = {
  idTypeFilter: PropTypes.string,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultDataSelect
  }, dispatch);
}

function mapStateToProps({ selectsReducer }, ownerProps) {
  return {
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectFilterComponent);