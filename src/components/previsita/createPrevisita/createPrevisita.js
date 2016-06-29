import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HeaderPrevisita from '../headerPrevisita';
import FormPrevisita from './formPrevisita';
import {redirectUrl} from '../../globalComponents/actions';

class CreatePrevisita extends Component{

  componentWillMount(){
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    }
  }

  render(){
    return(
      <div>
        <HeaderPrevisita/>
        <FormPrevisita/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps){
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePrevisita);
