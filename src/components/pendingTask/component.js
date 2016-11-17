import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tasksByClientFindServer, clearUserTask} from './actions';
import {Combobox} from 'react-widgets';
import {NUMBER_RECORDS,TASK_STATUS} from './constants';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import PaginationPendingTaskComponent from './paginationPendingTaskComponent';
import ListPendingTaskComponent from './listPendingTaskComponent';
import ButtonCreatePendingTaskComponent from './createPendingTask/buttonCreatePendingTaskComponent';
import {MODULE_TASKS, CREAR} from '../../constantsGlobal';
import {validatePermissionsByModule} from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import {redirectUrl} from '../globalComponents/actions';

class UserTaskComponent extends Component {

  constructor(props) {
     super(props);
     this.state = {
       openMessagePermissions: false,
       value1: ""
     };

  }

  componentWillMount() {
    if( window.localStorage.getItem('sessionToken') === "" ) {
      redirectUrl("/login");
    } else {
      const {tasksByClientFindServer,tasksByClient,clearUserTask, validatePermissionsByModule} = this.props;
      clearUserTask();
      tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS,"c.closingDate", 0, "");
      validatePermissionsByModule(MODULE_TASKS).then((data) => {
        if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          redirectUrl("/login");
        } else {
          if( !_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false' ) {
            this.setState({ openMessagePermissions: true });
          }
        }
      });
    }
  }

  render() {
    const {tasksByClient, reducerGlobal} = this.props;
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
          idTypeFilter={TASK_STATUS}/>
          </Col>
          <Col xs>
            { _.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), CREAR), false) &&
                <ButtonCreatePendingTaskComponent/>
            }
          </Col>
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
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tasksByClientFindServer, clearUserTask,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({tasksByClient, reducerGlobal}, ownerProps) {
  return {
    tasksByClient,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTaskComponent);
