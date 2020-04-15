import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormBusinessPlan from './formBusinessPlan';
import { redirectUrl } from '../../globalComponents/actions';
import ReportsHeader from "../../globalComponents/reportsHeader/component";

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
        <ReportsHeader/>
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