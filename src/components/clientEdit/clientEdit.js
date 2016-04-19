import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/SelectTypeDocument/ComponentTypeDocument';

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
      <form>
        <Row style={{padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
          <Col xs={12} md={4} lg={5}>
            <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
            <SelectTypeDocument
            />
          </Col>
          <Col xs={10} md={4} lg={5}>
            <dt><span>Número de documento (</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                type="text"
                className="form-control"
                style={{height: "22px !important", minHeight: "26px !important"}}
                required
                placeholder="Ingrese el número de documento del usuario"
              />
          </Col>
          <Col xs={2} md={4} lg={2}>
            <button className="btn btn-default" type="submit" title="Crear prospecto"
              style={{backgroundColor:"#66778d", marginLeft:"30px", marginTop: "25px", paddingTop: "4px !important"}}>
              <i className="icon-search" style={{color: "white"}}></i>
            </button>
          </Col>
        </Row>
      </form>
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
