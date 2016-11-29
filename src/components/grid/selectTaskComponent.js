import React, {Component,PropTypes} from 'react';
import {APP_URL} from '../../constantsGlobal';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {TASK_STATUS} from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {updateStatusTask, tasksByUser} from '../myPendings/actions';
import {NUMBER_RECORDS} from '../myPendings/constants';

let key = 1;
class SelectTaskComponent extends Component {

  constructor(props){
      super(props);
      this.state = {
        idEstado: null,
        idTask: null
      };
      this.onChangeValue = this.onChangeValue.bind(this);
  }

  componentWillMount(){
    const {valueStatus} = this.props;
    this.setState({
      idEstado :valueStatus.idStatus,
      idTask: valueStatus.idTask
    });
  }

  onChangeValue(idValueStatus){
    const {updateStatusTask, tasksByUser} = this.props;
    updateStatusTask(this.state.idTask, idValueStatus).then( (data) => {
      if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
        redirectUrl("/login");
      } else {
        tasksByUser(0, NUMBER_RECORDS, "");
      }
    });
  }

  render(){
  const {colorTraffict, selectsReducer} = this.props;
    return (
      <td>
        <ComboBox name={key++} labelInput="Seleccione"
          value={this.state.idEstado}
          valueProp={'id'}
          textProp = {'value'}
          data={selectsReducer.get(TASK_STATUS) || []}
          onChange={val => this.onChangeValue(val)}
          onBlur={() => ''}
          defaultValue={this.state.idEstado}
          />
      </td>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateStatusTask,
    tasksByUser
  }, dispatch);
}

function mapStateToProps({selectsReducer}, {taskEdit}){
  return {
    selectsReducer
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTaskComponent);
