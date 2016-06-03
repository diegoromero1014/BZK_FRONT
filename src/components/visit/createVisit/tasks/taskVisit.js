import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {deleteTask, clearTasks} from './actions';
import BotonCreateContactComponent from './botonCreateTaskVisit';
import ListTasks from './listTasks';

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
    const {error, handleSubmit, tasks} = this.props;
    return(
      <form className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <Row style={{padding: "10px 10px 0px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 10px 20px"}}>
          <Col xs={11} md={11} lg={11}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <i className="users icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "22px"}}> Pendientes de la reunión</span>
            </div>
          </Col>
          <Col xs={1} md={1} lg={1}>
            <BotonCreateContactComponent/>
          </Col>
        </Row>
        {tasks.size > 0 ?
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs>
              <ListTasks />
            </Col>
          </Row> :
          <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
            <h4 className="form-item">Señor usuario, no se han adicionado pendientes.</h4>
          </div>
        }
      </form>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    deleteTask,
    clearTasks
  }, dispatch);
}

function mapStateToProps({tasks, selectsReducer}, ownerProps){
    return {
      tasks,
      selectsReducer
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(TaskVisit);
