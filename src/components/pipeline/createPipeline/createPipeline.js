import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HeaderPipeline from '../headerPipeline';
import FormPipeline from './formPipeline';
import {redirectUrl} from '../../globalComponents/actions';

class CreatePipeline extends Component {

  componentWillMount() {
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)) {
        redirectUrl("/dashboard/clientInformation");
    }
  }

  render() {
    return(
      <div>
        <HeaderPipeline />
        <FormPipeline />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps) {
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePipeline);
