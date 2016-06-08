import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import HeaderPrevisita from '../../previsita/createPrevisita/headerPrevisita';

class EditVisit extends Component{

  componentWillMount(){
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    /*if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    }*/
  }

  render(){
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    return(
      <div>
        Editar Visita
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

export default connect(mapStateToProps, mapDispatchToProps)(EditVisit);
