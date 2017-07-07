import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {deleteTask, clearTasks} from './actions';
import ListTasks from './listTasks';
import ToolTip from '../../toolTip/toolTipComponent';

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
        style={{backgroundColor: "#FFFFFF",  width: "100%"}}>
        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
                <i className="browser icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Pendientes </span>
                <ToolTip text={titleHelpTask}>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}}/>
                </ToolTip>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 10px 20px"}}>
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
