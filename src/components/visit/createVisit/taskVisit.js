import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {consultDataSelect, consultList, getMasterDataFields} from '../../selectsComponent/actions';

const fields = [];

const validate = values => {
    const errors = {}
    return errors;
};

class TaskVisit extends Component{

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  render(){
    const {clientInformacion, selectsReducer, handleSubmit} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    return(
      <form className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="users icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "22px"}}> Pendientes de la reunión</span>
            </div>
          </Col>
        </Row>
      </form>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    consultDataSelect,
    consultList,
    getMasterDataFields
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer}, ownerProps){
    return {
      clientInformacion,
      selectsReducer
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(TaskVisit);
