import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';

class clientEdit extends Component{
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    }else{
      if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
      }
    }
  }

  render(){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    return(
      <div>
        Aquí edito un cliente.
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({clientInformacion},ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(clientEdit);
