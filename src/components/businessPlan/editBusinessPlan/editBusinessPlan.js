import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectUrl } from '../../globalComponents/actions';
import FormEdit from './formEdit';
import _ from "lodash";
import ReportsHeader from "../../globalComponents/reportsHeader/component";

class EditBusinessPlan extends Component {

  componentWillMount() {
    const { clientInformacion } = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if (_.isEmpty(infoClient)) {
      redirectUrl("/dashboard/clientInformation");
    }
  }

  render() {
    const { params: { id } } = this.props;
    return (
      <div>
        <ReportsHeader/>
        <FormEdit id={id} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditBusinessPlan);