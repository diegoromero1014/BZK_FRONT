import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {deleteTask, clearTasks} from './actions';
import ListTasks from './listTasks';

const titleHelpTask = "En esta sección se podrán registrar las tareas que quedaron de la reunión.\n" +
        "Estas quedarán automáticamente creadas en la pestaña de tareas y desde allí se deberá " +
        " hacer el seguimiento de las mismas, registrar las observaciones y el estado (pendiente, cerrada, cancelada).";
class TaskVisit extends Component{

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const{clearTasks} = this.props;
    clearTasks();
  }

  render(){
    const {tasks, disabled} = this.props;
    return(
      <div className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "10px"}}>
        <Row xs={12} md={12} lg={12} style={{padding: "20px 10px 0px 30px"}}>
          <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}></div>
        </Row>
        <Row>
          <Col xs={11} md={11} lg={11} style={{paddingLeft: "30px"}}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "0px", marginBottom: "5px"}}>
              <i className="browser icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Pendientes </span>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title={titleHelpTask}/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 0px 20px 10px"}}>
          <Col xs>
            <ListTasks disabled={disabled}/>
          </Col>
        </Row>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    deleteTask,
    clearTasks
  }, dispatch);
}

function mapStateToProps({tasks}, ownerProps){
    return {
      tasks
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskVisit);
