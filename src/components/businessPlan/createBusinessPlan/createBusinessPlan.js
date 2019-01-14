import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HeaderBusinessPlan from '../headerBusinessPlan';
import FormBusinessPlan from './formBusinessPlan';

import { redirectUrl } from '../../globalComponents/actions';

class CreateBusinessPlan extends Component {

  componentWillMount() {
    const { clientInformacion } = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if (_.isEmpty(infoClient)) {
      redirectUrl("/dashboard/clientInformation");
    }
  }

  render() {
    return (
      <div>
        <HeaderBusinessPlan />
        <FormBusinessPlan />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({ clientInformacion }, ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBusinessPlan);