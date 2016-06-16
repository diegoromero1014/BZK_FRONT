import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tasksByClientFindServer, clearUserTask} from './actions';
import {Combobox} from 'react-widgets';
import {NUMBER_RECORDS,FILTER_STATUS_TASK_ID} from './constants';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import PaginationPendingTaskComponent from './paginationPendingTaskComponent';
import ListPendingTaskComponent from './listPendingTaskComponent';
import ButtonCreatePendingTaskComponent from './createPendingTask/buttonCreatePendingTaskComponent';

class UserTaskComponent extends Component {

  constructor(props) {
     super(props);
     this.state = {value1: ""};

  }

  componentWillMount() {
    if( window.localStorage.getItem('sessionToken') === "" ) {
      redirectUrl("/login");
    } else {
      const {tasksByClientFindServer,tasksByClient,clearUserTask} = this.props;
      clearUserTask();
      tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS,"c.closingDate", 0, "");
    }
  }

  render() {
    const {tasksByClient} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if(tasksByClient.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className = "tab-pane quickZoomIn animated" style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        <Grid style={{ width: "100%"}}>
          <Row>
          <Col xs><span style={{fontWeight:'bold',color:'#4C5360'}}>Estado de la tarea:</span>
          <SelectFilterContact config={{
              onChange: (value) => this.setState({value1: value.id})
          }}
          idTypeFilter={FILTER_STATUS_TASK_ID}/>
          </Col>
          <Col xs>  <ButtonCreatePendingTaskComponent/>  </Col>
          </Row>
        </Grid>
        </div>
        <Grid style= {{display:visibleTable, width: "100%"}}>
          <Row>
            <Col xs>
              <ListPendingTaskComponent value1={this.state.value1}/>
              <PaginationPendingTaskComponent value1={this.state.value1}/>
          </Col>
          </Row>
        </Grid>
        <Grid style= {{display:visibleMessage, width: "100%"}}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}>
              <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tasksByClientFindServer, clearUserTask
  }, dispatch);
}

function mapStateToProps({tasksByClient}, ownerProps) {
  return {
    tasksByClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTaskComponent);
