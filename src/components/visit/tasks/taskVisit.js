import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {deleteTask, clearTasks} from './actions';
import BotonCreateContactComponent from './botonCreateTaskVisit';
import ListTasks from './listTasks';

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
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <Row style={{padding: "20px 10px 0px 20px"}}>
          <Col xs={11} md={11} lg={11}>
          <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
            <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}></div>
            <i className="browser icon" style={{fontSize: "18px"}}/>
            <span style={{fontSize: "20px"}}> Pendientes</span>
          </div>
          </Col>
          {disabled === '' || disabled === undefined ?
            <Col xs={1} md={1} lg={1} style={{marginTop: "15px"}}>
              <BotonCreateContactComponent/>
            </Col>
          : ''}
        </Row>
        {tasks.size > 0 ?
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs>
              <ListTasks disabled={disabled}/>
            </Col>
          </Row> :
          <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
            <h4 className="form-item">Señor usuario, no se han adicionado pendientes.</h4>
          </div>
        }
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
